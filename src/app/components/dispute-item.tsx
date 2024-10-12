import React, { useEffect, useState } from 'react'
import { ConfigProvider, message, Spin, Upload, UploadFile } from 'antd'
import {
  CloudUploadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { TextDispute } from './text-dispute'
import { getAllDisputes, uploadVideoToBack } from '../API'

interface DisputeItemProps {
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

export const DisputeItem = ({
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
}: DisputeItemProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false) // Добавляем состояние загрузки
  const [messageApi, contextHolder] = message.useMessage()
  const [showVideoUpload, setShowVideoUpload] = useState(true)

  const handleUpload = async (file: File) => {
    setIsUploading(true) // Устанавливаем состояние загрузки

    try {
      // Загрузка сжатого видео на сервер
      uploadVideoToBack({ file: file, project_id }).then(res => {
        setShowVideoUpload(false)
        getAllDisputes({ for_executor: true }).then(data => {
          setDisputeList(data)
        })
      })
    } catch (error) {
      console.error('Ошибка загрузки файла:', error)
      messageApi.error('Ошибка загрузки файла')
    } finally {
      setIsUploading(false) // Сбрасываем состояние загрузки
    }
  }

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

  const handleFileChange = (info: {
    file: UploadFile
    fileList: UploadFile[]
  }) => {
    setFileList(info.fileList)
  }

  useEffect(() => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj as File
      if (file) {
        handleUpload(file)
      }
    }
  }, [fileList])

  return (
    <>
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
          <div className='w-full flex'>
            <ConfigProvider
              theme={{
                components: {
                  Upload: {
                    // Вы можете добавить дополнительные стили для компонента здесь
                  },
                },
              }}>
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Отключаем автоматическую загрузку
                maxCount={1} // Ограничиваем до одного файла
                multiple={false} // Отключаем множественную загрузку
                accept='video/*' // Принимаем только видеофайлы
                showUploadList={false} // Скрываем отображение списка файлов
              >
                <button
                  className='w-full text-center text-[14px] bg-tg-button-color text-tg-button-text-color rounded-xl py-2 px-4 flex items-center justify-center gap-2'
                  disabled={isUploading} // Блокируем кнопку при загрузке
                >
                  {isUploading ? (
                    <>
                      <Spin
                        indicator={
                          <LoadingOutlined spin style={{ color: 'white' }} />
                        }
                      />
                      Идёт загрузка
                    </>
                  ) : (
                    <>
                      <CloudUploadOutlined />
                      Загрузить запись
                    </>
                  )}
                </button>
              </Upload>
            </ConfigProvider>
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
