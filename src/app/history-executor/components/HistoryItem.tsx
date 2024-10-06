'use client'

import React, { useState } from 'react'
import { ConfigProvider, message } from 'antd'
import { colorFind, times } from '@/app/components/user'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

interface HistoryItemProps {
  price: number
  executor_id: number | null
  level_id: number
  duration: number
  status: any
  date: string
  description: string
  category_name: string
}

export const HistoryItem = ({
  executor_id,
  price,
  duration,
  level_id,
  status,
  description,
  category_name,
  date,
}: HistoryItemProps) => {
  const [open, setOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleCopy = (string: string) => {
    navigator.clipboard.writeText(string)
    messageApi.success('Код скопирован!')
  }

  const color = colorFind[level_id]

  function formatDate(dateString: string): string {
    const date = new Date(dateString)

    const padZero = (num: number): string =>
      num < 10 ? '0' + num : num.toString()

    const day = padZero(date.getDate())
    const month = padZero(date.getMonth() + 1) // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear()

    const hours = padZero(date.getHours())
    const minutes = padZero(date.getMinutes())

    return `${month}.${day}.${year} ${hours}:${minutes}`
  }

  const formattedDate = formatDate('2024-10-05T19:23:15.928788')
  console.log(formattedDate) // "10.05.2024 19:23"
  ;``

  return (
    <div className='cursor-pointer flex flex-col w-full h-auto items-center bg-tg-section-color p-4 border-b border-b-tg-section-separator-color'>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentBg: 'var(--tg-second-section-color)',
              colorText: 'var(--tg-theme-text-color)',
            },
          },
        }}>
        {contextHolder}
      </ConfigProvider>
      <div className='flex w-full items-center justify-between'>
        <div
          onClick={() => setOpen(!open)}
          className='flex items-center w-full rounded-xl'>
          <div
            className='flex text-2xl rounded-xl p-2 flex-shrink-0 min-w-[110px]'
            style={{ color: `${color}` }}>
            {price} ₽
          </div>
          <div className='flex flex-col w-full ml-4'>
            <span
              className='text-tg-subtitle-color'
              style={{ fontSize: '14px' }}>
              {category_name}
            </span>
            <span className=''>{formatDate(date)}</span>
          </div>
        </div>
        <div className='text-[20px]'>
          <div className='text-red-500'>
            {status === 'closed' && <CloseCircleOutlined />}
          </div>
          <div className='text-green-500'>
            {status === 'canceled' && <CheckCircleOutlined />}
          </div>
          <div className='text-orange-500'>
            {status === 'dispute' && <ExclamationCircleOutlined />}
          </div>
        </div>
      </div>

      {/* Блок с содержимым, который будет открываться и закрываться */}
      <div
        className={`transition-all duration-300 ml-4 ease-in-out overflow-hidden w-full text-left ${
          open ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className='text-[14px] w-full text-left mt-2'>
          <span className='text-tg-subtitle-color'>Уровень: </span>{' '}
          <span style={{ color: `${color}` }}>
            {level_id === 1 && 'Новичок'}
            {level_id === 2 && 'Специалист'}
            {level_id === 3 && 'Профессионал'}
            {level_id === 4 && 'Гуру'}
          </span>{' '}
          {executor_id && (
            <>
              <br />
              <span onClick={() => handleCopy('321')}>
                <span className='text-tg-subtitle-color'>Код советчика: </span>{' '}
                {executor_id}
              </span>
            </>
          )}
          <br />
          <span className='text-tg-subtitle-color'>Длительность:</span>{' '}
          {times.find(time => time.value === duration)?.label} <br />{' '}
          <span className='text-tg-subtitle-color'>Вопрос:</span> {description}
        </div>
      </div>
    </div>
  )
}
