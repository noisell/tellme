'use client'

import { useNav } from '@/context/navContext'
import Call from './components/VideoCall'
import { useEffect } from 'react'

export default function CallPage({ params }: { params: { roomId: string } }) {
  console.log(params.roomId)
  const { setShowNavigation } = useNav()

  useEffect(() => {
    setShowNavigation(false)
  }, [])
  return <Call channelName={params.roomId} /> // Pass roomId as a prop
}
