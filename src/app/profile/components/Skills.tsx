'use client'
import { useEffect, useState } from 'react'
import { ConfigProvider, Input, message, Spin, Tag } from 'antd'
import { LoadingOutlined, OrderedListOutlined } from '@ant-design/icons'
import { getExecutorInfoById, updateSkills } from '@/app/API'
import loading from '@/app/loading'

export const Skills = () => {
  const [tags, setTags] = useState<string[]>([])
  const [initTags, setInitTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    console.log(newTags)
    setTags(newTags)
  }

  const [messageApi, contextHolder] = message.useMessage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue])
    }
    setInputValue('')
  }

  const fetchData = async () => {
    const res = await getExecutorInfoById()
    setInitTags(res.skills)
    setTags(res.skills)
  }

  const handleUpdate = async () => {
    if (tags.length === 0) {
      messageApi.error('Напишите хотя бы один навык!')
    } else {
      setLoading(true)
      await updateSkills(tags)
        .then(() => {
          fetchData()
          messageApi.success('Вы успешно изменили список навыков!')
        })
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const forMap = (tag: string) => (
    <span key={tag} style={{ display: 'flex' }}>
      <Tag
        closable
        onClose={e => {
          e.preventDefault()
          handleClose(tag)
        }}
        style={{
          width: 'auto',
          padding: '5px 15px',
          backgroundColor: 'var(--tg-second-section-color)',
          color: 'var(--tg-theme-accent-text-color)',
          border: '1px solid var(--tg-theme-hint-color)',
          borderRadius: '10px',
        }}>
        {tag}
      </Tag>
    </span>
  )

  const tagChild = tags.map(forMap)
  return (
    <div
      className={`flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4 font-medium`}>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentBg: 'var(--tg-second-section-color)',
              colorText: 'var(--tg-theme-text-color)',
            },
            Input: {
              colorBgContainer: 'var(--tg-second-section-color)',
              colorBorder: 'transparent',
              colorText: 'var(--tg-theme-text-color)',
              colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
              borderRadiusLG: 12,
              activeBorderColor: 'transparent',
              activeShadow: 'transparent',
              hoverBorderColor: 'transparent',
            },
          },
        }}>
        {contextHolder}
      </ConfigProvider>
      <div className='flex flex-col items-center w-full'>
        <div className='flex w-full font-medium items-center justify-start gap-2'>
          <OrderedListOutlined />
          <span>Ваши навыки</span>
        </div>
        <p className='mr-auto text-xs text-tg-subtitle-color mt-2'>
          Напишите свои навыки по всем категориям. Их будут видеть только
          заказчики. В будущем вы всегда сможете изменить их в профиле
        </p>
        <div className='flex mt-3 mb-5 w-full items-center flex-wrap justify-start gap-y-2'>
          <ConfigProvider
            theme={{
              components: {
                Tag: {
                  colorTextDescription: 'var(--tg-theme-accent-text-color)',
                },
              },
            }}>
            {tagChild}
          </ConfigProvider>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBgContainer: 'var(--tg-second-section-color)',
                colorBorder: 'transparent',
                colorText: 'var(--tg-theme-text-color)',
                colorTextPlaceholder: 'var(--tg-theme-subtitle-text-color)',
                borderRadiusLG: 12,
                activeBorderColor: 'transparent',
                activeShadow: 'transparent',
                hoverBorderColor: 'transparent',
              },
            },
          }}>
          <Input
            type='text'
            size='large'
            className='bg-tg-section-second-color'
            placeholder='Введите навык...'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        </ConfigProvider>
        {JSON.stringify(tags) !== JSON.stringify(initTags) && (
          <div className='flex w-full items-center justify-between mt-3'>
            <button
              className='p-3 bg-tg-button-color text-tg-text-color rounded-xl flex items-center justify-center'
              style={{ width: '48%' }}
              onClick={handleUpdate}
              disabled={loading}>
              <div className='flex items-center gap-2'>
                {loading && (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: 'white' }} />
                    }
                  />
                )}
                Сохранить
              </div>
            </button>
            <button
              className='p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={() => setTags(initTags)}>
              Отменить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
