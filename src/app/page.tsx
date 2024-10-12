'use client'
import React, { useEffect, useState } from 'react'
import { useTelegram } from '@/context/telegramContext'
import { useNav } from '@/context/navContext'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { HeaderSection } from '@/app/components/headerSection'
import { Categories, ExecutorResponseData, Level, PageState } from '@/app/types'
import {
  authorization,
  cancelProject,
  confirmProject,
  getAllConfirmProjects,
  getAllDisputes,
  getCategories,
  getCloudStorageItem,
  getExecutorProject,
  getLevels,
  getNameExecutorProject,
  getNowWorkTime,
  setCloudStorageItem,
  updateShortcutClicks,
  userInfoForPage,
} from '@/app/API'
import { OrdersAcceptSection } from '@/app/components/ordersAcceptSection'
import { IWebApp } from '@/context/types'
import { ScheduleSection } from '@/app/components/scheduleSection'
import { TasksProgress } from '@/app/components/progress'
import { TitlePage } from '@/app/components/titlePage'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  SolutionOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Modal, Spin } from 'antd'
import User, { colorFind } from '@/app/components/user'
import Link from 'next/link'
import { DisputeItem } from './components/dispute-item'
import { DrawerDispute } from './components/drawerDispute'
import { TextDispute } from './components/text-dispute'

