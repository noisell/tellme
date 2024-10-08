'use client'
import React, { useEffect, useState } from 'react'
import { useTelegram } from '@/context/telegramContext'
import { useNav } from '@/context/navContext'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { HeaderSection } from '@/app/components/headerSection'
import { Categories, ExecutorResponseData, Level, PageState } from '@/app/types'
import {
  authorization,
  getCategories,
  getCloudStorageItem,
  getHistoryProjectExecutor,
  getLevels,
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
  CaretRightOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SolutionOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Spin } from 'antd'
import User, { colorFind } from '@/app/components/user'
import Link from 'next/link'

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
  >(null)

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
    getHistoryProjectExecutor().then(data => {
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

  function executorPage(pageData: ExecutorResponseData) {
    setShowNavigation(true)
    const user = pageData.user
    const executor = pageData.executor
    return (
      <main className='flex w-full flex-col bg-tg-secondary-background-color items-center'>
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
                      <button
                        className={`text-tg-destructive-text-color text-[14px]`}
                        style={{ width: '100%' }}>
                        Отменить
                      </button>
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
                          {activeOrder.price.price} ₽
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
                        {
                          categories?.find(
                            c => c.id === activeOrder.category_id,
                          )?.name
                        }
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
                {activeProjects.length > 1 && (
                  <div className='flex justify-between mt-4 w-full gap-3'>
                    <button
                      className='w-full bg-tg-button-color text-tg-button-text-color rounded-xl py-2 px-4'
                      onClick={prev} // функция для перехода на предыдущую страницу
                    >
                      Пред
                    </button>
                    <button
                      className='w-full bg-tg-button-color text-tg-button-text-color rounded-xl py-2 px-4'
                      onClick={next} // функция для перехода на следующую страницу
                    >
                      След
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <OrdersAcceptSection
          webApp={webApp as IWebApp}
          acceptOrders={executor.accept_orders}
        />
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
