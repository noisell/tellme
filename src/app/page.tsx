'use client'
import React, { useEffect, useState } from "react";
import { useTelegram } from "@/context/telegramContext"
import {useNav} from "@/context/navContext";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {HeaderSection} from "@/app/components/headerSection";
import {ExecutorResponseData, PageState} from '@/app/types'
import {authorization, userInfoForPage} from "@/app/API";
import {OrdersAcceptSection} from "@/app/components/ordersAcceptSection";
import {IWebApp} from "@/context/types";
import {ScheduleSection} from "@/app/components/scheduleSection";
import {TasksProgress} from "@/app/components/progress";
import {TitlePage} from "@/app/components/titlePage";
import {CaretRightOutlined, LoadingOutlined, SolutionOutlined} from "@ant-design/icons";
import {ConfigProvider, Spin} from "antd";
import User from "@/app/components/user";

export default function Home() {
    const { user, webApp } = useTelegram();
    const { setActiveButton, setShowNavigation } = useNav();
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [auth, setAuth] = useState<"newUser" | "user" | null>(null);
    const [page, setPage] = useState<PageState | null>(null);

    useEffect(() => {
        if (webApp && user) {
            console.log('WEBAPP', webApp)
            const handleThemeChange = () => {
                document.documentElement.style.setProperty('--tg-second-section-color', webApp.colorScheme === 'light' ? '#F0F0F0' : '#222222');
                document.documentElement.style.setProperty('--tg-theme-section-bg-color', webApp.colorScheme === 'light' ? '#FFFFFF' : '#181818');
                document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', webApp.colorScheme === 'light' ? '#F0F0F0' : '#000000');
            };
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    window.Telegram.WebApp.close()
                }
            }

            setActiveButton('/')
            handleThemeChange();
            window.Telegram.WebApp.onEvent('themeChanged', handleThemeChange);
            window.Telegram.WebApp.onEvent('popupClosed', popupClosed);
            return () => {
                window.Telegram.WebApp.offEvent('themeChanged', handleThemeChange)
                window.Telegram.WebApp.offEvent('popupClosed', popupClosed)
            };
        }
    }, [webApp, user]);

    useEffect(() => {
        if (webApp && user) {
            const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (params.has('inline') || params.has('url')) {
                console.log('this authorization');
            const start_param = window.Telegram.WebApp.initDataUnsafe.start_param
            console.log('start_param: ', start_param);
            const start = async () => {
                const new_user = await authorization(user, webApp, start_param, time_zone)
                if (new_user) setAuth("newUser")
                else setAuth("user")
            }
            start();
            router.replace(pathname)
            }
            else {
                setAuth("user")
                console.log('ignore authorization');
            }
        }
        return () => {};

    }, [webApp, user]);

    useEffect(() => {
        if (webApp && user && auth) {
            const start = async () => {
                if (auth === "user") {
                    const result = await userInfoForPage(user)
                    if (!result) return
                    setPage(result)
                }
                else {
                    setPage({page: "newUser", data: null})
                }
            }
            start()
        }
    }, [webApp, user, auth]);

    function executorPage(pageData: ExecutorResponseData) {
        setShowNavigation(true);
        const user = pageData.user;
        const executor = pageData.executor;
        return (
            <main className="flex w-full flex-col bg-tg-secondary-background-color items-center">
                <HeaderSection
                    levelID={executor.level.id}
                    first_name={user.name}
                    levelName={executor.level.name}
                    countOrdersStart={executor.level.count_orders_start}
                    countCompletedOrders={executor.count_completed_projects - executor.level.count_orders_start}
                    needCountCompletedOrders={executor.level.count_orders_completed - executor.level.count_orders_start}
                    incomeToday={executor.amount}
                />
                <OrdersAcceptSection webApp={webApp as IWebApp} acceptOrders={executor.accept_orders}/>
                {executor.level.id === 1 ? <TasksProgress user_id={executor.user_id}/> : null}
                <ScheduleSection schedule={executor.executor_schedule} timezoneOffset={user.time_zone}
                                 weekday={executor.weekday}/>
                <div
                    className="flex w-full h-auto items-center justify-between bg-tg-section-color rounded-3xl mt-3 py-4 px-6 font-medium ">
                    <div className="flex w-full items-center gap-2">
                        <SolutionOutlined/>
                        <span>История заказов</span>
                    </div>
                    <CaretRightOutlined/>
                </div>
            </main>
        )
    }

    return (
        page ? (
            page.page === 'executor' ? (
                    executorPage(page.data as ExecutorResponseData)
                )
                : page.page === 'newUser' ? (
                        <TitlePage/>
                    )
                    : <User/>
        ) : (
            <div className="flex flex-col w-screen h-screen bg-tg-background-color items-center">
                <ConfigProvider theme={{
                    components: {
                        Spin: {
                            colorPrimary: "var(--tg-theme-accent-text-color)"
                        }
                    }
                }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48, marginTop: "35vh"}} spin />} />
                </ConfigProvider>
                <h1 className="nameCompany loading-text text-4xl font-bold mt-5">Tellme</h1>
            </div>
        )
    );
}
