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
  Spin,
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
  LoadingOutlined,
} from '@ant-design/icons'
import { TasksProgress } from '@/app/components/progress'
import Link from 'next/link'
import { Input } from 'antd'
import TelegramIcon from '@mui/icons-material/Telegram'
import { Categories, Level, Price, TreeCategories } from '@/app/types'
import {
  cancelProject,
  createProject,
  getAllConfirmProjects,
  getCategories,
  getExecutorInfoById,
  getLevels,
  getTaskInfo,
  getUserFree,
  getUserProject,
  setCloudStorageItem,
} from '@/app/API'
import { useRouter } from 'next/navigation'
import { useNav } from '@/context/navContext'
import { Modal } from 'antd'
import { main } from 'framer-motion/client'
import dayjs from 'dayjs'

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
  5: 'rgb(255 255 255)',
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
  const { setShowNavigation } = useNav()
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
    video_cal_url: string
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
  const router = useRouter()
  const [tree, setTree] = useState<TreeCategories[] | undefined>(undefined)
  const [levelInfo, setLevelInfo] = useState<Level[] | undefined>(undefined)
  const [seconds, setSeconds] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()
  const [taskInfo, setTaskInfo] = useState<{
    subscription: boolean
    shortcut: number
    invite: number
  }>({ subscription: false, shortcut: 0, invite: 0 })
  const [levelsData, setLevelsData] = useState([
    {
      value: 5,
      label: (
        <p className='text-[15px] text-tg-text-color'>Новичок бесплатно</p>
      ),
    },
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

  useEffect(() => {
    getTaskInfo().then(result => {
      setTaskInfo(result)
    })
  }, [])

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
    console.log('level', level)

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

    if (value === 5) {
      if (
        taskInfo.invite !== 2 ||
        taskInfo.shortcut !== 2 ||
        !taskInfo.subscription
      ) {
        messageApi.warning('Выполните все задания для бесплатного заказа')
        return
      }
    }

    if (!currentCategory) {
      error('Сначала выберите категорию!')
      return
    }
    setLevel(value)
    // const currentLevel = levelInfo?.find(lvl => lvl.id === value)
    // success(
    //   `${currentLevel?.name}: от ${
    //     currentLevel?.count_orders_start
    //   } советов | ${currentCategory.price[levelFind[value]]}₽/30 мин`,
    // )
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
    // Define an async function inside useEffect because useEffect itself can't be async
    const fetchData = async () => {
      const free = await getUserFree() // Fetch the free status

      getLevels().then(r => {
        if (r) {
          let allLevels = [...r] // Start with the existing levels

          // Conditionally add the new level based on the 'free' value
          if (free) {
            const newLevel = {
              id: 5,
              name: 'Новичок (бесплатно)',
            }
            // @ts-ignore
            allLevels = [newLevel, ...allLevels]
          }

          setLevelsData(
            allLevels.map(item => ({
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
          setLevelInfo(r) // Keep the original level info
        }
      })
    }

    fetchData() // Invoke the async function
  }, []) // Empty dependency array ensures this only runs on component mount

  useEffect(() => {
    setShowNavigation(false)
  }, [setShowNavigation])

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

  const [loadingSearch, setLoadingSearch] = useState(false)
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

      // Формируем даты и время с использованием dayjs
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      const formattedStartTime = dayjs(startTime).format('HH:mm')
      const formattedEndTime = dayjs(endTime).format('HH:mm')

      // Форматируем строки для Date
      const startDateTimeString = `${formattedDate}T${formattedStartTime}:00` // Добавляем секунды
      const endDateTimeString = `${formattedDate}T${formattedEndTime}:00` // Добавляем секунды

      // Преобразуем в объекты Date
      const startDateTime = new Date(startDateTimeString)
      const endDateTime = new Date(endDateTimeString)

      // Проверка на заднюю дату и время
      const currentDateTime = new Date() // Текущее время
      if (startDateTime < currentDateTime) {
        error('Начало времени не может быть в прошлом!')
        return
      }
      if (endDateTime < currentDateTime) {
        error('Конец времени не может быть в прошлом!')
        return
      }

      // Проверка корректности начала и конца времени
      if (startDateTime >= endDateTime) {
        error('Начало времени не может быть позже конца!')
        return
      }

      // Проверка минимальной разницы между endTime и startTime
      const diffInMilliseconds = endDateTime.getTime() - startDateTime.getTime() // Используем getTime()
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60) // Конвертируем в часы

      if (diffInHours < 1) {
        error(
          'Разница между началом и концом времени должна быть не менее 1 часа!',
        )
        return
      }
    }

    let start_time = new Date()
    let end_time = new Date()

    if (!fast) {
      const [day, month, year] = dateString.split('.')
      const formattedDateString = `${year}-${month}-${day}` // Now in YYYY-MM-DD format

      const startDateTimeString = `${formattedDateString}T${startTimeString}` // Combine date and start time
      let start_time = new Date(startDateTimeString) // Create Date object

      const endDateTimeString = `${formattedDateString}T${endTimeString}` // Combine date and end time
      let end_time = new Date(endDateTimeString) // Create Date object

      const timezoneOffset = start_time.getTimezoneOffset() * 60 * 1000

      start_time = new Date(start_time.getTime() + timezoneOffset)

      end_time = new Date(end_time.getTime() + timezoneOffset)
    }

    // Function to format date as "DD.MM.YYYYTHH:mm"
    function formatDateTime(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
    }

    const data = {
      category_id: value,
      level_id: level === 5 ? 1 : level,
      time: time,
      question: question,
      interval: !fast
        ? {
            time_start: formatDateTime(start_time),
            time_end: formatDateTime(end_time),
          }
        : null,
      executor_id: executorId ? +executorId : null,
      price: level === 5 ? 0 : price,
    }
    setLoadingSearch(true)
    createProject(data).then(r => {
      setLoadingSearch(false)
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

  const handleChangeAccount = async () => {
    const res = await getExecutorInfoById()
    if (res) {
      await setCloudStorageItem('currentPage', 'executor')
      window.location.reload()
    } else {
      router.replace('/new-executor')
    }
  }

  function collectCategoryData(categories: any) {
    // @ts-ignore
    const result = []

    // @ts-ignore
    function traverse(category) {
      // Добавляем объект с id и name в массив
      result.push({ id: category.id, name: category.name })

      // Если у категории есть вложенные, проходим по ним
      if (category.children && category.children.length > 0) {
        // @ts-ignore
        category.children.forEach(child => traverse(child))
      }
    }

    // Итерируем по всем корневым категориям
    // @ts-ignore
    categories.forEach(category => traverse(category))

    // @ts-ignore
    return result
  }
  console.log(categories)
  const [categoriesData, setCategoriesData] = useState<string[]>([])
  const category = [
    'Эксперт не подключился',
    'Проблема не решена',
    'Эксперт не компетентный',
    'Плохое качество связи',
  ]

  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(0)
  const [confirmProjects, setConfirmProjects] = useState<
    {
      client_confirm: boolean
      executor_confirm: boolean
      created_at: string
      question: string
      category_name: string
    }[]
  >([
    {
      client_confirm: false,
      executor_confirm: false,
      created_at: 'dsa',
      question: 'dsadas',
      category_name: 'dsadas',
    },
    {
      client_confirm: false,
      executor_confirm: false,
      created_at: 'dsa',
      question: '22222222222',
      category_name: '22222222',
    },
  ])

  useEffect(() => {
    getAllConfirmProjects({ for_executor: false }).then(data => {
      // setConfirmProjects(data)
    })
  }, [])

  const handleClose = () => {
    if (
      currentModalIndex !== null &&
      currentModalIndex < confirmProjects.length - 1
    ) {
      setCurrentModalIndex(currentModalIndex + 1) // Открыть следующую модалку
    } else {
      setCurrentModalIndex(null) // Закрыть все модалки, если это была последняя
    }
  }

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

  return (
    <main className='flex w-full flex-col bg-tg-secondary-background-color items-center'>
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              contentBg: 'var(--tg-theme-section-bg-color)',
              headerBg: 'var(--tg-theme-section-bg-color)',
              titleColor: 'var(--tg-theme-text-color)',
              colorText: 'var(--tg-theme-text-color)',
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
        {/* <Modal
          title='Опишите вашу проблему'
          open={true}
          style={{ background: 'var(--tg-theme-bg-color)' }}
          closable={false}
          maskClosable={false}
          centered
          footer={
            <div className='flex gap-2 justify-between mt-5'>
              <button className='w-full p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'>
                Открыть спор
              </button>
              <button className='w-full p-3 bg-green-500 text-tg-button-text-color rounded-xl'>
                Уступить
              </button>
            </div>
          }>
          <div className='flex flex-wrap gap-2 mb-3'>
            {category?.map(category => (
              <button
                key={category}
                className={`text-[12px] rounded-xl px-2 py-1 ${!categoriesData.includes(category) ? 'bg-tg-section-second-color text-tg-text-color' : 'bg-tg-button-color text-tg-button-text-color'}`}
                onClick={() => {
                  if (categoriesData.includes(category)) {
                    setCategoriesData(
                      categoriesData.filter(item => item !== category),
                    )
                  } else {
                    setCategoriesData([...categoriesData, category])
                  }
                }}>
                {category}
              </button>
            ))}
          </div>
          <TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            size='large'
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder='Опишите проблему'
          />
        </Modal> */}
        {confirmProjects?.length > 0 && currentModalIndex !== null && (
          <Modal
            title='Эксперт решил ваш вопрос?'
            open={true}
            style={{ background: 'var(--tg-theme-bg-color)' }}
            closable={false}
            maskClosable={false}
            centered
            footer={
              <div className='flex gap-2 justify-between mt-5'>
                <button
                  onClick={handleClose}
                  className='w-full p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'>
                  Не решил
                </button>
                <button
                  onClick={handleClose}
                  className='w-full p-3 bg-tg-button-color text-tg-button-text-color rounded-xl'>
                  Всё супер!
                </button>
              </div>
            }>
            <div>
              Категория:{' '}
              <span className='text-tg-subtitle-color'>
                {confirmProjects[currentModalIndex].category_name}
              </span>
            </div>
            <div>
              Вопрос, который решали:{' '}
              <span className='text-tg-subtitle-color'>
                {confirmProjects[currentModalIndex].question}
              </span>
            </div>
            <p className='text-tg-subtitle-color'>
              Такое же окно получит эксперт, если ваши ответы не совпадут, то
              будет открыт спор
            </p>
          </Modal>
        )}
      </ConfigProvider>
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
            onClick={() => handleChangeAccount()}
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
                      collectCategoryData(categories)?.find(
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
            {activeOrder.info.start_time === null && (
              <button
                onClick={() => {
                  window.open(activeOrder.video_cal_url, '_blank')
                }}
                className={`text-center p-3 bg-tg-button-color text-tg-button-text-color rounded-xl mt-3 cursor-pointer`}
                style={{ width: '100%' }}>
                Подключиться к звонку
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
                className={`text-center p-3 bg-tg-button-color text-tg-button-text-color rounded-xl mt-3 ${!(activeOrder.info.start_time && isTimePassed(formatToUserTimezone(activeOrder.info.start_time))) ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ width: '100%' }}>
                Подключиться к звонку
              </button>
            )}
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
                    treeData={tree.map(node => ({
                      ...node,
                      disabled: node.children && node.children.length > 0, // Если есть дети, узел отключен
                      children: node.children
                        ? node.children.map(child => ({
                            ...child,
                            disabled:
                              child.children && child.children.length > 0, // Рекурсивно проверяем детей
                          }))
                        : [],
                    }))} // Используем модифицированные данные
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
                  value={level === 5 ? 1 : time}
                  options={times}
                  onChange={onChangeTime}
                  disabled={level === 5}
                  size='large'
                  suffixIcon={
                    <DownOutlined
                      style={{
                        fontSize: '15px',
                        color: `${level === 5 ? 'var(--tg-theme-subtitle-text-color)' : 'var(--tg-theme-accent-text-color)'}`,
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
                className='flex w-full mt-3 items-center h-auto bg-tg-button-color rounded-2xl p-3 text-tg-button-text-color justify-center font-bold flex items-center justify-center'
                disabled={loadingSearch}>
                <div className='flex items-center gap-2'>
                  {loadingSearch && (
                    <Spin
                      indicator={
                        <LoadingOutlined spin style={{ color: 'white' }} />
                      }
                    />
                  )}
                  Начать поиск · {level === 5 ? '0' : price}₽
                </div>
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
