import React, { useState } from 'react'
import { Upload, UploadFile } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { TextDispute } from './text-dispute'
import { ConfigProvider, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import AWS from 'aws-sdk'

export const DisputeItem: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Configure the S3 client
  const s3 = new AWS.S3({
    endpoint: 'https://s3.timeweb.cloud',
    accessKeyId: 'PKG54KTOL8XGWFIOOQGB',
    secretAccessKey: 'Tqe58oD57zo1NFcu3GORTagvfMBriwR2FLxfSbJi',
    region: 'ru-1',
    signatureVersion: 'v4',
  })

  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList)
    // Log fileList for debugging
    console.log('Updated file list:', info.fileList)
  }

  const handleUpload = async () => {
    if (fileList.length === 0) {
      console.error('Ошибка: Файл не загружен')
      return
    }

    const file = fileList[0].originFileObj as File // Get the first file

    // Set up the S3 upload parameters
    const params = {
      Bucket: '1d74bcbd-tellme24', // Your bucket name
      Key: file.name, // Use the file name
      Body: file, // The file to upload
      ACL: 'public-read', // Set ACL if you want public access
      ContentType: file.type, // Set the content type
    }

    try {
      // Upload the file to S3
      const response = await s3.upload(params).promise()
      console.log('File uploaded successfully:', response.Location)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <>
      <div className='text-left w-full mt-3 text-[14px]'>
        <div>
          Дата открытия спора:{' '}
          <span className='text-tg-subtitle-color'>20.02.2024 23:03</span>
        </div>
        <div>
          Категория: <span className='text-tg-subtitle-color'>Говно</span>
        </div>
        <div>
          Вопрос, который решали на созвоне:{' '}
          <div className='inline-flex'>
            <TextDispute text='Lorem ipsum, dolor sit amet consectetur adipisicing elit. A assumenda, blanditiis vero nostrum optio quas dolorem tenetur. Veritatis amet esse error numquam eum, provident consequatur exercitationem, adipisci, dolorem vitae natus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. A assumenda, blanditiis vero nostrum optio quas dolorem tenetur. Veritatis amet esse error numquam eum, provident consequatur exercitationem, adipisci, dolorem vitae natus.' />
          </div>
        </div>
      </div>
      <div className='flex gap-3 items-center justify-between mt-3'>
        <ConfigProvider
          theme={{
            components: {
              Upload: {
                colorBorder: 'var(--tg-theme-subtitle-text-color)',
              },
            },
          }}>
          <Dragger
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <div className='flex items-center justify-between gap-3'>
              <div className='text-tg-accent-color'>
                <InboxOutlined style={{ fontSize: 60 }} />
              </div>
              <div className='text-tg-text-color text-left'>
                <p className=''>Загрузите видеозапись вашего звонка</p>
                <p className='text-tg-subtitle-color leading-[15px]'>
                  Если вы не предоставите видеозапись звонка в течение 24 часов
                  с момента открытия спора, то деньги автоматически вернуться
                  заказчику
                </p>
              </div>
            </div>
          </Dragger>
          <Button type='primary' onClick={handleUpload} className='mt-3'>
            Отправить
          </Button>
        </ConfigProvider>
      </div>
    </>
  )
}
