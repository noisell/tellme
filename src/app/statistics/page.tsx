'use client'
import React, { useEffect, useState } from 'react'
import { Statistics } from '@/app/statistics/components/statistics'
import { BarChartOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useNav } from '@/context/navContext'
import { getStatisticsFinance, getStatisticsOrders } from '../API'
import { LoadingComponent } from '../components/loadingComponent'

export default function StatisticPage() {
  const { setActiveButton, setShowNavigation } = useNav()
  const router = useRouter()
  const [financeData, setFinanceData] = useState({
    day: {
      amount: 1200,
      percent: -23.09,
    },
    month: {
      amount: 111,
      percent: -23.09,
    },
    all: {
      amount: 1200,
      percent: -23.09,
    },
  })
  const [ordersData, setOrdersData] = useState({
    responses: {
      count: 228,
      percent: 12.54,
    },
    orders: {
      count: 228,
      percent: 12.54,
    },
    disputes: {
      count: 228,
      percent: 12.54,
    },
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setShowNavigation(true)
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

  const removeMinus = (number: number) => {
    return +number.toString().replace('-', '')
  }

  const getDownOrUp = (number: number) => {
    return number.toString().includes('-') ? 'down' : 'up'
  }
  const getReverse = (number: number) => {
    return number.toString().includes('-')
  }

  useEffect(() => {
    setLoading(true)
    // @ts-ignore
    getStatisticsFinance()
      .then(res => setFinanceData(res))
      .finally(() => setLoading(false))
    getStatisticsOrders()
      .then(res => setOrdersData(res))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingComponent />

  return (
    <main className='flex flex-col bg-tg-secondary-background-color items-center'>
      <div className='flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4'>
        <div className='flex w-full items-center ml-4 gap-2 font-medium '>
          <BarChartOutlined />
          <p>Статистика доходов</p>
        </div>
        <Statistics
          title='В среднем за день'
          value={financeData.day.amount}
          prefix='₽'
          ratio={getDownOrUp(financeData.day.percent)}
          reverse={getReverse(financeData.day.percent)}
          percent={removeMinus(financeData.day.percent)}
        />
        <Statistics
          title='За месяц'
          value={financeData.month.amount}
          prefix='₽'
          ratio={getDownOrUp(financeData.month.percent)}
          reverse={getReverse(financeData.month.percent)}
          percent={removeMinus(financeData.month.percent)}
        />
        <Statistics
          title='За все время'
          value={financeData.all.amount}
          prefix='₽'
          ratio={getDownOrUp(financeData.all.percent)}
          reverse={getReverse(financeData.all.percent)}
          percent={removeMinus(financeData.all.percent)}
        />
        <div className='flex w-full items-center ml-4 gap-2 font-medium mt-4'>
          <BarChartOutlined />
          <p>Статистика заказов</p>
        </div>
        <Statistics
          title='Всего откликов'
          value={ordersData.responses.count}
          ratio={getDownOrUp(ordersData.responses.percent)}
          reverse={getReverse(ordersData.responses.percent)}
          percent={ordersData.responses.percent}
        />
        <Statistics
          title='Выполнено заказов'
          value={ordersData.orders.count}
          ratio={getDownOrUp(ordersData.orders.percent)}
          reverse={getReverse(ordersData.orders.percent)}
          percent={ordersData.orders.percent}
        />
        <Statistics
          title='Кол-во споров'
          value={ordersData.disputes.count}
          ratio={getDownOrUp(ordersData.disputes.percent)}
          reverse={getReverse(ordersData.disputes.percent)}
          percent={ordersData.disputes.percent}
        />
      </div>
    </main>
  )
}
