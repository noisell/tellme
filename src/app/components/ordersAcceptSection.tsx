'use client'

import { ThunderboltOutlined } from '@ant-design/icons'
import { message, ConfigProvider, Switch } from 'antd'
import React, { useState } from 'react'
import { IWebApp } from '@/context/types'
import { changeOrdersAccept } from '@/app/API'

interface Props {
  webApp: IWebApp
  acceptOrders: boolean
}

export function OrdersAcceptSection(props: Props) {
  const [switchState, setSwitchState] = useState<boolean>(props.acceptOrders)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const success = () => {
    messageApi
      .open({
        type: 'success',
        content: 'Вы снова в поиске заказов!',
      })
      .then(() => {
        return
      })
  }
  const warning = () => {
    messageApi
      .open({
        type: 'warning',
        content: 'Заказы больше не будут поступать!',
      })
      .then(() => {
        return
      })
  }

  const handleSwitchChange = () => {
    if (!disabled) {
      props.webApp.HapticFeedback.notificationOccurred('success')
      setDisabled(true) // Блокировка кнопки

      if (timeoutId) {
        clearTimeout(timeoutId) // Сброс предыдущего таймаута
      }
      setTimeoutId(
        setTimeout(() => {
          changeOrdersAccept(props.webApp.initDataUnsafe.user.id, !switchState)
            .then(() => {
              setSwitchState(!switchState)
              if (!switchState) success()
              else warning()
            })
            .finally(() => {
              setDisabled(false) // Разблокировка кнопки
              setTimeoutId(null) // Сброс timeoutId
            })
        }, 1000),
      )
    }
  }
  return (
    <div className='flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4'>
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
        <div className='flex gap-2 font-medium items-center ml-2'>
          <ThunderboltOutlined />
          <p>Принимаю заказы</p>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Switch: {
                colorPrimary: 'var(--tg-theme-accent-text-color)',
              },
            },
          }}>
          <Switch
            defaultValue={switchState}
            disabled={disabled}
            onChange={handleSwitchChange}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
