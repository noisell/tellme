'use client'
import { useEffect } from 'react'
import { useNav } from '@/context/navContext'
import { UserName } from './components/UserName'
import { Skills } from './components/Skills'
import { Category } from './components/Category'
import { setCloudStorageItem } from '../API'
import { useRouter } from 'next/navigation'
import { CaretRightOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

export default function ProfilePage() {
  const { setShowNavigation, setActiveButton } = useNav()
  const router = useRouter()

  useEffect(() => {
    setShowNavigation(true)
    setActiveButton('/profile')
  }, [])

  const handleChangeAccount = async () => {
    await setCloudStorageItem('currentPage', 'user')
    router.push('/')
  }

  useEffect(() => {
    const backButton = window.Telegram.WebApp.BackButton
    backButton.show()
    backButton.onClick(() => {
      router.back()
    })
    return () => {
      backButton.hide()
      backButton.offClick(() => {
        router.back()
      })
    }
  }, [])

  return (
    <main className='w-full min-h-full bg-tg-secondary-background-color items-center'>
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
        <UserName />
        <Skills />
        <Category />
        <button
          className='flex w-full h-auto items-center text-tg-text-color justify-between bg-tg-section-color rounded-3xl mt-3 py-4 px-6 font-medium'
          onClick={handleChangeAccount}>
          <div className='flex w-full items-center gap-2'>
            <UserSwitchOutlined /> Перейти на аккаунт заказчика
          </div>
          <CaretRightOutlined />
        </button>
      </ConfigProvider>
    </main>
  )
}
