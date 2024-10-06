'use client'
import { useEffect } from 'react'
import { useNav } from '@/context/navContext'
import { UserName } from './components/UserName'
import { Skills } from './components/Skills'
import { Category } from './components/Category'

export default function ProfilePage() {
  const { setShowNavigation, setActiveButton } = useNav()

  useEffect(() => {
    setShowNavigation(true)
    setActiveButton('/profile')
  }, [])

  return (
    <main className='w-full min-h-full bg-tg-secondary-background-color items-center'>
      <UserName />
      <Skills />
      <Category />
    </main>
  )
}
