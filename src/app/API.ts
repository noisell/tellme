import axios from 'axios'
import { ITelegramUser, IWebApp } from '@/context/types'
import {
  Categories,
  ExecuterData,
  ExecutorSchedule,
  GetByIdResponse,
  Level,
  PageState,
  Top,
  UserData,
} from '@/app/types'
import { NullableBoolean } from 'aws-sdk/clients/autoscaling'

const baseURL = 'https://api.tellme.tips'
export const axiosBase = async (cookie: boolean = false) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${await getCloudStorageItem(
        'access_token',
        false,
      )}`,
      'Content-Type': 'application/json',
    },
    withCredentials: cookie,
  })
}
// const baseURL = 'https://api.two-market.ru'
// export const axiosBase = async (cookie: boolean = false) => {
//   return axios.create({
//     baseURL: baseURL,
//     headers: {
//       Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ0FBQUFBQm5DOWtBNmIzYkx0SW9rZ0Q4bUFKNmpURFBsaDZIVTJ1MG5qWU9qN3pvWmFTMmM0ejlNaDJJZmNtLTNtcVJRN0wwV3laSEpON1BRQmVjcTY0bWdGNTlZMTlSX3c9PSIsInN1cGVydXNlciI6ZmFsc2UsImV4cCI6MTcyODg4OTY5Ni43ODQ0OTZ9.BIVeXHIieweEPSq9OkJhl0nQFeGyBIgl0MJ0CS5B55ujKv6HH4GLkdWvWfJx5Q2MEYQmqq4knOmglpCveZbJLBexeyzuzgMQXILGXzchKHTwKGPfRwJjXHnHQRUhs1nBU0U5rXBfAQ7LMOBurixbG_PZZkqG5emPzp2Yh8B2IIQBsN_RyxuRiCMb5VKI7u3mO2WAPuar-Fbv_zDWtkUnYa8dizjVzxk6L7c9Wg5zusTBDu8baxVOAdYURrxPBXTOpWoR_zGymqb1kzEl6piVby8UdIYLG4XYl1FR4lULVqYdLjZP_PhUlRWP8BF6FpumPrTFJZQtjCVlMhq3dta5zw`,
//       'Content-Type': 'application/json',
//     },
//     withCredentials: cookie,
//   })
// }

export async function checkStartParam(startParam: string | undefined) {
  if (startParam) {
    console.log('startParam True')
    if (startParam.startsWith('referrer')) {
      console.log('startsWith True')
      const userId = startParam.replace('referrer', '') // Извлекаем значение после "referrer"
      if (/^\d+$/.test(userId)) {
        console.log('Number True') // Проверяем, является ли значение числом
        try {
          const response = await axios.get(`${baseURL}/user/checkExist`, {
            headers: { 'Content-Type': 'application/json' },
            params: { user_id: Number(userId) },
          })

          if (response.status === 200) {
            await axios.patch(`${baseURL}/user/task/update`, {
              user_id: Number(userId),
              task: 'invite',
              value: 1,
            })
            return Number(userId)
          }
        } catch (error) {
          return null
        }
      }
    }
  }
  return null
}

export async function createUser(
  user_id: number,
  name: string,
  username: string | null,
  startParam: string | undefined,
  time_zone: string,
) {
  const referrer_id = await checkStartParam(startParam)
  try {
    const response = await axios.post(
      `${baseURL}/user/create`,
      {
        id: user_id,
        name: name,
        username: username,
        referrer_id: referrer_id,
        time_zone: time_zone,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response.status === 200
  } catch (error) {
    return false
  }
}

export async function getCloudStorageItem(
  key: string,
  checkToken: boolean = true,
) {
  return new Promise((resolve, reject) => {
    window.Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
      if (error) {
        reject(new Error('ItemAbsent'))
      } else {
        if (checkToken) {
          const fetchData = async () => {
            try {
              const response = await axios.post(
                `${baseURL}/auth/validateJWTToken`,
                {},
                { headers: { Authorization: `Bearer ${value}` } },
              )
              return response.status
            } catch (error) {
              reject(new Error('UnknownError'))
            }
          }

          fetchData()
            .then(data => {
              if (data === 204) {
                resolve(value)
              } else {
                reject(new Error('InvalidToken'))
              }
            })
            .catch(error => {
              reject(new Error('UnknownError'))
            })
        } else resolve(value)
      }
    })
  })
}

