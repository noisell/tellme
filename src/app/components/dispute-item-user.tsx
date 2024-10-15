import React from 'react'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { TextDispute } from './text-dispute'

interface DisputeItemUserProps {
  project_id: number
  question: string
  category: string
  admin_id?: number | null
  created_at: string
  next: () => void
  prev: () => void
  hasNext: boolean
  video_url: string | null
  setDisputeList: (res: any) => void
}

export const DisputeItemUser = ({
  category,
  project_id,
  next,
  admin_id,
  prev,
  question,
  created_at,
  hasNext,
  setDisputeList,
  video_url,
}: DisputeItemUserProps) => {
  function formatToUserTimezone(dateString: string): string {
    // Преобразуем строку в объект Date (UTC)
    const date = new Date(dateString)

    // Получаем смещение временной зоны пользователя в минутах
    const timezoneOffsetMinutes = date.getTimezoneOffset()

    // Применяем смещение к дате
    const userDate = new Date(
      date.getTime() - timezoneOffsetMinutes * 60 * 1000,
    )

    // Получаем компоненты даты с учётом локального времени пользователя
    const day = String(userDate.getDate()).padStart(2, '0') // День с ведущим нулём
    const month = String(userDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
    const year = userDate.getFullYear()

    // Получаем компоненты времени с учётом локального времени пользователя
    const hours = String(userDate.getHours()).padStart(2, '0')
    const minutes = String(userDate.getMinutes()).padStart(2, '0')

    // Форматируем в строку "dd.mm.yyyy hh:mm"
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  return (
    <>
      <div className='text-left w-full font-normal mt-3 text-[14px] flex flex-col gap-1'>
        <div>
          Дата открытия спора:{' '}
          <span className='text-tg-subtitle-color'>
            {formatToUserTimezone(created_at)}
          </span>
        </div>
        <div>
          Категория: <span className='text-tg-subtitle-color'>{category}</span>
        </div>
        <div>
          Вопрос, который решали на созвоне:{' '}
          <div className='inline-flex'>
            <TextDispute text={question} />
          </div>
        </div>
      </div>

      <div className='flex justify-between mt-4 w-full gap-3 text-tg-accent-color'>
        {hasNext && (
          <button
            onClick={prev}
            className='bg-tg-section-second-color rounded-xl py-2 px-4'>
            <ArrowLeftOutlined />
          </button>
        )}
        {!video_url && (
          <div className='bg-tg-section-second-color text-[14px] w-full rounded-xl py-2 px-4 text-center flex justify-center items-center'>
            Ожидаем ответа эксперта
          </div>
        )}
        {video_url && (
          <div className='bg-tg-section-second-color text-[14px] w-full rounded-xl py-2 px-4 text-center flex justify-center items-center'>
            {admin_id && <>Спор решается</>}
            {!admin_id && <>Спор в обработке</>}
          </div>
        )}
        {hasNext && (
          <button
            onClick={next}
            className='bg-tg-section-second-color rounded-xl py-2 px-4'>
            <ArrowRightOutlined />
          </button>
        )}
      </div>
    </>
  )
}
