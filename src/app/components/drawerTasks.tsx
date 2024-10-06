import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DrawerTasks(props: Props) {
  const { open, setOpen } = props
  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}>
      <div className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-tg-section-color text-tg-text-color rounded-t-3xl'>
        <span className='w-10 h-1 bg-tg-subtitle-color rounded-xl'></span>
        <img src='/folder.gif' alt='My GIF' width={'60%'} />
        <span className='flex flex-col text-left mt-5 gap-y-2'>
          <p className='font-bold mb-2 ' style={{ fontSize: '14px' }}>
            Чтобы принимать заказы и повышать свой уровень необходимо выполнить
            3 простых задания:
          </p>
          <p className='text-tg-accent-color' style={{ fontSize: '14px' }}>
            • Пригласить двоих друзей в приложение
          </p>
          <p className='text-tg-accent-color' style={{ fontSize: '14px' }}>
            • Подписаться на наш канал
          </p>
          <p className='text-tg-accent-color' style={{ fontSize: '14px' }}>
            • Создать ярлык приложения на рабочий стол
          </p>
          <p
            className='text-tg-subtitle-color mt-2'
            style={{ fontSize: '14px' }}>
            Выполняя задания вы очень помогаете нам в развитии платформы, мы это
            ценим и поэтому пользователи, которые подписаны на наш канал имеют
            более высокий приоритет в поиске заказов, тем самым они быстрее
            повышают свои уровень и доход в целом.
          </p>
        </span>
      </div>
    </SwipeableDrawer>
  )
}
