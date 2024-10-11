import React, { useEffect, useState } from 'react'
import { ConfigProvider, message, Spin, Upload, UploadFile } from 'antd'
import {
  CloudUploadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import AWS from 'aws-sdk'
import { TextDispute } from './text-dispute'
import { addVideo, getAllDisputes } from '../API'
import { useRouter } from 'next/navigation'

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
  hasNext,
  setDisputeList,
  video_url,
}: DisputeItemProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false) // Добавляем состояние загрузки
  const [messageApi, contextHolder] = message.useMessage()
  const [showVideoUpload, setShowVideoUpload] = useState(true)
  const router = useRouter()
  // Конфигурация клиента S3
  const s3 = new AWS.S3({
    endpoint: 'https://s3.timeweb.cloud',
    accessKeyId: 'PKG54KTOL8XGWFIOOQGB',
    secretAccessKey: 'Tqe58oD57zo1NFcu3GORTagvfMBriwR2FLxfSbJi',
    region: 'ru-1',
    signatureVersion: 'v4',
  })

  const handleUpload = async (file: File) => {
    setIsUploading(true) // Устанавливаем состояние загрузки

    // Настройка параметров для загрузки файла в S3
    const params = {
      Bucket: '1d74bcbd-tellme24', // Название вашего бакета
      Key: project_id + '', // Имя файла
      Body: file, // Сам файл
      ACL: 'public-read', // Доступ к файлу
      ContentType: file.type, // Тип файла
    }

    try {
      // Загрузка файла в S3
      const response = await s3.upload(params).promise()
      console.log('Файл успешно загружен:', response.Location)
      setFileList([]) // Очищаем список файлов после успешной загрузки
      messageApi.success('Файл успешно загружен')
      addVideo({ project_id, video_url: response.Location }).then(res => {
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
          <span className='text-tg-subtitle-color'>20.02.2024 23:03</span>
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
