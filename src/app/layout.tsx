'use client'

import React, { useEffect, useState } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { TelegramProvider } from '@/context/telegramContext'
import { NavProvider } from '@/context/navContext'
import { Nav } from '@/app/components/nav'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['cyrillic'] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const [isTelegramAvailable, setIsTelegramAvailable] = useState<
  //   boolean | null
  // >(null)

  // const pathname = usePathname()

  // useEffect(() => {
  //   if (pathname.includes('/shortcut')) {
  //     setIsTelegramAvailable(true)
  //     return
  //   }

  //   // Check if we are in the browser and if Telegram is available
  //   if (
  //     typeof window !== 'undefined' &&
  //     window.Telegram &&
  //     window.Telegram.WebApp &&
  //     window.Telegram.WebApp.initDataUnsafe &&
  //     window.Telegram.WebApp.initDataUnsafe.user
  //   ) {
  //     setIsTelegramAvailable(true)
  //   } else {
  //     setIsTelegramAvailable(false)
  //   }
  // }, [])

  return (
    <html lang='en'>
      <head>
        <title>Tellme</title>
        <Script
          src='https://telegram.org/js/telegram-web-app.js'
          strategy='beforeInteractive'
        />
      </head>
      <body className={inter.className}>
        {/* {!isTelegramAvailable && (
          <div className='flex items-center justify-center min-h-screen max-w-[230px] text-center'>
            Зайдите в Telegram для взаимодействия с ботом
          </div>
        )} */}

        <TelegramProvider>
          <NavProvider>
            <AntdRegistry>
              {children}

              <Nav />
            </AntdRegistry>
          </NavProvider>
        </TelegramProvider>
      </body>
    </html>
  )
}
