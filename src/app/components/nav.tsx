'use client'
import React from 'react'
import { BarChartOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import { ConfigProvider, Badge } from 'antd'
import { useRouter } from 'next/navigation'
import { useNav } from '@/context/navContext'
import Link from 'next/link'

export function Nav() {
  const router = useRouter()
  const { activeButton, showNavigation, setActiveButton } = useNav()
  const handleClick = (href: string) => {
    router.push(href)
  }

  const activeColor = (href: string) => {
    return activeButton === href
      ? 'var(--tg-theme-button-color)'
      : 'var(--tg-theme-subtitle-text-color)'
  }
  if (!showNavigation) return null
  return (
    <nav
      className={
        'flex w-full items-center justify-around fixed bottom-0 py-3 px-7 z-50 bg-tg-bottom_background-color text-2xl text-tg-subtitle-color'
      }>
      <ConfigProvider
        theme={{
          components: {
            Badge: {
              colorBorderBg: 'var(--tg-theme-secondary-bg-color)',
              fontSize: 12,
            },
          },
        }}>
        <Badge count={0}>
          <Link
            href={'/'}
            onClick={() => {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
              setActiveButton('/')
            }}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
            }}>
            <HomeOutlined
              style={{ fontSize: '24px', color: `${activeColor('/')}` }}
            />
            <p style={{ fontSize: '11px', color: `${activeColor('/')}` }}>
              Главная
            </p>
          </Link>
        </Badge>
        <Badge count={0}>
          <Link
            href={'/statistics'}
            onClick={() => {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
              setActiveButton('/statistics')
            }}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
            }}>
            <BarChartOutlined
              style={{
                fontSize: '24px',
                color: `${activeColor('/statistics')}`,
              }}
            />
            <p
              style={{
                fontSize: '11px',
                color: `${activeColor('/statistics')}`,
              }}>
              Статистика
            </p>
          </Link>
        </Badge>
        <Badge count={0}>
          <Link
            href={'/profile'}
            onClick={() => {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
              setActiveButton('/profile')
            }}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
            }}>
            <UserOutlined
              style={{ fontSize: '24px', color: `${activeColor('/profile')}` }}
            />
            <p
              style={{ fontSize: '11px', color: `${activeColor('/profile')}` }}>
              Профиль
            </p>
          </Link>
        </Badge>
      </ConfigProvider>
    </nav>
  )
}
