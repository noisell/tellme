import React, { useEffect, useState } from 'react'
import {
  ConfigProvider,
  TreeSelect,
  TreeSelectProps,
  DatePicker,
  Switch,
  Select,
  message,
  DatePickerProps,
} from 'antd'
import {
  CheckCircleOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { TasksProgress } from '@/app/components/progress'
import Link from 'next/link'
import { Input } from 'antd'
import TelegramIcon from '@mui/icons-material/Telegram'
import { Categories, Level, Price, TreeCategories } from '@/app/types'
import {
  cancelProject,
  createProject,
  getCategories,
  getLevels,
  getUserProject,
} from '@/app/API'

const { TextArea } = Input

const levelFind: Record<number, keyof Price> = {
  1: 'price_one',
  2: 'price_two',
  3: 'price_three',
  4: 'price_four',
}
export const colorFind: Record<number, string> = {
  1: 'rgb(234 179 8)',
  2: 'rgb(59 130 246)',
  3: 'rgb(34 197 94)',
  4: 'rgb(168 85 247)',
}
export const times = [
  { value: 1, label: '30 мин' },
  { value: 2, label: '1 час' },
  { value: 3, label: '1.5 часа' },
  { value: 4, label: '2 часа' },
]

function transformCategories(categories: Categories[]): TreeCategories[] {
  return categories.map(category => ({
    value: category.id,
    title: category.name,
    children:
      category.children.length >= 1
        ? transformCategories(category.children)
        : [],
  }))
}

const findCategoryById = (
  categories: Categories[],
  id: number,
): Categories | undefined => {
  for (const category of categories) {
    if (category.id === id) {
      return category
    }
    if (category.children.length > 0) {
      const foundCategory = findCategoryById(category.children, id)
      if (foundCategory) {
        return foundCategory
      }
    }
  }
  return undefined
}

interface TimeOption {
  label: any
  value: number
  key: number
  disabled?: boolean
  title?: string
}

export default function User() {
  const [categories, setCategories] = useState<Categories[] | undefined>(
    undefined,
  )
  const [value, setValue] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(1)
  const [price, setPrice] = useState<number>(300)
  const [level, setLevel] = useState<number>(1)
  const [fast, setFast] = useState<boolean>(true)
  const [allExecutor, setAllExecutor] = useState<boolean>(true)
  const [date, setDate] = useState<any>()
  const [dateString, setDateString] = useState<any>()
  const [startTime, setStartTime] = useState<any>()
  const [startTimeString, setStartTimeString] = useState<any>()
  const [endTime, setEndTime] = useState<any>()
  const [endTimeString, setEndTimeString] = useState<any>()
  const [executorId, setExecutorId] = useState<string>('')
  const [activeOrder, setActiveOrder] = useState<{
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
  } | null>(null)
  const [question, setQuestion] = useState<string>('')
  const [currentCategory, setCurrentCategory] = useState<Categories | null>(
    null,
  )
  const [tree, setTree] = useState<TreeCategories[] | undefined>(undefined)
  const [levelInfo, setLevelInfo] = useState<Level[] | undefined>(undefined)
  const [seconds, setSeconds] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()
  const [levelsData, setLevelsData] = useState([
    {
      value: 1,
      label: (
        <p className='text-[15px]' style={{ color: `${colorFind[1]}` }}>
          Новичок
        </p>
      ),
    },
    {
      value: 2,
      label: (
        <p className='text-[15px]' style={{ color: `${colorFind[2]}` }}>
          Специалист
        </p>
      ),
    },
    {
      value: 3,
      label: (
        <p className='text-[15px]' style={{ color: `${colorFind[3]}` }}>
          Профессионал
        </p>
      ),
    },
    {
      value: 4,
      label: (
        <p className='text-[15px]' style={{ color: `${colorFind[4]}` }}>
          Гуру
        </p>
      ),
    },
  ])

  const error = (text: string) => {
    messageApi
      .open({
        type: 'error',
        content: text,
      })
      .then(() => {
        return
      })
  }
  const success = (text: string) => {
    messageApi
      .open({
        type: 'success',
        content: text,
      })
      .then(() => {
        return
      })
  }

  const onChange = (newValue: number | undefined) => {
    setValue(newValue)
    if (newValue === undefined) return
    const category = findCategoryById(
      categories as Categories[],
      newValue,
    ) as Categories
    setPrice(category.price[levelFind[level]] * time)
    setCurrentCategory(category)
  }
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const onChangeLevel = (option: TimeOption) => {
    const { value } = option
    if (!currentCategory) {
      error('Сначала выберите категорию!')
      return
    }
    setLevel(value)
    const currentLevel = levelInfo?.find(lvl => lvl.id === value)
    success(
      `${currentLevel?.name}: от ${
        currentLevel?.count_orders_start
      } советов | ${currentCategory.price[levelFind[value]]}₽/30 мин`,
    )
    setPrice(currentCategory.price[levelFind[value]] * time)
  }
  const onChangeTime = (option: TimeOption) => {
    const { value } = option
    if (!currentCategory) {
      error('Сначала выберите категорию!')
      return
    }
    setTime(value)
    setPrice(currentCategory.price[levelFind[level]] * value)
  }
  const onPopupScroll: TreeSelectProps['onPopupScroll'] = e => {
    console.log('onPopupScroll', e)
  }
  useEffect(() => {
    getCategories().then(r => {
      if (r) {
        setCategories(r)
        setTree(transformCategories(r))
      }
    })
  }, [])
  useEffect(() => {
    getLevels().then(r => {
      if (r) {
        setLevelsData(
          r.map(item => ({
            value: item.id,
            label: (
              <p
                className='text-[15px]'
                style={{ color: `${colorFind[item.id]}` }}>
                {item.name}
              </p>
            ),
          })),
        )
        setLevelInfo(r)
      }
    })
  }, [])

  const handleChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDate(date)
    setDateString(dateString) // Если хотите видеть выбранную дату в формате строки
  }

  const handleChangeStartTime: DatePickerProps['onChange'] = (
    time,
    timeString,
  ) => {
    setStartTime(time)
    setStartTimeString(timeString) // Если хотите видеть выбранную дату в формате строки
  }

  const handleChangeEndTime: DatePickerProps['onChange'] = (
    time,
    timeString,
  ) => {
    setEndTime(time)
    setEndTimeString(timeString) // Если хотите видеть выбранную дату в формате строки
  }

  const fetchProject = async () => {
    const res = await getUserProject()
    if (res === null) return
    setActiveOrder(res)
    setSeconds(res?.seconds || 0)
  }

  const onSubmit = () => {
    if (!value) {
      error('Сначала выберите категорию!')
      return
    }
    if (!allExecutor) {
      if (!executorId) {
        error('Введите код исполнителя!')
        return
      }
    }
    if (!level) {
      error('Сначала выберите уровень!')
      return
    }
    if (!time) {
      error('Сначала выберите время!')
      return
    }
    if (!question) {
      error('Сначала введите вопрос!')
      return
    }
    if (!fast) {
      if (!date) {
        error('Сначала выберите дату!')
        return
      }
      if (!startTime) {
        error('Сначала выберите начало времени!')
        return
      }
      if (!endTime) {
        error('Сначала выберите конец времени!')
        return
      }
    }

    const data = {
      category_id: value,
      level_id: level,
      time: time,
      question: question,
      interval: !fast
        ? {
            time_start: `${dateString}T${startTimeString}`,
            time_end: `${dateString}T${endTimeString}`,
          }
        : null,
      executor_id: executorId ? +executorId : null,
      price: price,
    }

    createProject(data).then(r => {
      fetchProject()
      success('Заказ успешно создан!')
    })
  }

  const phrases = [
    'Ищем исполнителя',
    'Почти готово',
    'Сейчас найдем',
    'Минутку, проверяем данные',
    'Подбираем подходящих исполнителей',
    'Финальная проверка',
    'Все почти готово, осталось немного',
  ]
  const [text, setText] = useState(phrases[0])
  useEffect(() => {
    const interval = setInterval(() => {
      setText(prevText => {
        const currentIndex = phrases.indexOf(prevText)
        const nextIndex = (currentIndex + 1) % phrases.length
        return phrases[nextIndex]
      })
    }, 2000) // каждые 2 секунды

    return () => clearInterval(interval) // очищаем интервал при размонтировании компонента
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prevTime => prevTime + 1)
    }, 1000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [seconds])

  useEffect(() => {
    fetchProject()
  }, [])

  const handleCancelProject = () => {
    if (!activeOrder) return
    cancelProject(activeOrder?.id).then(() => {
      setActiveOrder(null)
      setSeconds(0)
    })
  }

  return (
    <main className='flex w-full flex-col bg-tg-secondary-background-color items-center'>
      <ConfigProvider
        theme={{
          components: {
            TreeSelect: {
              colorBgElevated: 'var(--tg-theme-section-bg-color)',
              colorText: 'var(--tg-theme-text-color)',
              colorPrimaryBorder: 'none',
              nodeSelectedBg: 'var(--tg-second-section-color)',
              colorPrimaryHover: 'var(--tg-theme-accent-text-color)',
              colorPrimary: 'var(--tg-theme-accent-text-color)',
            },
            Empty: {
              colorTextDescription: 'var(--tg-theme-text-color)',
            },
            Dropdown: {
              colorBgElevated: 'var(--tg-second-section-color)',
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
            Select: {
              colorBgContainer: 'var(--tg-second-section-color)',
              colorBorder: 'transparent',
              colorText: 'var(--tg-theme-text-color)',
              colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
              borderRadiusLG: 12,
              colorPrimary: 'transparent',
              colorBgElevated: 'var(--tg-second-section-color)',
              optionSelectedBg: 'var(--tg-theme-section-bg-color)',
              controlOutlineWidth: 0,
              colorPrimaryHover: 'transparent',
            },
            Message: {
              contentBg: 'var(--tg-second-section-color)',
              colorText: 'var(--tg-theme-text-color)',
            },
            DatePicker: {
              colorBgContainer: 'var(--tg-second-section-color)',
              colorBorder: 'transparent',
              colorText: 'var(--tg-theme-text-color)',
              colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
              borderRadiusLG: 12,
              colorIcon: '#fff',
            },
          },
        }}>
        {contextHolder}
        <div
          className={`flex w-full items-center bg-tg-button-color rounded-b-3xl py-3 px-5 font-bold justify-between ${
            window.Telegram.WebApp.colorScheme === 'light' &&
            'shadow-md shadow-gray-400'
          }`}>
          <p className='text-tg-button-text-color text-2xl'>Tellme</p>
          <Link href='https://t.me/Tellme_tips' className='ml-auto'>
            <TelegramIcon
              sx={{
                fontSize: '32px',
                color: 'var(--tg-theme-button-text-color)',
              }}
            />
          </Link>
          <UserSwitchOutlined
            style={{
              fontSize: '24px',
              color: 'var(--tg-theme-button-text-color)',
              marginLeft: '10px',
            }}
          />
        </div>
        {activeOrder && (
          <div
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
                    onClick={handleCancelProject}
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
                      categories?.find(c => c.id === activeOrder.category_id)
                        ?.name
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
                      levelInfo?.find(l => l.id === activeOrder.price.level_id)
                        ?.name
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='space-x-2 text-[12px] flex items-center justify-between'>
              <div className='text-center flex-grow'>
                <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center text-tg-accent-color'>
                  {text}
                </div>
              </div>
              <div className='text-center flex-grow flex-shrink-0 max-w-[80px]'>
                <div className='flex w-full bg-tg-section-second-color rounded-2xl px-1 py-1.5 items-center justify-center text-tg-accent-color'>
                  {formatTime(seconds)}
                </div>
              </div>
            </div>

            {/* <button
            className={`p-3 bg-tg-button-color text-tg-button-text-color rounded-xl mt-3 ${true ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{ width: '100%' }}>
            Начать звонок
          </button> */}
          </div>
        )}

        {!activeOrder && (
          <div
            className={`flex flex-col w-full h-auto mt-3 items-center bg-tg-section-color rounded-3xl py-4 px-4 ${
              window.Telegram.WebApp.colorScheme === 'light' &&
              'shadow-md shadow-gray-400'
            }`}>
            <div className='w-full flex flex-col'>
              <div className='flex w-full items-center justify-between mt-1 font-medium mb-3 px-1'>
                <div className='flex w-full items-center gap-2'>
                  <ShoppingOutlined />
                  <span>Получить совет</span>
                </div>
                <ExclamationCircleOutlined
                  style={{
                    fontSize: '18px',
                    color: 'var(--tg-theme-subtitle-text-color)',
                    cursor: 'pointer',
                  }}
                />
              </div>
              <ConfigProvider
                theme={{
                  token: {
                    colorBgContainer: 'var(--tg-second-section-color)',
                    colorBorder: 'transparent',
                    colorText: 'var(--tg-theme-text-color)',
                    colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
                    borderRadiusLG: 12,
                    colorPrimary: 'var(--tg-theme-accent-text-color)',
                    lineWidth: 0,
                  },
                }}>
                {tree ? (
                  <TreeSelect
                    variant='outlined'
                    style={{
                      width: '100%',
                      background: 'none',
                      color: 'var(--tg-theme-text-color)',
                      height: '45px',
                      borderRadius: '20px',
                    }}
                    value={value}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: 'auto',
                      background: 'var(--tg-theme-section-bg-color)',
                      color: '#FFF',
                    }}
                    listHeight={400}
                    placeholder='Выберите категорию'
                    allowClear={{
                      clearIcon: (
                        <CloseOutlined
                          style={{
                            fontSize: '15px',
                            color: 'var(--tg-theme-accent-text-color)',
                            background: 'var(--tg-second-section-color)',
                            marginLeft: '-3px',
                            marginTop: '-1px',
                          }}
                        />
                      ),
                    }}
                    onChange={onChange}
                    treeData={tree}
                    onPopupScroll={onPopupScroll}
                    size='large'
                    suffixIcon={
                      <DownOutlined
                        style={{
                          fontSize: '15px',
                          color: 'var(--tg-theme-accent-text-color)',
                        }}
                      />
                    }
                  />
                ) : (
                  <h1>Загрузка</h1>
                )}
              </ConfigProvider>
              <div className='flex w-full mt-3 items-center justify-between gap-2'>
                <Select
                  labelInValue
                  // @ts-ignore
                  value={level}
                  onChange={onChangeLevel}
                  options={levelsData}
                  size='large'
                  suffixIcon={
                    <DownOutlined
                      style={{ fontSize: '15px', color: `${colorFind[level]}` }}
                    />
                  }
                  className='flex w-full min-h-[45px] items-center text-[15px] text-yellow-500 bg-tg-section-second-color rounded-xl py-2.5 px-1.5 gap-2 justify-between'
                />
                <Select
                  labelInValue
                  // @ts-ignore
                  value={time}
                  options={times}
                  onChange={onChangeTime}
                  size='large'
                  suffixIcon={
                    <DownOutlined
                      style={{
                        fontSize: '15px',
                        color: 'var(--tg-theme-accent-text-color)',
                      }}
                    />
                  }
                  className='flex min-w-[105px] w-auto min-h-[45px] items-center text-[15px] text-nowrap text-tg-accent-color bg-tg-section-second-color rounded-xl py-2.5 px-3 gap-2 justify-center flex-shrink-0'
                />
              </div>

              <div className='mt-3'>
                <TextArea
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  size='large'
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder='Напишите свой вопрос'
                />
              </div>
              <div className='flex w-full min-h-[45px] items-center mt-3 justify-between bg-tg-section-second-color rounded-xl p-2.5'>
                <div
                  className={`flex gap-2 items-center text-[15px] ${
                    fast ? 'text-tg-accent-color' : 'text-tg-subtitle-color'
                  }`}>
                  <ClockCircleOutlined />
                  <p>Как можно скорее</p>
                </div>
                <ConfigProvider
                  theme={{
                    components: {
                      Switch: {
                        colorPrimary: 'var(--tg-theme-accent-text-color)',
                      },
                    },
                  }}>
                  <Switch value={fast} onChange={() => setFast(!fast)} />
                </ConfigProvider>
              </div>
              {!fast && (
                <div className='flex flex-col w-full min-h-[45px] items-center mt-3 bg-tg-section-second-color rounded-xl p-2.5'>
                  <div className='flex w-full gap-2 items-center text-[15px]'>
                    <FieldTimeOutlined />
                    <p>Выберите временной промежуток</p>
                  </div>
                  <div className='flex relative w-full mt-3 items-center justify-between gap-2'>
                    <DatePicker
                      placeholder='Выберите дату'
                      picker={'date'}
                      size='middle'
                      style={{ width: '100%' }}
                      format={'DD.MM.YYYY'}
                      inputReadOnly={true}
                      placement='bottomRight'
                      value={date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='mt-1 flex justify-between gap-2 w-full'>
                    <DatePicker
                      placeholder='Выберите начало времени'
                      picker={'time'}
                      size='middle'
                      style={{ width: '100%' }}
                      format={'HH:mm'}
                      inputReadOnly={true}
                      placement='bottomRight'
                      value={startTime}
                      onChange={handleChangeStartTime}
                    />
                    <DatePicker
                      placeholder='Выберите начало времени'
                      picker={'time'}
                      size='middle'
                      style={{ width: '100%' }}
                      format={'HH:mm'}
                      inputReadOnly={true}
                      placement='bottomRight'
                      value={endTime}
                      onChange={handleChangeEndTime}
                    />
                  </div>
                </div>
              )}
              <div className='flex w-full min-h-[45px] items-center mt-3 justify-between bg-tg-section-second-color rounded-xl px-2.5 gap-2'>
                <div>
                  <UserOutlined />
                </div>
                <Input
                  size='large'
                  typeof='number'
                  style={{ backgroundColor: 'transparent', paddingLeft: 0 }}
                  placeholder='Поиск по коду исполнителя'
                  disabled={allExecutor}
                  onChange={e => setExecutorId(e.target.value)}
                  value={executorId}
                />
                <ConfigProvider
                  theme={{
                    components: {
                      Switch: {
                        colorPrimary: 'var(--tg-theme-accent-text-color)',
                      },
                    },
                  }}>
                  <Switch
                    value={!allExecutor}
                    onChange={() => {
                      setAllExecutor(!allExecutor)
                      if (executorId) {
                        setExecutorId('')
                      }
                    }}
                  />
                </ConfigProvider>
              </div>
              <button
                onClick={() => onSubmit()}
                className='flex w-full mt-3 items-center h-auto bg-tg-button-color rounded-2xl p-3 text-tg-button-text-color justify-center font-bold'>
                Начать поиск · {price}₽
              </button>
              <p className='text-[10px] mt-1 w-full text-center text-tg-subtitle-color px-2'>
                Создавая заказ вы принимаете нашу{' '}
                <Link href='http://localhost:8080'>публичную оферту</Link>
              </p>
            </div>
          </div>
        )}
        <TasksProgress
          user_id={window.Telegram.WebApp.initDataUnsafe.user?.id as number}
          isClient={true}
        />
        <div
          className={`flex w-full h-auto items-center justify-between bg-tg-section-color rounded-3xl mt-3 py-4 px-6 font-medium ${
            window.Telegram.WebApp.colorScheme === 'light' &&
            'shadow-md shadow-gray-400'
          }`}>
          <Link
            href={'/history'}
            className='flex w-full items-center gap-2 text-tg-text-color'>
            <SolutionOutlined />
            <span>История заказов</span>
          </Link>
          <CaretRightOutlined />
        </div>
      </ConfigProvider>
    </main>
  )
}
