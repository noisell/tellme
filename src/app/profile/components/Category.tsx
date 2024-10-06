'use client'
import { useEffect, useState } from 'react'
import { ConfigProvider, message, Tree, TreeDataNode, TreeProps } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import {
  getCategories,
  getCategoriesExecutor,
  updateCategories,
} from '@/app/API'

export const Category = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [initCheckedKeys, setInitCheckedKeys] = useState<string[]>([])
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const onExpand: TreeProps['onExpand'] = expandedKeysValue => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = checkedKeysValue => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue as string[])
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue)
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
  console.log(checkedKeys)

  const handleUpdate = async () => {
    if (checkedKeys.length === 0) {
      messageApi.error('Вы не выбрали ни одной категорию!')
    } else {
      await updateCategories(checkedKeys.map(item => +item)).then(data => {
        getUserCategories()
        messageApi.success('Вы успешно изменили список категорий!')
      })
    }
  }

  const getUserCategories = async () => {
    try {
      const res = (await getCategoriesExecutor()) as { categories: number[] }
      setCheckedKeys(res.categories.map(item => item.toString()))
      setInitCheckedKeys(res.categories.map(item => item.toString()))
    } catch (error) {
      console.log(error)
    }
  }

  console.log(checkedKeys)

  useEffect(() => {
    getCategories().then(data => {
      const res = transformToTreeData(data)
      setTreeData(res)
    })
    getUserCategories()
  }, [])

  const [messageApi, contextHolder] = message.useMessage()

  return (
    <div
      className={`flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4 font-medium ${
        window.Telegram.WebApp.colorScheme === 'light' &&
        'shadow-md shadow-gray-400'
      }`}>
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
      <div className='flex flex-col items-center w-full'>
        <div className='flex w-full font-medium items-center justify-start gap-2'>
          <MenuUnfoldOutlined />
          <span>Категории</span>
        </div>
        <p className='mr-auto text-xs text-tg-subtitle-color mt-2'>
          Выберите категории в которых вы разбираетесь и готовы выполнять в них
          заказы.
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
        {JSON.stringify(initCheckedKeys) !== JSON.stringify(checkedKeys) && (
          <div className='flex w-full items-center justify-between mt-3'>
            <button
              className='p-3 bg-tg-button-color text-tg-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={handleUpdate}>
              Сохранить
            </button>
            <button
              className='p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={() => setCheckedKeys(initCheckedKeys)}>
              Отменить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