export async function login(
  user_id: number,
  username: string | null,
  initData: string,
) {
  const instance = await axiosBase(true)
  try {
    const response = await instance.post(`${baseURL}/auth/login`, {
      user_id: user_id,
      username: username,
      init_data: initData,
    })

    if (response.status === 200) {
      console.log('Access', `${response.headers['authorization']}`)
      return response.headers['authorization'].split(' ')[1]
    }
  } catch (error) {
    console.log('ErrorInLogin:', error)
    return false
  }
}

export async function refreshToken(user_id: number) {
  const instance = await axiosBase(true)
  try {
    const response = await instance.post(`${baseURL}/auth/refresh`, {
      user_id: user_id,
    })
    if (response.status === 200) {
      console.log('Access Token перевыпущен')
      return response.headers['authorization'].split(' ')[1]
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return false
    } else if (error instanceof Error) {
      console.error(error.message)
      return false
    }
  }
}

export async function getAccessToken(user_id: number) {
  try {
    return await getCloudStorageItem('access_token')
  } catch (error: any) {
    if (error.message === 'InvalidToken') {
      try {
        return await refreshToken(user_id)
      } catch (error) {}
    }
  }
  return false
}

export async function setCloudStorageItem(key: string, token: string) {
  window.Telegram.WebApp.CloudStorage.setItem(key, token)
}

export async function authorization(
  user: ITelegramUser,
  webApp: IWebApp,
  startParam: string | undefined,
  time_zone: string,
) {
  let new_user: boolean = false
  let new_access_token = await login(user.id, user.username, webApp.initData)
  if (!new_access_token) {
    new_user = true
    await createUser(
      user.id,
      user.first_name,
      user.username,
      startParam,
      time_zone,
    )
    new_access_token = await login(user.id, user.username, webApp.initData)
  }
  await setCloudStorageItem('access_token', new_access_token)
  return new_user
}

export async function HTTP401Exception(
  user_id: number,
  func: (...args: any[]) => unknown,
  ...args: any[]
) {
  const newAccessToken = await refreshToken(user_id)
  if (!newAccessToken) {
    return window.Telegram.WebApp.showPopup({
      title: 'Время сессии истекло',
      message: 'Пожалуйста закройте или перезапустите приложение.',
      buttons: [{ id: 'closeWebApp', type: 'close', text: 'Закрыть' }],
    })
  } else {
    await setCloudStorageItem('access_token', newAccessToken)
    return func(...args)
  }
}

