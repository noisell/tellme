'use client'
import React, { useEffect } from 'react'
import { Statistics } from '@/app/statistics/components/statistics'
import { BarChartOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useNav } from '@/context/navContext'

export default function StatisticPage() {
  const { setActiveButton } = useNav()
  const router = useRouter()
  useEffect(() => {
    setActiveButton('/statistics')
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
    <main className='flex flex-col bg-tg-secondary-background-color items-center'>
      <div className='flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4'>
        <div className='flex w-full items-center ml-4 gap-2 font-medium '>
          <BarChartOutlined />
          <p>Статистика доходов</p>
        </div>
        <Statistics
          title='В среднем за день'
          value={1200}
          prefix='₽'
          ratio='up'
          percent={58.23}
        />
        <Statistics
          title='За месяц'
          value={23653}
          prefix='₽'
          ratio='down'
          percent={30.916}
        />
        <Statistics
          title='За все время'
          value={67210}
          prefix='₽'
          ratio='up'
          percent={0}
        />
        <div className='flex w-full items-center ml-4 gap-2 font-medium mt-4'>
          <BarChartOutlined />
          <p>Статистика заказов</p>
        </div>
        <Statistics
          title='Всего откликов'
          value={1023}
          ratio='up'
          percent={20.52}
        />
        <Statistics
          title='Выполненно заказов'
          value={600}
          ratio='up'
          percent={10.98}
        />
        <Statistics
          title='Кол-во споров'
          value={10}
          ratio='up'
          percent={320.12}
          reverse={true}
        />
      </div>
    </main>
  )
}
