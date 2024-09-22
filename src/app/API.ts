import axios from "axios";
import {ITelegramUser, IWebApp} from "@/context/types";
import {ExecuterData, ExecutorSchedule, Level, PageState, Top, UserData, UserTasksCompleted} from "@/app/types";
import {OrdersAcceptSection} from "@/app/components/ordersAcceptSection";
import internal from "node:stream";

const baseURL = "https://api.two-market.ru";
export const axiosBase = async (cookie: boolean = false) => {
    return axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${await getCloudStorageItem('access_token', false)}`,
            "Content-Type": "application/json"
        },
        withCredentials: cookie
    })
}

export async function checkStartParam (startParam: string | undefined) {
    if (startParam) {
        console.log("startParam True");
        if (startParam.startsWith('referrer')) {
            console.log("startsWith True");
            const userId = startParam.replace('referrer', '');// Извлекаем значение после "referrer"
            if (/^\d+$/.test(userId)) {
                console.log("Number True");// Проверяем, является ли значение числом
                try {
                    const response = await axios.get(`${baseURL}/user/checkExist`,
                        {
                            headers: {'Content-Type': 'application/json'},
                            params: {user_id: Number(userId)},
                        })

                    if (response.status === 200) {
                        await axios.patch(`${baseURL}/user/task/update`, {
                            user_id: Number(userId),
                            task: "invite",
                            value: 1
                        })
                        return Number(userId);
                    }
                } catch (error) {
                    return null
                }
            }
        }
    }
    return null;
}

export async function createUser (user_id: number, name: string, username: string | null, startParam: string | undefined, time_zone: string) {
    const referrer_id = await checkStartParam(startParam)
    try {
        const response = await axios.post(`${baseURL}/user/create`,
            {
                id: user_id,
                name: name,
                username: username,
                referrer_id: referrer_id,
                time_zone: time_zone
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.status === 200;
    } catch (error) {
        return false;
    }
}

export async function getCloudStorageItem (key: string, checkToken: boolean = true) {
    return new Promise((resolve, reject) => {
        window.Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
            if (error) {
                reject(new Error('ItemAbsent'));
            } else {
                if (checkToken) {
                    const fetchData = async () => {
                        try {
                            const response = await axios.post(
                                `${baseURL}/auth/validateJWTToken`, {},
                                {headers: {Authorization: `Bearer ${value}`}});
                            return response.status;
                        } catch (error) {
                            reject(new Error('UnknownError'));
                        }
                    };

                    fetchData().then(data => {
                        if (data === 204) {
                            resolve(value);
                        }
                        else {
                            reject(new Error('InvalidToken'));
                        }
                    }).catch(error => {
                        reject(new Error('UnknownError'));
                    })
                }
                else resolve(value)
            }
        });
    });
}

export async function login (user_id: number, username: string | null, initData: string) {
    const instance = await axiosBase(true)
    try {
        const response = await instance.post(`${baseURL}/auth/login`,
            {
                user_id: user_id,
                username: username,
                init_data: initData
            }
        );

        if (response.status === 200) {
            console.log('Access', `${response.headers['authorization']}`)
            return response.headers['authorization'].split(' ')[1]
        }
    } catch (error) {
        console.log('ErrorInLogin:', error);
        return false
    }
}

export async function refreshToken (user_id: number) {
    const instance = await axiosBase(true)
    try {
        const response = await instance.post(`${baseURL}/auth/refresh`, {user_id: user_id});
        if (response.status === 200) {
            console.log('Access Token перевыпущен')
            return response.headers['authorization'].split(' ')[1]
        }
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            return false
        } else if (error instanceof Error) {
            console.error(error.message);
            return false
        }
    }
}

export async function getAccessToken (user_id: number) {
    try {
        return await getCloudStorageItem('access_token')
    }
    catch (error: any) {
        if (error.message === 'InvalidToken') {
            try {
                return await refreshToken(user_id);
            }
            catch (error) {}
        }
    }
    return false
}

export async function setCloudStorageItem (key: string, token: string) {
    window.Telegram.WebApp.CloudStorage.setItem(key, token);
}

export async function authorization (user: ITelegramUser, webApp: IWebApp, startParam: string | undefined, time_zone: string) {
    let access_token = await getAccessToken(user.id)
    let new_user: boolean = false
    if (!access_token) {
        let new_access_token = await login(user.id, user.username, webApp.initData);
        if (!new_access_token) {
            new_user = true
            await createUser(user.id, user.first_name, user.username, startParam, time_zone);
            new_access_token = await login(user.id, user.username, webApp.initData);
        }
        await setCloudStorageItem('access_token', new_access_token);
    }
    return new_user
}

export async function HTTP401Exception(user_id: number, func: (...args: any[]) => unknown, ...args: any[]) {
    const newAccessToken = await refreshToken(user_id);
    if (!newAccessToken) {
        return window.Telegram.WebApp.showPopup(
            {
                title: "Время сессии истекло",
                message: "Пожалуйста закройте или перезапустите приложение.",
                buttons: [{id: "closeWebApp", type: "close", text: "Закрыть"}]
            }
        )
    }
    else {
        await setCloudStorageItem('access_token', newAccessToken)
        return func(...args)
    }
}

export async function getExecutorInfo (user: ITelegramUser) {
    const instance = await axiosBase()
    try {
        const response = await instance.get('/executor/getById');
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            switch (error.status) {
                case 401:
                    return await HTTP401Exception(user.id, getExecutorInfo, user)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function getUserInfo (user: ITelegramUser) {
    const instance = await axiosBase()
    try {
        const response = await instance.get('/user/getUsefulData');
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user.id, getUserInfo, user)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function userInfoForPage (user: ITelegramUser): Promise<PageState | null>  {
    const user_info: UserData = await getUserInfo(user)
    if (!user_info) return null;
    if (user_info.executor) {
        const executerData: ExecuterData = await getExecutorInfo(user)
        return {"page": "executor", "data": {user: user_info, executor: executerData}}
    }
    else {
        return {"page": "user", "data": user_info}
    }
}

export async function changeOrdersAccept (user_id: number, value: boolean)  {
    console.log(user_id, value)
    const instance = await axiosBase()
    try {
        await instance.patch('/executor/update/acceptOrders', {value: value})
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user_id, changeOrdersAccept, user_id)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function taskInfo (user_id: number) {
    const instance = await axiosBase()
    try {
        const result = await instance.get('/user/task/completed')
        return result.data
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user_id, taskInfo, user_id)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function createExecutor (skills: string[], firstname: string | undefined) {
    const instance = await axiosBase()
    const user_id: number = window.Telegram.WebApp.initDataUnsafe.user?.id as number
    try {
        await instance.post('/executor/create', {skills: skills})
        if (firstname) {
            await instance.patch('/user/update/firstname', {firstname: firstname})
        }
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user_id, createExecutor, skills, firstname)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}


export async function createSchedule (schedule: ExecutorSchedule[]) {
    const instance = await axiosBase()
    const user_id: number = window.Telegram.WebApp.initDataUnsafe.user?.id as number
    try {
        await instance.post('/executor/create/schedule', {schedule: schedule})
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user_id, createSchedule, schedule)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function updateSchedule (schedule: ExecutorSchedule[]) {
    const instance = await axiosBase()
    const user_id: number = window.Telegram.WebApp.initDataUnsafe.user?.id as number
    try {
        await instance.patch('/executor/update/schedule', {schedule: schedule})
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.status === 401) {
                return await HTTP401Exception(user_id, updateSchedule, schedule)
            }
        } else if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

export async function getLevels (): Promise<Level[] | false> {
    try {
        const result = await axios.get(`${baseURL}/executor/level/all`)
        return result.data
    }
    catch (error: any) {
        console.error(error.message);
        return false;
    }
}

export async function getTop100 (): Promise<Top[] | false> {
    try {
        const result = await axios.get(`${baseURL}/executor/top/100`)
        return result.data
    }
    catch (error: any) {
        console.error(error.message);
        return false;
    }
}