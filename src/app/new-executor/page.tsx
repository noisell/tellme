'use client'
import React, { useEffect, useState } from 'react'
import {
  ConfigProvider,
  Input,
  message,
  Spin,
  Tag,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd'
import {
  LoadingOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { createExecutor, getCategories, setCloudStorageItem } from '@/app/API'
import { useRouter } from 'next/navigation'
import { useNav } from '@/context/navContext'

export default function NewExecutorPage() {
  const router = useRouter()
  const { setShowNavigation } = useNav()
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [firstname, setFirstname] = useState<string | undefined>(undefined)
  const [initTags, _setInitTags] = useState([
    'Photoshop',
    'Программирую на Kotlin',
    'Ремонтирую технику',
  ])
  const [tags, setTags] = useState([
    'Photoshop',
    'Программирую на Kotlin',
    'Ремонтирую технику',
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const onExpand: TreeProps['onExpand'] = expandedKeysValue => {
    console.log('onExpand', expandedKeysValue)
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = checkedKeysValue => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue)
  }

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    console.log(newTags)
    setTags(newTags)
  }

  useEffect(() => {
    setFirstname(window.Telegram.WebApp.initDataUnsafe.user?.first_name)
    const backButton = window.Telegram.WebApp.BackButton
    backButton.show()
    backButton.onClick(() => {
      router.back()
    })
    return () => {
      backButton.hide()
      backButton.offClick(() => {
        router.back()
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue])
    }
    setInputValue('')
  }

  // @ts-ignore
  function transformToTreeData(data, parentKey = '') {
    // @ts-ignore
    return data.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`
      const transformedItem = {
        title: item.name,
        key: item.id.toString(),
      }

      if (item.children && item.children.length > 0) {
        // @ts-ignore
        transformedItem.children = transformToTreeData(item.children, key)
      }

      return transformedItem
    })
  }

  useEffect(() => {
    getCategories().then(data => {
      const res = transformToTreeData(data)
      setTreeData(res)
    })
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

  const [messageApi, contextHolder] = message.useMessage()

  const warning = (text: string) => {
    messageApi.open({
      type: 'warning',
      content: text,
    })
  }

  const tagChild = tags.map(forMap)
  const newExecutor = async () => {
    if (firstname === '') {
      warning('Введите имя пользователя!')
    } else if (tags.length === 0) {
      warning('Добавьте хотя бы один навык!')
    } else if (JSON.stringify(initTags) === JSON.stringify(tags)) {
      warning('Добавьте свои навыки!')
    } else if (checkedKeys.length === 0) {
      warning('Выберите хотя бы одну категорию навык!')
    } else {
      if (firstname) {
        setLoading(true)
        createExecutor(
          tags,
          firstname,
          // @ts-ignore
          checkedKeys.map(item => +item),
        )
          .then(() => {
            setCloudStorageItem('executor', 'true')
            setShowNavigation(true)
            router.replace('/')
          })
          .finally(() => setLoading(false))
      }
    }
  }

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
      <div className='flex min-h-screen flex-col text-tg-text-color w-full h-auto items-center bg-tg-section-color py-4 px-6 font-medium '>
        <div
          className='flex flex-col items-center w-full pb-5'
          style={{
            borderBottom: '1px solid var(--tg-theme-section-separator-color)',
          }}>
          <div className='flex w-full font-bold items-center justify-start gap-2 mb-2'>
            <UserOutlined />
            <span>Имя</span>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  activeShadow: 'none',
                  colorTextPlaceholder: '#9c9c9c',
                },
              },
            }}>
            <Input
              type='name'
              size='large'
              style={{
                width: '100%',
                backgroundColor: 'var(--tg-theme-bg-color)',
                borderColor: 'var(--tg-theme-hint-color)',
                color: 'var(--tg-theme-text-color)',
              }}
              placeholder='Ваше имя'
              value={firstname}
              onChange={handleFirstnameChange}
            />
          </ConfigProvider>
        </div>
        <div
          className='flex flex-col items-center w-full mt-5 pb-5'
          style={{
            borderBottom: '1px solid var(--tg-theme-section-separator-color)',
          }}>
          <div className='flex w-full font-medium items-center justify-start gap-2'>
            <MenuUnfoldOutlined />
            <span>Категории</span>
          </div>
          <p className='mr-auto text-xs text-tg-subtitle-color mt-2'>
            Выберите категории в которых вы разбираетесь и готовы выполнять в
            них заказы.
          </p>
          <div className='flex w-full items-center justify-start mt-3'>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
              style={{
                backgroundColor: 'var(--tg-theme-section-bg-color)',
                width: '100%',
                color: 'var(--tg-theme-text-color)',
                fontSize: '16px',
                fontWeight: 'normal',
              }}
            />
          </div>
        </div>
        <div
          className='flex flex-col items-center w-full mt-5 pb-5'
          style={{
            borderBottom: '1px solid var(--tg-theme-section-separator-color)',
          }}>
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
                  activeShadow: 'none',
                  colorTextPlaceholder: '#9c9c9c',
                },
              },
            }}>
            <Input
              type='text'
              size='large'
              style={{
                width: '100%',
                backgroundColor: 'var(--tg-theme-bg-color)',
                borderColor: 'var(--tg-theme-hint-color)',
                color: 'var(--tg-theme-text-color)',
              }}
              placeholder='Введите навык...'
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          </ConfigProvider>
        </div>
        <div className='flex flex-col items-center w-full mt-5 pb-5'>
          <button
            className='w-full bg-tg-button-color p-3 text-tg-button-text-color rounded-2xl flex items-center justify-center'
            onClick={newExecutor}
            disabled={loading}>
            <div className='flex items-center gap-2'>
              {loading && (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: 'white' }} />
                  }
                />
              )}
              Создать аккаунт
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
