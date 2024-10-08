import React from 'react'
import { ConfigProvider, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export const LoadingComponent = () => {
  return (
    <div className='flex flex-col w-screen h-screen bg-tg-background-color items-center'>
      <ConfigProvider
        theme={{
          components: {
            Spin: {
              colorPrimary: 'var(--tg-theme-accent-text-color)',
            },
          },
        }}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, marginTop: '35vh' }} spin />
          }
        />
      </ConfigProvider>
      <h1 className='nameCompany loading-text text-4xl font-bold mt-5'>
        Tellme
      </h1>
    </div>
  )
}
