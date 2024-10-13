'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OfferPage() {
  const router = useRouter()
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
    <div>
      <h1>Offer</h1>
    </div>
  )
}
