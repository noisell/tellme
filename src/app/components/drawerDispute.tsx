import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DrawerDispute(props: Props) {
  const { open, setOpen } = props
  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}>
      <div className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-tg-section-color text-tg-text-color rounded-t-3xl'>
        <span className='w-10 h-1 bg-tg-subtitle-color rounded-xl'></span>
        <img src='/white-exclamation.gif' alt='My GIF' width={'60%'} />
        <span className='flex flex-col text-left gap-y-2'>
          <p className='font-bold mb-2 ' style={{ fontSize: '14px' }}>
            У вас с заказчиком произошёл спор
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            • Если вы не предоставите видеозапись звонка в течение 24 часов с
            момента открытия спора, то деньги автоматически вернуться заказчику
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            • Рекомендуем всегда делать запись видеозвонков, чтобы использовать
            её как доказательство вашей правоты
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            • Пожалуйста, убедитесь, что ваш видеозапись является ясной и
            подтверждает вашу позицию в споре
          </p>
          <p className='text-tg-subtitle-color' style={{ fontSize: '14px' }}>
            • Если у вас возникнут дополнительные вопросы, обратитесь в службу
            поддержки
          </p>
        </span>
      </div>
    </SwipeableDrawer>
  )
}
