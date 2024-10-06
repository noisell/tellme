'use client'

import React, { useEffect, useState } from 'react'
import {
  OrderedListOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Progress, ConfigProvider, Skeleton, message } from 'antd'
import { UserTasksCompleted } from '@/app/types'
import { subscribed, taskInfo } from '@/app/API'
import { DrawerTasks } from '@/app/components/drawerTasks'
import { Drawer } from '@/app/components/drawer'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ReplyIcon from '@mui/icons-material/Reply'

interface Props {
  user_id: number
  isClient?: boolean
}

export function TasksProgress(props: Props) {
  const [tasks, setTasks] = useState<UserTasksCompleted | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenFriend, setModalOpenFriend] = useState(false)
  const [modalOpenSub, setModalOpenSub] = useState(false)
  const [modalOpenLabel, setModalOpenLabel] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(<></>)
  const botUrl = 'https://t.me/ссылка-на-бота'
  const text = `Привет дорогой друг! Присоединяйся к Tellme - ${botUrl}`
  const [messageApi, contextHolder] = message.useMessage()
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
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(botUrl)
      success('Ссылка скопирована!')
    } catch (er) {
      error('Не получилось скопировать...')
      console.error('Ошибка копирования:', er)
    }
  }
  useEffect(() => {
    taskInfo(props.user_id).then(r => {
      if (r) {
        setTasks(r)
      }
    })
  }, [])
  const modalFriend = (): void => {
    setContent(
      <>
        <ConfigProvider
          theme={{
            components: {
              Message: {
                contentBg: 'var(--tg-second-section-color)',
                colorText: 'var(--tg-theme-text-color)',
              },
            },
          }}>
          {contextHolder}
        </ConfigProvider>
        <img src='/handshake.gif' alt='My GIF' width={'60%'} />
        <span className='flex flex-col text-left mt-5 gap-y-2'>
          <p className='font-bold' style={{ fontSize: '16px' }}>
            Приглашайте своих друзей в Tellme
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            Пригласите друзей можно по кнопке "Поделиться" или скопировать
            ссылку и отправить самостоятельно. Когда кто-то зарегистрируется по
            вашей ссылке, то вам сразу придет уведомление. Отслеживать всех
            своих рефералов вы можете в профиле.
          </p>
        </span>
        <div className='flex w-full items-center justify-between mt-4'>
          <button
            style={{ width: '80%' }}
            onClick={() => {
              window.Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${text}`,
              )
            }}
            className='flex p-3 rounded-xl bg-tg-button-color justify-center gap-1 items-center font-bold text-tg-button-text-color'>
            <p className='ml-5'>Поделиться</p>{' '}
            <ReplyIcon fontSize='small' sx={{ transform: 'scaleX(-1)' }} />
          </button>
          <button
            className='bg-tg-button-color rounded-xl p-3 text-tg-button-text-color'
            onClick={handleCopy}>
            <ContentCopyIcon fontSize='medium' />
          </button>
        </div>
      </>,
    )
    setModalOpenFriend(true)
  }
  const checkSub = () => {
    subscribed().then(r => {
      if (r) {
        success('Задание зачтено')
        if (tasks) {
          setTasks(prevState => ({
            ...(prevState as UserTasksCompleted),
            subscription: true,
          }))
        }
      } else {
        error('Вы не подписались на канал')
      }
    })
  }
  const modalSub = (): void => {
    setContent(
      <>
        <ConfigProvider
          theme={{
            components: {
              Message: {
                contentBg: 'var(--tg-second-section-color)',
                colorText: 'var(--tg-theme-text-color)',
              },
            },
          }}>
          {contextHolder}
        </ConfigProvider>
        <img src='/chat.gif' alt='My GIF' width={'60%'} />
        <span className='flex flex-col text-left mt-5 gap-y-2'>
          <p
            className='font-bold w-full text-center'
            style={{ fontSize: '16px' }}>
            Подписывайтесь на наc в Telegram
          </p>
        </span>
        <div className='flex flex-col w-full items-center justify-center mt-4 gap-2'>
          <button
            onClick={() => {
              window.Telegram.WebApp.openTelegramLink(
                `https://t.me/Tellme_tips`,
              )
            }}
            className='flex w-full p-3 rounded-xl bg-gradient-conic bg-green-500 justify-center gap-1 items-center font-bold text-tg-button-text-color'>
            <p>Подписаться</p>
          </button>
          <button
            onClick={checkSub}
            className='flex w-full p-3 rounded-xl bg-tg-button-color justify-center gap-1 items-center font-bold text-tg-button-text-color'>
            <p>Проверить подписку</p>
          </button>
        </div>
      </>,
    )
    setModalOpenSub(true)
  }
  const modalLabel = (): void => {
    setContent(
      <>
        <ConfigProvider
          theme={{
            components: {
              Message: {
                contentBg: 'var(--tg-second-section-color)',
                colorText: 'var(--tg-theme-text-color)',
              },
            },
          }}>
          {contextHolder}
        </ConfigProvider>
        <img src='/folders.gif' alt='My GIF' width={'60%'} />
        <span className='flex flex-col text-left mt-5 gap-y-2'>
          <p
            className='font-bold w-full text-center'
            style={{ fontSize: '16px' }}>
            Создайте ярлык на рабочий стол
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            Создав ярлык нашего приложения, вы сможете удобно открывать его и
            никогда не потеряете бота среди своих чатов. От вас потребуется
            открыть ссылку в браузере и создать в нем ярлык. Затем перейти по
            созданному ярлыку и если все успешно, то задание вам зачтется
            автоматически.
          </p>
        </span>
        <div className='flex w-full items-center justify-center mt-4 gap-2'>
          <button
            style={{ width: '80%' }}
            onClick={() => {
              window.Telegram.WebApp.openLink(
                `https://two-market.ru/shortcut/${window.Telegram.WebApp.initDataUnsafe.user?.id}`,
              )
            }}
            className='flex p-3 rounded-xl bg-tg-button-color justify-center gap-1 items-center font-bold text-tg-button-text-color'>
            <p className='ml-5'>Создать ярлык</p>
          </button>
          <button
            className='bg-tg-button-color rounded-xl p-3 text-tg-button-text-color'
            onClick={handleCopy}>
            <ContentCopyIcon fontSize='medium' />
          </button>
        </div>
      </>,
    )
    setModalOpenLabel(true)
  }
  return tasks ? (
    <div
      className={`flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4 font-medium ${window.Telegram.WebApp.colorScheme === 'light' && 'shadow-md shadow-gray-400'}`}>
      <div className='flex w-full items-center justify-between px-2'>
        <div className='flex w-full items-center gap-2'>
          <OrderedListOutlined />
          <span>Задания</span>
        </div>
        <ExclamationCircleOutlined
          style={{
            fontSize: '18px',
            color: 'var(--tg-theme-subtitle-text-color)',
          }}
          onClick={() => setModalOpen(true)}
        />
      </div>

      <p className='mr-auto px-2 text-xs text-tg-subtitle-color mt-2'>
        {props.isClient
          ? 'Выполните 3 простых задания и сможете создать один заказ полностью бесплатно'
          : 'Выполните 3 простых задания для того, чтобы начать принимать заказы!'}
      </p>
      <div className='flex w-full items-center justify-between mt-3 overflow-auto gap-2'>
        <ConfigProvider
          theme={{
            components: {
              Progress: {
                circleTextColor: 'var(--tg-theme-accent-text-color)',
              },
            },
          }}>
          <div
            className='flex flex-col items-center bg-tg-section-second-color p-4 rounded-xl'
            style={{ width: '50%' }}
            onClick={modalFriend}>
            <Progress
              type='circle'
              percent={(tasks.invite / 2) * 100}
              status={tasks.invite >= 2 ? 'success' : 'active'}
              size={100}
              strokeColor={
                tasks.invite < 2
                  ? 'var(--tg-theme-accent-text-color)'
                  : undefined
              }
              trailColor='var(--tg-theme-section-bg-color)'
            />
            <p className='text-xs mt-2 text-center'>Пригласить 2 друзей</p>
          </div>
          <div
            className='flex flex-col items-center bg-tg-section-second-color p-4 rounded-xl'
            style={{ width: '50%' }}
            onClick={modalSub}>
            <Progress
              type='circle'
              percent={tasks.subscription ? 100 : 0}
              status={tasks.subscription ? 'success' : 'active'}
              size={100}
              trailColor='var(--tg-theme-section-bg-color)'
            />
            <p className='text-xs mt-2 text-center'>Подписаться на канал</p>
          </div>
          <div
            className='flex flex-col items-center bg-tg-section-second-color p-4 rounded-xl'
            style={{ width: '50%' }}
            onClick={modalLabel}>
            <Progress
              type='circle'
              percent={(tasks?.shortcut / 2) * 100}
              status={tasks?.shortcut >= 2 ? 'success' : 'active'}
              size={100}
              strokeColor={
                tasks.shortcut < 2
                  ? 'var(--tg-theme-accent-text-color)'
                  : undefined
              }
              trailColor='var(--tg-theme-section-bg-color)'
            />
            <p className='text-xs mt-2 text-center'>Создать ярлык приложения</p>
          </div>
        </ConfigProvider>
      </div>
      <DrawerTasks open={modalOpen} setOpen={setModalOpen} />
      <Drawer
        open={modalOpenFriend}
        setOpen={setModalOpenFriend}
        content={content}
      />
      <Drawer open={modalOpenSub} setOpen={setModalOpenSub} content={content} />
      <Drawer
        open={modalOpenLabel}
        setOpen={setModalOpenLabel}
        content={content}
      />
    </div>
  ) : (
    <div className='flex flex-col w-full h-auto items-start bg-tg-section-color rounded-3xl mt-3 p-4 font-medium'>
      <Skeleton.Input
        active={true}
        style={{
          width: '50px',
          height: '24px',
          backgroundColor: 'var(--tg-second-section-color)',
          borderRadius: '12px',
        }}
      />
      <Skeleton.Input
        active={true}
        block={true}
        style={{
          width: '100%',
          height: '32px',
          backgroundColor: 'var(--tg-second-section-color)',
          borderRadius: '12px',
          marginTop: '8px',
        }}
      />
      <Skeleton.Button
        active={true}
        block={true}
        style={{
          width: '100%',
          height: '172px',
          backgroundColor: 'var(--tg-second-section-color)',
          borderRadius: '12px',
          marginTop: '12px',
        }}
      />
    </div>
  )
}
