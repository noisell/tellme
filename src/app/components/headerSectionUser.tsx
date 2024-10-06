import { SettingOutlined, UserOutlined } from '@ant-design/icons'
import React from 'react'

interface Props {
  first_name: string
}

export function HeaderSectionUser(props: Props) {
  return (
    <div className='flex flex-col w-full h-auto items-center bg-tg-section-color from-cyan-950 to-cyan-800 rounded-b-3xl p-4'>
      <div className='flex w-full mt-2 justify-between items-center'>
        <div className='flex gap-2 items-center rounded-xl py-2 px-3 bg-tg-section-second-color'>
          <div className='flex'>
            <UserOutlined
              style={{
                fontSize: '23px',
                color: 'var(--tg-theme-accent-text-color)',
              }}
            />
          </div>
          <div
            className='flex flex-col'
            style={{ fontSize: '12px', lineHeight: '14px' }}>
            <p className='text-nowrap'>
              {props.first_name.length > 12
                ? props.first_name.slice(0, 12)
                : props.first_name}
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center text-xs w-full px-5 text-tg-accent-color'>
          <p className='bg-tg-section-second-color p-3 rounded-xl'></p>
        </div>
        <div className='flex gap-2 font-medium text-tg-text-color'>
          <SettingOutlined style={{ fontSize: '23px' }} />
        </div>
      </div>
      {/*<div className="flex flex-col mt-6 items-center">*/}
      {/*    <span className="text-tg-subtitle-color">Сегодня</span>*/}
      {/*    <span className="mt-2 text-4xl font-medium">{props.incomeToday} <span*/}
      {/*        className="text-tg-subtitle-color">₽</span></span>*/}
      {/*</div>*/}
    </div>
  )
}
