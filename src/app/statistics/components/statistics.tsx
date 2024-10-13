import React, { useEffect } from 'react'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  value: number
  ratio: 'up' | 'down'
  percent: number
  prefix?: string | null
  reverse?: boolean | null
}

function numberFormat(number: number): string {
  if (number < 1000) {
    return number.toString() // Для чисел меньше 1000 пробелы не нужны
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }
}

export function Statistics(props: Props) {
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

  const arrow = props.ratio === 'up' ? <RiseOutlined /> : <FallOutlined />
  const percent_arrow =
    props.ratio === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />
  let arrowColor = props.ratio === 'up' ? '#25C45E' : '#F24245'
  const formattedPercent = props.percent.toFixed(2)
  const finalPercent = parseFloat(formattedPercent)
  const value = numberFormat(props.value)
  if (props.reverse) {
    arrowColor = props.ratio === 'up' ? '#F24245' : '#25C45E'
  }
  return (
    <div className='flex items-center w-full mt-3 rounded-xl p-3 bg-tg-section-second-color'>
      <div
        className='flex text-3xl ml-1 bg-tg-section-color p-2 rounded-xl'
        style={{ color: arrowColor }}>
        {arrow}
      </div>
      <div className='flex flex-col w-full ml-4'>
        <span className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
          {props.title}
        </span>
        <div className='flex items-end w-full'>
          <span className='text-xl'>
            {value} {props.prefix}
          </span>
          <span className='ml-auto' style={{ color: arrowColor }}>
            {percent_arrow} {finalPercent}%
          </span>
        </div>
      </div>
    </div>
  )
}
