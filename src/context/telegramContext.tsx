'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ITelegramUser, IWebApp } from './types'

export interface ITelegramContext {
  webApp?: IWebApp
  user?: ITelegramUser
}

export const TelegramContext = createContext<ITelegramContext>({})

window.Telegram = {
  WebApp: {
    initDataUnsafe: {
      user: {
        id: 464821242,
        username: 'Nikita',
        first_name: 'Nikita228',
      },
    },
    offEvent: () => {},
    HapticFeedback: {
      impactOccurred(style) {
        console.log(style)
      },
    },
    BackButton: {
      hide() {},
      offClick(callback) {},
      show() {},
      onClick(callback) {},
    },
    initData: 'lala',
    ready: () => {},
    onEvent: (
      type: 'popupClosed',
      callback: { button_id: string | null },
    ) => {},
    CloudStorage: {
      setItem(
        key: string,
        value: string,
        callback?: (err: Error | null, success: boolean) => void,
      ): void {
        console.log('setItem')

        if (!this.isValidKey(key)) {
          callback?.(new Error('Invalid key'), false)
          return
        }
        console.log('setItem')
        if (value.length > 4096) {
          callback?.(new Error('Value exceeds maximum length'), false)
          return
        }
        try {
          console.log(key, value)

          localStorage.setItem(key, value)
          callback?.(null, true)
        } catch (error) {
          console.error(error)

          callback?.(error, false)
        }
      },
      getItem(
        key: string,
        callback: (err: Error | null, value: string | null) => void,
      ): void {
        if (!this.isValidKey(key)) {
          callback(new Error('Invalid key'), null)
          return
        }
        try {
          const value = localStorage.getItem(key)
          callback(null, value)
        } catch (error) {
          callback(error, null)
        }
      },
      isValidKey(key: string): boolean {
        return (
          key.length >= 1 && key.length <= 128 && /^[A-Za-z0-9_-]+$/.test(key)
        )
      },
    },
  },
}

export const TelegramProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null)

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp
    if (app && !webApp) {
      app.ready()
      setWebApp(app)
    }
  }, [])

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp?.initDataUnsafe,
          user: webApp?.initDataUnsafe.user,
        }
      : {}
  }, [webApp])

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => useContext(TelegramContext)
