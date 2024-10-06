import React from 'react'
import { Spin } from 'antd'

export default function Loading() {
  return (
    <div
      className='flex flex-col items-center justify-center h-screen w-full gap-3'
      style={{ backgroundColor: '#181818' }}>
      <h1 className='text-white font-bold text-xl'>TellMe</h1>
      <Spin size='large' />
    </div>
  )
}
