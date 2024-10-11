'use client'

import { ThunderboltOutlined } from '@ant-design/icons'
import { message, ConfigProvider, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { IWebApp } from '@/context/types'
import {
  changeOrdersAccept,
  getExecutorInfoById,
  getNowWorkTime,
  getTaskInfo,
} from '@/app/API'
import dayjs from 'dayjs'

interface Props {
  webApp: IWebApp
  acceptOrders: boolean
}

export function OrdersAcceptSection(props: Props) {
  const [switchState, setSwitchState] = useState<boolean>(props.acceptOrders)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [executorInfo, setExecutorInfo] = useState<any>(null) // Updated type to any or define your own interface
  const [taskInfo, setTaskInfo] = useState<{
    subscription: boolean
    shortcut: number
    invite: number
  }>({
    subscription: false,
    shortcut: 0,
    invite: 0,
  })

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Вы снова в поиске заказов!',
    })
  }

  // Fetch both executor info and task info on component mount
  useEffect(() => {
    const fetchData = async () => {
      const executorData = await getExecutorInfoById()
      setExecutorInfo(executorData) // Set the executorInfo state
      const taskData = await getTaskInfo()
      setTaskInfo(taskData)
    }
    fetchData()
  }, [])

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'Заказы больше не будут поступать!',
    })
  }

  const [workTime, setWorkTime] = useState(true)

  useEffect(() => {
    getNowWorkTime().then(data => {
      setWorkTime(data)
      if (data === false) {
        changeOrdersAccept(props.webApp.initDataUnsafe.user.id, data)
      }
    })
  }, [])

  const handleSwitchChange = async () => {
    if (!workTime) {
      messageApi.warning('У вас нерабочее время!')
      return
    }

    // Check if the executor's schedule is empty using executorInfo
    if (
      executorInfo &&
      executorInfo.executor_schedule &&
      executorInfo.executor_schedule.length < 1
    ) {
      messageApi.warning('Сначала создайте график!')
      return
    }

    // Ensure all tasks are completed before proceeding
    if (
      !taskInfo.subscription ||
      taskInfo.shortcut !== 2 ||
      taskInfo.invite !== 2
    ) {
      messageApi.warning('Сначала выполните все задания!')
      return
    }

    // Proceed with switch toggle if not disabled
    if (!disabled) {
      props.webApp.HapticFeedback.notificationOccurred('success')
      setDisabled(true) // Block the button

      if (timeoutId) {
        clearTimeout(timeoutId) // Clear previous timeout
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
              setDisabled(false) // Unblock the button
              setTimeoutId(null) // Reset timeoutId
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
            checked={workTime && switchState} // Change from defaultValue to checked
            disabled={disabled}
            onChange={handleSwitchChange}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
