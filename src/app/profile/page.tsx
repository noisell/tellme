'use client'
import { useEffect } from 'react'
import { useNav } from '@/context/navContext'
import { UserName } from './components/UserName'
import { Skills } from './components/Skills'
import { Category } from './components/Category'
import { getCloudStorageItem, setCloudStorageItem } from '../API'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { setShowNavigation, setActiveButton } = useNav()
  const router = useRouter()

  useEffect(() => {
    setShowNavigation(true)
    setActiveButton('/profile')
  }, [])

  const handleChangeAccount = async () => {
    await setCloudStorageItem('executor', 'false')
    router.replace('/')
  }

  return (
    <main className='w-full min-h-full bg-tg-secondary-background-color items-center'>
      <UserName />
      <Skills />
      <Category />
      <button
        className='p-3 bg-transparent mt-3 w-full text-tg-text-color rounded-xl'
        onClick={handleChangeAccount}>
        Перейти на аккаунт заказчика
      </button>
    </main>
  )
}
