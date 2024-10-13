'use client'
import { useEffect } from 'react'
import { useNav } from '@/context/navContext'
import { UserName } from './components/UserName'
import { Skills } from './components/Skills'
import { Category } from './components/Category'
import { setCloudStorageItem } from '../API'
import { useRouter } from 'next/navigation'
import { CaretRightOutlined, UserSwitchOutlined } from '@ant-design/icons'

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

  return (
    <main className='w-full min-h-full bg-tg-secondary-background-color items-center'>
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
    </main>
  )
}
