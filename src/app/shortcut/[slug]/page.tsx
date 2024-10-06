'use client'
import React, { useEffect, useState } from 'react'
import { addShortcut, getShortcut, updateTask, taskInfoSimple } from '@/app/API'
import { useRouter } from 'next/navigation'

export default function ShortCut({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [statusTask, setStatusTask] = useState<0 | 1 | 2 | undefined>(undefined)
  const [timeLeft, setTimeLeft] = useState<number>(600)

  const calculateTimeLeft = (apiTime: string): number => {
    const apiDate = new Date(apiTime)
    console.log('apiDate', apiDate)
    const now = new Date()
    const nowUTC = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    )
    const tenMinutesAgo = new Date(nowUTC.getTime() - 10 * 60 * 1000)
    if (apiDate < tenMinutesAgo) {
      updateTask(Number(params.slug), 'shortcut', 2).then()
      router.replace(
        `https://t.me/Tellme_tips_bot?startapp=shortcut${params.slug}`,
      )
      return 0
    }
    console.log(
      'Math.ceil',
      Math.ceil((nowUTC.getTime() - apiDate.getTime()) / 1000),
    )
    return 600 - Math.ceil((nowUTC.getTime() - apiDate.getTime()) / 1000)
  }
  useEffect(() => {
    // @ts-ignore
    taskInfoSimple(Number(params.slug)).then(r => {
      const shortcut = r.shortcut
      if (shortcut == 0) {
        addShortcut(Number(params.slug)).then()
        setTimeLeft(600)
      } else if (shortcut == 1) {
        // @ts-ignore
        getShortcut(Number(params.slug)).then(r => {
          if (r == false) {
            return
          }
          setTimeLeft(calculateTimeLeft(r))
        })
      } else {
        router.replace(
          `https://t.me/Tellme_tips_bot?startapp=shortcut${params.slug}`,
        )
      }
      setStatusTask(r.shortcut)
    })
  }, [])
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => (prevTime ? prevTime - 1 : 0))
      }, 1000)
    } else {
      updateTask(Number(params.slug), 'shortcut', 2).then()
      router.replace(
        `https://t.me/Tellme_tips_bot?startapp=shortcut${params.slug}`,
      )
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [timeLeft])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return statusTask === undefined ? (
    <div>Загрузка</div>
  ) : (
    <main className='w-screen h-screen flex relative bg-[#111111] items-center justify-center'>
      <div className='text-white flex flex-col items-center w-full max-w-[400px] bg-[#141414] rounded-3xl'>
        <img
          src='/thunder.gif'
          alt='Изображение карточки'
          width={'70%'}
          className='mt-5'
        />
        <h1 className='font-bold text-3xl text-blue-500 mt-5'>
          Создание ярлыка
        </h1>
        <div className='flex flex-col px-5 mt-5'>
          <p className=''>
            1. Нажмите на 3 точки или "Поделиться" в этом окне.
          </p>
          <p className='mt-3'>
            2. Выберите "Добавить на главный экран" или "Создать ярлык" и
            следуйте инструкциям браузера.
          </p>
          <p className='mt-3'>
            3. Все готово! Теперь вы сможете удобно заходить в Tellme через
            главный экран своего телефона.
          </p>
        </div>
        <h1 className='text-xl mt-5 text-blue-500 pb-4'>
          Осталось: {formatTime(timeLeft)}
        </h1>
      </div>
    </main>
  )
}
