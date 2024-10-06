'use client'

import { ConfigProvider, Empty } from 'antd'
import { useEffect, useState } from 'react'
import { HistoryItem } from './components/HistoryItem'
import { getHistoryProject } from '../API'
import { useRouter } from 'next/navigation'

interface ICustomType {
  id: number
  user_id: number
  executor_id: any
  category_name: string
  status: string
  level_id: number
  level_name: string
  price: number
  duration: number
  description: string
  created_at: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ICustomType[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    getHistoryProject({ limit: 1000, offset: 0 }).then(data => {
      const res = data as ICustomType[]
      setHistory(res)
      setLoading(false)
    })
  }, [])

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

  if (loading)
    return <div className='w-full min-h-screen bg-tg-section-color'></div>

  return (
    <div className='w-full min-h-screen bg-tg-section-color'>
      {!history && (
        <div className='flex flex-col justify-center items-center min-h-screen  rounded-3xl overflow-hidden'>
          <div className='flex flex-col items-center -mt-10'>
            <ConfigProvider
              theme={{
                components: {
                  Empty: {
                    colorTextDescription: 'var(--tg-theme-text-color)',
                  },
                },
              }}>
              <Empty
                image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                description='Заказов пока нет'
              />
            </ConfigProvider>
          </div>
        </div>
      )}
      <div>
        {' '}
        {history &&
          history.length > 0 &&
          history?.map(item => (
            <HistoryItem
              key={item.id}
              price={item.price}
              level_id={item.level_id}
              duration={item.duration}
              executor_id={item.executor_id}
              status={item.status}
              date={item.created_at}
              description={item.description}
              category_name={item.category_name}
            />
          ))}
      </div>
    </div>
  )
}