export default function Home() {
  const [categories, setCategories] = useState<Categories[] | undefined>(
    undefined,
  )
  const { user, webApp } = useTelegram()
  const [levelInfo, setLevelInfo] = useState<Level[] | undefined>(undefined)

  const { setActiveButton, setShowNavigation } = useNav()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [auth, setAuth] = useState<'newUser' | 'user' | null>(null)
  const [page, setPage] = useState<PageState | null>(null)
  const [activeProjects, setActiveProjects] = useState<
    | {
        id: number
        user_id: number
        category_id: number
        executor_id: number | null
        level_id: number
        time: number
        question: string
        created_at: string
        video_cal_url: string
        category_name: string
        info: {
          project_id: number
          description: string
          start_time: string | null
          end_time: string | null
          duration: number
          files: null
          time_response_seconds: null
        }
        price: {
          project_id: number
          level_id: number
          price: number
        }
        status:
          | 'search_executor'
          | 'waiting_executor_confirm'
          | 'waiting_start'
          | 'working'
          | 'closed'
          | 'canceled'
          | 'dispute'
      }[]
    | null
  >([])

  useEffect(() => {
    getCategories().then(r => {
      if (r) {
        setCategories(r)
      }
    })
  }, [])

  useEffect(() => {
    getLevels().then(r => {
      if (r) {
        setLevelInfo(r)
      }
    })
  }, [])

  const [userNames, setUserNames] = useState<
    { project_id: number; name: string | null }[]
  >([])

  useEffect(() => {
    if (activeProjects) {
      const names: { project_id: number; name: string }[] = []

      for (let i = 0; i < activeProjects.length; i++) {
        getNameExecutorProject({
          for_executor: true,
          project_id: activeProjects[i].id,
        }).then(r => {
          if (r) {
            names.push({
              project_id: activeProjects[i].id,
              name: r,
            })
          }
        })
      }

      setUserNames(names)
    }
  }, [activeProjects])

  useEffect(() => {
    if (webApp && user) {
      console.log('WEBAPP', webApp)
      const handleThemeChange = () => {
        document.documentElement.style.setProperty(
          '--tg-second-section-color',
          webApp.colorScheme === 'light' ? '#F0F0F0' : '#222222',
        )
        document.documentElement.style.setProperty(
          '--tg-theme-section-bg-color',
          webApp.colorScheme === 'light' ? '#FFFFFF' : '#181818',
        )
        document.documentElement.style.setProperty(
          '--tg-theme-secondary-bg-color',
          webApp.colorScheme === 'light' ? '#F0F0F0' : '#000000',
        )
      }
      const popupClosed = (eventData: { button_id: string | null }) => {
        if (eventData.button_id === 'closeWebApp') {
          window.Telegram.WebApp.close()
        }
      }

      setActiveButton('/')
      handleThemeChange()
      window.Telegram.WebApp.onEvent('themeChanged', handleThemeChange)
      window.Telegram.WebApp.onEvent('popupClosed', popupClosed)
      return () => {
        window.Telegram.WebApp.offEvent('themeChanged', handleThemeChange)
        window.Telegram.WebApp.offEvent('popupClosed', popupClosed)
      }
    }
  }, [webApp, user])

  useEffect(() => {
    if (webApp && user) {
      const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const start_param = window.Telegram.WebApp.initDataUnsafe.start_param
      if (
        params.has('inline') ||
        params.has('url') ||
        (start_param &&
          (start_param.includes('referrer') ||
            start_param.includes('shortcut')))
      ) {
        const start = async () => {
          const new_user = await authorization(
            user,
            webApp,
            start_param,
            time_zone,
          )
          if (new_user) setAuth('newUser')
          else setAuth('user')
        }
        start()
        if (start_param?.includes('shortcut')) {
          updateShortcutClicks(user.id, 1).then()
        }
        router.replace(pathname)
      } else {
        setAuth('user')
        console.log('ignore authorization')
      }
    }
    return () => {}
  }, [webApp, user])

  useEffect(() => {
    if (webApp && user && auth) {
      const start = async () => {
        const currentPage = await getCloudStorageItem('currentPage', false)
        if (!currentPage) {
          if (auth === 'user') {
            const result = await userInfoForPage(user)
            if (!result) return
            setPage(result)
            await setCloudStorageItem('currentPage', result.page)
          } else {
            setPage({ page: 'newUser', data: null })
          }
        } else {
          const result = await userInfoForPage(
            user,
            (currentPage as 'user') || 'executor',
          )
          if (!result) return
          setPage(result)
        }
      }
      start()
    }
  }, [webApp, user, auth])

  useEffect(() => {
    getExecutorProject().then(data => {
      setActiveProjects(data)
    })
  }, [])

  const [index, setIndex] = useState(0)
  const activeOrder = activeProjects?.[index]

  const next = () => {
    if (!activeProjects) return
    if (index + 1 === activeProjects?.length) {
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
  }
  const prev = () => {
    if (!activeProjects) return
    if (index === 0) {
      setIndex(activeProjects?.length - 1)
    } else {
      setIndex(index - 1)
    }
  }

  const [openDrawerDispute, setOpenDrawerDispute] = useState(false)

  const [disputeList, setDisputeList] = useState<
    {
      project_id: number
      user_id: number
      executor_id: number
      message: string
      category_name: string
      video_url: string
      admin_id: number | null
      active: boolean
      question: string
      created_at: string
      category: string
    }[]
  >([
    {
      project_id: 0,
      user_id: 0,
      executor_id: 0,
      message: '',
      category_name: '',
      video_url: '',
      admin_id: null,
      active: false,
      question: '',
      created_at: '',
      category: '',
    },
  ])

  function formatToUserTimezone(dateString: string): string {
    // Преобразуем строку в объект Date (UTC)
    const date = new Date(dateString)

    // Получаем смещение временной зоны пользователя в минутах
    const timezoneOffsetMinutes = date.getTimezoneOffset()

    // Применяем смещение к дате
    const userDate = new Date(
      date.getTime() - timezoneOffsetMinutes * 60 * 1000,
    )

    // Получаем компоненты даты с учётом локального времени пользователя
    const day = String(userDate.getDate()).padStart(2, '0') // День с ведущим нулём
    const month = String(userDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
    const year = userDate.getFullYear()

    // Получаем компоненты времени с учётом локального времени пользователя
    const hours = String(userDate.getHours()).padStart(2, '0')
    const minutes = String(userDate.getMinutes()).padStart(2, '0')

    // Форматируем в строку "dd.mm.yyyy hh:mm"
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  console.log(categories)

  const fetchDisputeList = async () => {
    getAllDisputes({ for_executor: true }).then(data => {
      // setDisputeList(data)
    })
  }

  useEffect(() => {
    fetchDisputeList()
  }, [])

  function isTimePassed(targetTime: string): boolean {
    // Разделяем строку на дату и время
    const [datePart, timePart] = targetTime.split(' ')
    const [day, month, year] = datePart.split('.').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)

    // Создаём объект даты на основе переданных значений
    const targetDate = new Date(year, month - 1, day, hours, minutes)

    // Получаем текущую дату
    const currentDate = new Date()

    // Возвращаем true, если целевая дата меньше или равна текущей дате (время наступило)
    return targetDate <= currentDate
  }

  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(0)
  const [confirmProjects, setConfirmProjects] = useState<
    {
      project_id: number
      client_confirm: boolean
      executor_confirm: boolean
      created_at: string
      question: string
      category_name: string
    }[]
  >([])

  const fetchAllConfirmProjects = async () => {
    getAllConfirmProjects({ for_executor: true }).then(data => {
      setConfirmProjects(data)
    })
  }

  useEffect(() => {
    fetchAllConfirmProjects()
  }, [])

  const [loadingNone, setLoadingNone] = useState<boolean>(false)
  const [loadingYes, setLoadingYes] = useState<boolean>(false)
  const [loadingCancel, setLoadingCancel] = useState<boolean>(false)

  const handleClose = async (string: 'yes' | 'none', boolean: boolean) => {
    if (string === 'yes') {
      setLoadingYes(true)
    } else {
      setLoadingNone(true)
    }

    await confirmProject({
      project_id: confirmProjects[currentModalIndex!].project_id,
      value: boolean,
      for_executor: true,
    }).then(() => {
      setLoadingNone(false)
      setLoadingYes(false)
      getExecutorProject().then(data => {
        setActiveProjects(data)
      })
    })
    if (
      currentModalIndex !== null &&
      currentModalIndex < confirmProjects.length - 1
    ) {
      setCurrentModalIndex(currentModalIndex + 1) // Открыть следующую модалку
    } else {
      setCurrentModalIndex(null) // Закрыть все модалки, если это была последняя
      fetchAllConfirmProjects()
    }
  }

  const handleEndProject = () => {
    if (activeOrder) {
      setConfirmProjects([
        {
          category_name: '',
          client_confirm: false,
          created_at: '',
          executor_confirm: false,
          project_id: activeOrder?.id,
          question: '',
        },
      ])

      setCurrentModalIndex(0)
    }
  }

  const handleCloseProject = (id: number) => {
    cancelProject(id).then(() => {
      getExecutorProject().then(data => {
        setActiveProjects(data)
        setLoadingCancel(false)
      })
    })
  }

  const [disputeIndex, setDisputeIndex] = useState<number>(0)

  const nextDispute = () => {
    if (disputeIndex + 1 === disputeList?.length) {
      setDisputeIndex(0)
    } else {
      setDisputeIndex(disputeIndex + 1)
    }
  }

  const prevDispute = () => {
    if (disputeIndex === 0) {
      setDisputeIndex(disputeList?.length - 1)
    } else {
      setDisputeIndex(disputeIndex - 1)
    }
  }

  const [showCancelModal, setShowCancelModal] = useState(false)

  function executorPage(pageData: ExecutorResponseData) {
    setShowNavigation(true)
    const user = pageData.user
    const executor = pageData.executor
    return (
      <main className='flex w-full flex-col bg-tg-secondary-background-color items-center'>
        <DrawerDispute
          open={openDrawerDispute}
          setOpen={setOpenDrawerDispute}
        />
        <ConfigProvider
          theme={{
            components: {
              Modal: {
                contentBg: 'var(--tg-theme-section-bg-color)',
                headerBg: 'var(--tg-theme-section-bg-color)',
                titleColor: 'var(--tg-theme-text-color)',
                colorText: 'var(--tg-theme-text-color)',
                borderRadius: 20,
              },
              Input: {
                colorBgContainer: 'var(--tg-second-section-color)',
                colorBorder: 'transparent',
                colorText: 'var(--tg-theme-text-color)',
                colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
                borderRadiusLG: 12,
                activeBorderColor: 'transparent',
                activeShadow: 'transparent',
                hoverBorderColor: 'transparent',
              },
            },
          }}>
          {confirmProjects?.length > 0 && currentModalIndex !== null && (
            <Modal
              title='Решили ли вы вопрос?'
              open={true}
              style={{
                background: 'var(--tg-theme-bg-color)',
                borderRadius: 20,
              }}
              closable={false}
              maskClosable={false}
              centered
              footer={
                <div className='flex gap-2 justify-between mt-5'>
                  <button
                    onClick={() => handleClose('none', false)}
                    disabled={loadingNone}
                    className='w-full p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl flex items-center justify-center gap-2'>
                    {loadingNone && (
                      <Spin
                        indicator={
                          <LoadingOutlined spin style={{ color: 'white' }} />
                        }
                      />
                    )}
                    Не решил
                  </button>
                  <button
                    onClick={() => handleClose('yes', true)}
                    disabled={loadingYes}
                    className='w-full p-3 bg-tg-button-color text-tg-button-text-color rounded-xl flex items-center justify-center gap-2'>
                    {loadingYes && (
                      <Spin
                        indicator={
                          <LoadingOutlined spin style={{ color: 'white' }} />
                        }
                      />
                    )}
                    Всё супер!
                  </button>
                </div>
              }>
              {confirmProjects[currentModalIndex].category_name !== '' && (
                <div>
                  Категория:{' '}
                  <span className='text-tg-subtitle-color'>
                    {confirmProjects[currentModalIndex].category_name}
                  </span>
                </div>
              )}
              {confirmProjects[currentModalIndex].question !== '' && (
                <div>
                  Вопрос, который решали:{' '}
                  <span className='text-tg-subtitle-color'>
                    <TextDispute
                      text={confirmProjects[currentModalIndex].question}
                    />
                  </span>
                </div>
              )}
              <p className='text-tg-subtitle-color mt-2'>
                Такое же окно получит заказчик, если ваши ответы не совпадут, то
                будет открыт спор
              </p>
            </Modal>
          )}
          <Modal
            title='Вы уверены, что хотите отменить заказ?'
            open={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            style={{ background: 'var(--tg-theme-bg-color)', borderRadius: 20 }}
            centered
            closable={false}
            maskClosable={false}
            footer={
              <div className='flex gap-2 justify-between mt-5'>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className='w-full p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'>
                  Нет
                </button>
                <button
                  onClick={() => {
                    if (activeOrder?.id) {
                      setLoadingCancel(true)
                      handleCloseProject(activeOrder?.id)
                    }
                    setShowCancelModal(false)
                  }}
                  disabled={loadingCancel}
                  className='w-full p-3 bg-tg-button-color text-tg-button-text-color rounded-xl'>
                  {loadingCancel && (
                    <Spin
                      indicator={
                        <LoadingOutlined spin style={{ color: 'white' }} />
                      }
                    />
                  )}
                  Да!
                </button>
              </div>
            }></Modal>
        </ConfigProvider>

        <HeaderSection
          levelID={executor.level.id}
          first_name={user.name}
          levelName={executor.level.name}
          countOrdersStart={executor.level.count_orders_start}
          countCompletedOrders={
            executor.count_completed_projects -
            executor.level.count_orders_start
          }
          needCountCompletedOrders={
            executor.level.count_orders_completed -
            executor.level.count_orders_start
          }
          incomeToday={executor.amount}
        />
        <OrdersAcceptSection
          webApp={webApp as IWebApp}
          acceptOrders={executor.accept_orders}
        />
        {disputeList && disputeList[disputeIndex] && (
          <div className='flex flex-col w-full h-auto items-center'>
            <div
              className={`flex flex-col w-full h-auto mt-3 bg-tg-section-color rounded-3xl py-4 px-4 ${
                window.Telegram.WebApp.colorScheme === 'light' &&
                'shadow-md shadow-gray-400'
              }`}>
              <div className='flex flex-col w-full items-center justify-between mt-1 font-medium mb-3 px-1'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex w-full items-center gap-2 text-orange-500'>
                    <ExclamationCircleOutlined />
                    <div>
                      <div className='font-medium' style={{ width: '100%' }}>
                        Активные споры
                      </div>
                    </div>
                  </div>
                  <div
                    className='text-tg-subtitle-color cursor-pointer'
                    onClick={() => setOpenDrawerDispute(true)}>
                    <InfoCircleOutlined style={{ fontSize: '18px' }} />
                  </div>
                </div>
                <DisputeItem
                  key={disputeList[disputeIndex].project_id}
                  project_id={disputeList[disputeIndex].project_id}
                  created_at={disputeList[disputeIndex].created_at}
                  category={disputeList[disputeIndex].category_name}
                  admin_id={disputeList[disputeIndex].admin_id}
                  question={disputeList[disputeIndex].question}
                  video_url={disputeList[disputeIndex].video_url}
                  setDisputeList={setDisputeList}
                  next={nextDispute}
                  prev={prevDispute}
                  hasNext={disputeList.length > 1}
                />
              </div>
            </div>
          </div>
        )}
        {activeOrder && (
          <>
            <div className='flex flex-col w-full h-auto items-center'>
              <div
                key={activeOrder.id}
                className={`flex flex-col w-full h-auto mt-3 bg-tg-section-color rounded-3xl py-4 px-4 ${
                  window.Telegram.WebApp.colorScheme === 'light' &&
                  'shadow-md shadow-gray-400'
                }`}>
                <div className='flex w-full items-center justify-between mt-1 font-medium mb-3 px-1'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex w-full items-center gap-2 text-tg-text-color'>
                      <CheckCircleOutlined />
                      {activeOrder.status === 'search_executor' &&
                        'Поиск советчика'}
                      {activeOrder.status === 'waiting_executor_confirm' &&
                        'Ждем ответа от советчика'}
                      {activeOrder.status === 'waiting_start' &&
                        'Ожидаем начала звонка'}
                      {activeOrder.status === 'working' && 'Активный заказ'}
                    </div>
                    <div>
                      {activeOrder.status === 'search_executor' && (
                        <button
                          className={`text-tg-destructive-text-color text-[14px]`}
                          style={{ width: '100%' }}
                          onClick={() => setShowCancelModal(true)}>
                          Отменить
                        </button>
                      )}
                      {activeOrder.status !== 'search_executor' && (
                        <button
                          className={`text-orange-500 text-[14px]`}
                          style={{ width: '100%' }}
                          onClick={() => handleEndProject()}>
                          Завершить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-3 items-center'>
                  <img
                    src='/compass.gif'
                    alt=''
                    className='size-[150px] flex-shrink-0'
                  />
                  <div className='space-y-2 w-full text-[12px]'>
                    <div className='flex items-center gap-2'>
                      <div className='text-center flex-grow flex-shrink-0'>
                        <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center'>
                          {userNames?.find(
                            user => user.project_id === activeOrder.id,
                          )?.name ? (
                            <>№ {activeOrder.id}</>
                          ) : (
                            <>{activeOrder.price.price} ₽</>
                          )}
                        </div>
                      </div>
                      <div className='text-center flex-grow flex-shrink-0'>
                        <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center text-tg-text-color'>
                          {activeOrder.info.duration === 1 && '30 мин'}
                          {activeOrder.info.duration === 2 && '1 час'}
                          {activeOrder.info.duration === 3 && '1,5 часа'}
                          {activeOrder.info.duration === 4 && '2 часа'}
                        </div>
                      </div>
                    </div>
                    <div className='text-center flex-grow flex-shrink-0'>
                      <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center'>
                        {activeOrder.category_name}
                      </div>
                    </div>
                    <div className='text-center flex-grow flex-shrink-0'>
                      <div
                        className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center text-yellow-500'
                        style={{
                          color: `${colorFind[activeOrder.price.level_id]}`,
                        }}>
                        {
                          levelInfo?.find(
                            l => l.id === activeOrder.price.level_id,
                          )?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
                {userNames?.find(user => user.project_id === activeOrder.id)
                  ?.name && (
                  <div className='flex items-center justify-between gap-2 text-[12px]'>
                    <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center'>
                      {activeOrder.price.price} ₽
                    </div>
                    <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center'>
                      {
                        userNames?.find(
                          user => user.project_id === activeOrder.id,
                        )?.name
                      }
                    </div>
                  </div>
                )}
                <div className='flex justify-between mt-4 w-full gap-3'>
                  {activeProjects.length > 1 && (
                    <button
                      className='bg-tg-section-second-color text-tg-button-text-color rounded-xl py-2 px-4'
                      onClick={prev} // функция для перехода на предыдущую страницу
                    >
                      <ArrowLeftOutlined />
                    </button>
                  )}
                  {activeOrder.info.start_time === null && (
                    <button
                      onClick={() => {
                        window.open(activeOrder.video_cal_url, '_blank')
                      }}
                      className={`text-center p-3 bg-tg-button-color text-tg-button-text-color rounded-xl cursor-pointer`}
                      style={{ width: '100%' }}>
                      Подключиться
                    </button>
                  )}
                  {activeOrder.info.start_time && (
                    <button
                      onClick={() => {
                        window.open(activeOrder.video_cal_url, '_blank')
                      }}
                      disabled={
                        !(
                          activeOrder.info.start_time &&
                          isTimePassed(
                            formatToUserTimezone(activeOrder.info.start_time),
                          )
                        )
                      }
                      className={`text-center p-3 bg-tg-button-color text-tg-button-text-color rounded-xl ${!(activeOrder.info.start_time && isTimePassed(formatToUserTimezone(activeOrder.info.start_time))) ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ width: '100%' }}>
                      Подключиться
                    </button>
                  )}
                  {activeProjects.length > 1 && (
                    <button
                      className='bg-tg-section-second-color text-tg-button-text-color rounded-xl py-2 px-4'
                      onClick={next} // функция для перехода на следующую страницу
                    >
                      <ArrowRightOutlined />
                    </button>
                  )}
                </div>
                {activeOrder.info.start_time && (
                  <div className='text-tg-subtitle-color text-center text-[12px] mt-1'>
                    Звонок будет доступен в{' '}
                    {formatToUserTimezone(activeOrder.info.start_time)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {executor.level.id === 1 ? (
          <TasksProgress user_id={executor.user_id} />
        ) : null}
        <ScheduleSection
          schedule={executor.executor_schedule}
          timezoneOffset={user.time_zone}
          weekday={executor.weekday}
        />
        <Link
          href={'/history-executor'}
          className='flex w-full h-auto items-center text-tg-text-color justify-between bg-tg-section-color rounded-3xl mt-3 py-4 px-6 font-medium'>
          <div className='flex w-full items-center gap-2'>
            <SolutionOutlined />
            <span>История заказов</span>
          </div>
          <CaretRightOutlined />
        </Link>
      </main>
    )
  }

  return page ? (
    page.page === 'executor' ? (
      executorPage(page.data as ExecutorResponseData)
    ) : page.page === 'newUser' ? (
      <TitlePage />
    ) : (
      <User />
    )
  ) : (
    <div className='flex flex-col w-screen h-screen bg-tg-background-color items-center'>
      <ConfigProvider
        theme={{
          components: {
            Spin: {
              colorPrimary: 'var(--tg-theme-accent-text-color)',
            },
          },
        }}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, marginTop: '35vh' }} spin />
          }
        />
      </ConfigProvider>
      <h1 className='nameCompany loading-text text-4xl font-bold mt-5'>
        Tellme
      </h1>
    </div>
  )
}
