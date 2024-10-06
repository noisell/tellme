import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  content: React.ReactNode
}

export function Drawer(props: Props) {
  const { open, setOpen, content } = props
  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}>
      <div className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-tg-section-color text-tg-text-color rounded-t-3xl'>
        <span className='w-10 h-1 bg-tg-subtitle-color rounded-xl'></span>
        {content}
      </div>
    </SwipeableDrawer>
  )
}