export async function getExecutorInfo(user: ITelegramUser) {
  const instance = await axiosBase()
  try {
    const response = await instance.get('/executor/getById')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(user.id, getExecutorInfo, user)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getExecutorInfoById() {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/executor/getById')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getExecutorInfoById)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getAllDisputes(params: { for_executor: boolean }) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/project/dispute/all', { params })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getAllDisputes, params)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getAllConfirmProjects(params: { for_executor: boolean }) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/project/get/confirm/all', { params })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getAllConfirmProjects, params)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function confirmProject(data: {
  project_id: number
  for_executor: boolean
  value: boolean
}) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.patch('/project/confirm', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, confirmProject, data)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function createDispute(data: {
  project_id: number
  executor_id: number
  message: string
  video_url: string | null
}) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  const dataParams = {
    user_id: userId,
    project_id: data.project_id,
    executor_id: data.executor_id,
    message: data.message,
    video_url: data.video_url,
  }
  try {
    const response = await instance.post('/project/dispute/create', dataParams)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, createDispute, dataParams)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function addVideo(data: {
  project_id: number
  video_url: string
}) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.patch('/project/dispute/video/add', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, addVideo, data)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getNowWorkTime() {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/executor/nowWorkTime')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getNowWorkTime)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function uploadVideoToBack({
  file,
  project_id,
}: {
  file: File
  project_id: number
}) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number

  const renamedFile = new File(
    [file],
    `${project_id}.${file.name.split('.').pop()}`,
    {
      type: file.type,
    },
  )

  const formData = new FormData()
  formData.append('file', renamedFile)
  formData.append('project_id', String(project_id))

  try {
    const response = await instance.post('/project/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Explicitly set the Content-Type
      },
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getNowWorkTime)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function updateSkills(skills: string[]) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.patch('/executor/update/skills', {
      skills: skills,
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, updateSkills, skills)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getCategoriesExecutor() {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/executor/get/categories')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getCategoriesExecutor)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function updateCategories(categories: number[]) {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.put('/executor/update/categories', {
      categories: categories,
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, updateSkills, categories)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getById() {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get<GetByIdResponse>('/user/getById')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getById)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getProjectDifference() {
  const instance = await axiosBase()
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const response = await instance.get('/project/difference')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      switch (error.status) {
        case 401:
          return await HTTP401Exception(userId, getProjectDifference)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getUserInfo(user: ITelegramUser) {
  const instance = await axiosBase()
  try {
    const response = await instance.get('/user/getUsefulData')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user.id, getUserInfo, user)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function updateFirstName(firstname: string) {
  const instance = await axiosBase()
  try {
    await instance.patch('/user/update/firstname', { firstname: firstname })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          updateFirstName,
          firstname,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function createProject(data: {
  category_id: number
  level_id: number
  time: number
  question: string
  interval: {
    time_start: string
    time_end: string
  } | null
  executor_id: number | null
  price: number
}) {
  const instance = await axiosBase()
  try {
    return (await instance.post('/project/create', data)).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          createProject,
          data,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getUserProject() {
  const instance = await axiosBase()
  try {
    return (await instance.get('/project/active/user')).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getUserProject,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getNameExecutorProject(params: {
  for_executor: boolean
  project_id: number
}) {
  const instance = await axiosBase()
  try {
    return (await instance.get('/project/name/user', { params })).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getNameExecutorProject,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getExecutorProject() {
  const instance = await axiosBase()
  try {
    return (await instance.get('/project/active/executor')).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getExecutorProject,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getHistoryProject(params: {
  limit: number
  offset: number
}) {
  const instance = await axiosBase()
  try {
    return (
      await instance.get('/project/history/user', {
        params,
      })
    ).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getUserProject,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getHistoryProjectExecutor(params: {
  limit: number
  offset: number
}) {
  const instance = await axiosBase()
  try {
    return (await instance.get('/project/history/executor', { params })).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getHistoryProjectExecutor,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getNewLevel() {
  const instance = await axiosBase()
  try {
    return (await instance.get('/executor/recalculate/level')).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          getNewLevel,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function cancelProject(project_id: number) {
  const instance = await axiosBase()
  try {
    return (await instance.patch('/project/cancel', { project_id })).data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          window.Telegram.WebApp.initDataUnsafe.user?.id as number,
          cancelProject,
          project_id,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function userInfoForPage(
  user: ITelegramUser,
  currentPage?: 'executor' | 'user',
): Promise<PageState | null> {
  const user_info: UserData = await getUserInfo(user)
  if (!user_info) return null
  if (user_info.executor) {
    if (currentPage == 'user') {
      return { page: 'user', data: user_info }
    }
    const executerData: ExecuterData = await getExecutorInfo(user)
    return {
      page: 'executor',
      data: { user: user_info, executor: executerData },
    }
  } else {
    return { page: 'user', data: user_info }
  }
}

export async function changeOrdersAccept(user_id: number, value: boolean) {
  console.log(user_id, value)
  const instance = await axiosBase()
  try {
    await instance.patch('/executor/update/acceptOrders', { value: value })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, changeOrdersAccept, user_id)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function taskInfo(user_id: number) {
  const instance = await axiosBase()
  try {
    const result = await instance.get('/user/task/completed')
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, taskInfo, user_id)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getUserFree() {
  const instance = await axiosBase()
  const user_id = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const result = await instance.get('/user/free')
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, getUserFree)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getTaskInfo() {
  const instance = await axiosBase()
  const user_id = window.Telegram.WebApp.initDataUnsafe.user?.id as number
  try {
    const result = await instance.get('/user/task/completed')
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, taskInfo)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getStatisticsFinance() {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    const result = await instance.get('/executor/get/statistics/finance')
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, getStatisticsFinance)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getStatisticsOrders() {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    const result = await instance.get('/executor/get/statistics/orders')
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, getStatisticsOrders)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function createExecutor(
  skills: string[],
  firstname: string,
  categories: number[],
) {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    await instance.post('/executor/create', {
      skills: skills,
      name: firstname,
      categories: categories,
    })
    // if (firstname) {
    //   await instance.patch('/user/update/firstname', { firstname: firstname })
    // }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(
          user_id,
          createExecutor,
          skills,
          firstname,
          categories,
        )
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function createSchedule(schedule: ExecutorSchedule[]) {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    await instance.post('/executor/create/schedule', { schedule: schedule })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, createSchedule, schedule)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function updateSchedule(schedule: ExecutorSchedule[]) {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    await instance.patch('/executor/update/schedule', { schedule: schedule })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, updateSchedule, schedule)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function getLevels(): Promise<Level[] | false> {
  try {
    const result = await axios.get(`${baseURL}/executor/level/all`)
    return result.data
  } catch (error: any) {
    console.error(error.message)
    return false
  }
}

export async function getTop100(): Promise<Top[] | false> {
  try {
    const result = await axios.get(`${baseURL}/executor/top/100`)
    return result.data
  } catch (error: any) {
    console.error(error.message)
    return false
  }
}

export async function getCategories(): Promise<Categories[] | false> {
  try {
    const result = await axios.get(`${baseURL}/category/get/all`)
    return result.data
  } catch (error: any) {
    console.error(error.message)
    return false
  }
}

export async function subscribed() {
  const instance = await axiosBase()
  const user_id: number = window.Telegram.WebApp.initDataUnsafe.user
    ?.id as number
  try {
    const result = await instance.get('/user/subscribed')
    return result.data as boolean
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, subscribed)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}
export async function getShortcut(user_id: number): Promise<string | false> {
  try {
    const result = await axios.get(`${baseURL}/user/get/shortcut`, {
      params: { user_id: user_id },
    })
    return result.data.created_at as string
  } catch (error: any) {
    return false
  }
}

export async function addShortcut(user_id: number) {
  try {
    await axios.post(`${baseURL}/user/add/shortcut`, {
      user_id: user_id,
    })
  } catch (error: any) {
    return undefined
  }
}

export async function updateShortcutTime(user_id: number, created_at: string) {
  try {
    await axios.patch(`${baseURL}/user/update/shortcut/time`, {
      user_id: user_id,
      created_at: created_at,
    })
  } catch (error: any) {
    return undefined
  }
}

export async function updateShortcutClicks(user_id: number, click: number) {
  try {
    await axios.patch(`${baseURL}/user/update/shortcut/time`, {
      user_id: user_id,
      count_clicks: click,
    })
  } catch (error: any) {
    return undefined
  }
}

export async function taskInfoSimple(user_id: number) {
  try {
    const result = await axios.get(`${baseURL}/user/task/completed/simple`, {
      params: { user_id: user_id },
    })
    return result.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        return await HTTP401Exception(user_id, taskInfo, user_id)
      }
    } else if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function updateTask(
  user_id: number,
  task: 'invite' | 'shortcut' | 'subscription',
  value: boolean | number,
) {
  try {
    return await axios.patch(`${baseURL}/user/task/update`, {
      user_id: user_id,
      task: task,
      value: value,
    })
  } catch (error: any) {
    return false
  }
}
