'use client'
import {useRouter, useSearchParams} from "next/navigation";
import {useNav} from "@/context/navContext";
import React, {useEffect, useRef, useState} from "react";
import {Carousel, ConfigProvider, Progress, Badge} from "antd";
import {Level, Top} from "@/app/types";
import {getLevels, getTop100} from "@/app/API";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import Image from 'next/image'

interface Props {
    level_id: number,
    levelName: string,
    countOrdersStart: number,
    countCompletedOrders: number,
    needCountCompletedOrders: number,
}

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const ref = useRef(null);
    const { setShowNavigation } = useNav();
    const [levelsData, setLevelsData] = useState<Level[] | null>(null);
    const [style, setStyle] = useState<string>("glareYellow");
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('id')));
    const [top, setTop] = useState<Top[] | null>(null)
    useEffect(() => {
        setShowNavigation(false);
        const backButton = window.Telegram.WebApp.BackButton
        backButton.show()
        backButton.onClick(() => {
            router.back()
        })
        getLevels().then(r => {
            if (r) setLevelsData(r)
        })
        getTop100().then(r => {
            if (r) setTop(r)
        })
        return () => {
            setShowNavigation(true);
            backButton.hide();
            backButton.offClick(() => {router.back()});
        };
    }, []);
    useEffect(() => {
        // @ts-ignore
        ref.current?.goTo(Number(searchParams.get('id')) - 1, true)
    }, [ref.current]);
    useEffect(() => {
        // @ts-ignore
        if (currentPage === 1) setStyle("glareYellow");
        else if (currentPage === 2) return setStyle("glareBlue");
        else if (currentPage === 3) return setStyle("glareGreen");
        else setStyle("glarePurple");
    }, [currentPage]);
    const getLevelById = (id: number): Level | undefined => {
        return levelsData?.find(level => level.id === id);
    }
    const percent = Number(searchParams.get('completed')) / Number(searchParams.get('need')) * 100
    // @ts-ignore
    // @ts-ignore
    const colors = {
        1: "text-yellow-500",
        2: "text-blue-500",
        3: "text-green-500",
        4: "text-purple-500",
    }
    // @ts-ignore
    return (
        <main className="w-full min-h-screen bg-tg-section-color items-center start-page">
            <span className={style}></span>
            <ConfigProvider theme={{
                components: {
                    Carousel: {
                        colorBgContainer: "#ffffff",
                        arrowSize: 25,
                        arrowOffset: 40
                    }
                }
            }}>
                <Carousel infinite={false} ref={ref} arrows={false} dots={false}
                          className="relative w-ful " effect="fade"
                          style={{
                              display: "flex",
                              height: "auto",
                              alignItems: "start",
                              width: "100%",
                              backgroundColor: ""
                          }}
                >
                    {[1, 2, 3, 4].map((number) => (
                        <div key={number}>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center w-full min-h-48 h-auto mb-10">
                                    <div className="flex min-h-48 h-auto items-center justify-center w-1/4"
                                         onClick={() => {
                                             if (currentPage > 1) {
                                                 // @ts-ignore
                                                 ref.current?.prev()
                                                 setCurrentPage(currentPage - 1)
                                             }
                                         }}
                                    >
                                        <LeftOutlined
                                            style={{
                                                color: `${currentPage > 1 ? 'var(--tg-theme-text-color)' : 'var(--tg-theme-subtitle-text-color)'}`,
                                                fontSize: "24px"
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center w-2/4 h-full justify-center">
                                        <Image
                                            src={`/${currentPage}.gif`}
                                            width={192}
                                            height={192}
                                            alt="Gif Image..."
                                        />
                                    </div>
                                    <div className="flex min-h-48 h-auto items-center justify-center w-1/4"
                                        // @ts-ignore
                                         onClick={() => {
                                             if (currentPage < 4) {
                                                 // @ts-ignore
                                                 ref.current?.prev()
                                                 setCurrentPage(currentPage + 1)
                                             }
                                         }}
                                    >
                                        <RightOutlined
                                            style={{
                                                color: `${currentPage < 4 ? 'var(--tg-theme-text-color)' : 'var(--tg-theme-subtitle-text-color)'}`,
                                                fontSize: "24px"
                                            }}
                                        />
                                    </div>
                                </div>
                                {Number(searchParams.get('id')) === currentPage ? (
                                    <>
                                        <h1 className="text-tg-text-color text-2xl font-bold">
                                            {searchParams.get('name')}
                                        </h1>
                                        <p className="text-tg-subtitle-color px-5 w-full text-center text-lg">
                                        {searchParams.get('completed')} / {searchParams.get('need')}
                                        </p>
                                        <span className="text-tg-button-text-color font-bold bg-yellow-500 rounded-2xl py-2 px-10 mt-2">От 300₽</span>

                                    </>
                                ) : (
                                    <>
                                        {levelsData ? (
                                            <>
                                                <h1 className="text-tg-text-color text-2xl font-bold">
                                                    {getLevelById(currentPage)?.name}
                                                </h1>
                                                <p className="text-tg-subtitle-color px-5 w-full text-center text-lg">
                                                    Более {getLevelById(currentPage)?.count_orders_start} советов
                                                </p>
                                                {currentPage === 2 ? <span
                                                    className="text-tg-button-text-color font-bold bg-blue-600 rounded-2xl py-2 px-10 mt-2">
                                                    От 500₽
                                                </span> : currentPage == 3 ? <span
                                                    className="text-tg-button-text-color font-bold bg-green-600 rounded-2xl py-2 px-10 mt-2">
                                                    От 700₽
                                                </span> : <span
                                                    className="text-tg-button-text-color font-bold bg-purple-600 rounded-2xl py-2 px-10 mt-2">
                                                    От 1000₽
                                                </span>}

                                            </>
                                        ) : (
                                            <>
                                                <h1 className="text-tg-text-color text-2xl font-bold mt-10">
                                                    Загрузка
                                                </h1>
                                                <p className="text-tg-subtitle-color px-5 w-full text-center">
                                                    Загрузка
                                                </p>
                                            </>
                                        )
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </ConfigProvider>
            <div className={`flex items-center w-full mt-3 px-10`}>
                <Progress
                    percent={percent !== 0 ? percent : 1}
                    size={["100%", 20]}
                    showInfo={false}
                    trailColor="var(--tg-second-section-color)"
                    strokeColor="var(--tg-theme-accent-text-color)"
                    className={`${Number(searchParams.get('id')) == currentPage ? 'z-10' : '-z-10'}`}
                />
            </div>
            <div className="flex flex-col items-center w-full mt-3 px-5 gap-2 pb-10 z-10">
                {
                    top ? top.map((item) => (
                        <div key={item.rate}
                             className="flex z-10 items-center w-full justify-between bg-tg-section-second-color rounded-xl py-2 px-4"
                        >
                            <div className="flex items-center w-auto h-auto">
                                <span
                                    // @ts-ignore
                                    className={`flex w-9 h-9 rounded-3xl bg-tg-section-color items-center justify-center ${colors[item.level_id]}`}>
                                    {item.user_name[0].toUpperCase()}
                                </span>
                                <div className="flex flex-col items-start ml-2">
                                    <span>{item.user_name[0].toUpperCase() + item.user_name.substring(1)}</span>
                                    <span className="text-xs text-tg-subtitle-color">Заказов: {item.count}</span>
                                </div>
                            </div>
                            <span className="text-tg-text-color text-lg">{item.rate}</span>
                        </div>
                    ))
                    : <div>Загрузка</div>
                }
            </div>
        </main>
    )
}