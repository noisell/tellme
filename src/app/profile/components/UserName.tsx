'use client'
import { useEffect, useState } from 'react'
import { ConfigProvider, Input, message, Spin } from 'antd'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import { getById, updateFirstName } from '@/app/API'
import { useNav } from '@/context/navContext'
import { GetByIdResponse } from '../../types'

export const UserName = () => {
  const { setShowNavigation, setActiveButton } = useNav()
  const [firstname, setFirstname] = useState<string>('')
  const [initFirstname, setInitFirstname] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value)
  }

  const [messageApi, contextHolder] = message.useMessage()

  const getUserInfoById = async () => {
    getById().then(res => {
      const r = res as GetByIdResponse
      setFirstname(r.name)
      setInitFirstname(r.name)
    })
  }

  useEffect(() => {
    getUserInfoById()
  }, [])

  useEffect(() => {
    setShowNavigation(true)
    setActiveButton('/profile')
  }, [])

  const handleChangeFirstName = () => {
    if (firstname === '') {
      messageApi.error('Имя пользователя не может быть пустым')
    } else {
      setLoading(true)
      updateFirstName(firstname)
        .then(() => {
          messageApi.open({
            type: 'success',
            content: 'Имя пользователя изменено',
          })
          getUserInfoById()
        })
        .finally(() => setLoading(false))
    }
  }
  return (
    <div
      className={`flex flex-col w-full h-auto items-center bg-tg-section-color rounded-b-3xl p-4 font-medium ${
        window.Telegram.WebApp.colorScheme === 'light' &&
        'shadow-md shadow-gray-400'
      }`}>
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
      <div className='flex flex-col items-center w-full'>
        <div className='flex w-full font-bold items-center justify-start gap-2 mb-2'>
          <UserOutlined />
          <span>Имя</span>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                activeShadow: 'none',
                colorTextPlaceholder: '#9c9c9c',
              },
            },
          }}>
          <Input
            type='name'
            size='large'
            style={{
              width: '100%',
              backgroundColor: 'var(--tg-theme-bg-color)',
              borderColor: 'var(--tg-theme-hint-color)',
              color: 'var(--tg-theme-text-color)',
            }}
            placeholder='Ваше имя'
            value={firstname}
            onChange={handleFirstnameChange}
          />
        </ConfigProvider>
        {firstname !== initFirstname && (
          <div className='flex w-full items-center justify-between mt-3'>
            <button
              className='p-3 bg-tg-button-color text-tg-text-color rounded-xl flex gap-2 items-center justify-center'
              style={{ width: '48%' }}
              onClick={handleChangeFirstName}
              disabled={loading}>
              <div className='flex items-center gap-2'>
                {loading && (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: 'white' }} />
                    }
                  />
                )}
                Сохранить
              </div>
            </button>
            <button
              className='p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={() => setFirstname(initFirstname)}>
              Отменить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
