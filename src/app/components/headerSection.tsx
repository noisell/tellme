import {SettingOutlined, UserOutlined} from "@ant-design/icons";
import {Progress} from "antd";
import React from "react";
import {useRouter} from "next/navigation";

interface Props {
    levelID: number,
    first_name: string,
    levelName: string,
    countOrdersStart: number,
    countCompletedOrders: number,
    needCountCompletedOrders: number,
    incomeToday: number,
}


export function HeaderSection(props: Props) {
    const router = useRouter()
    return (
        <div className="flex flex-col w-full h-auto items-center bg-tg-section-color from-cyan-950 to-cyan-800 rounded-b-3xl p-4">
            <div className="flex w-full mt-2 justify-between items-center">
                <div className="flex gap-2 items-center rounded-xl py-2 px-3 bg-tg-section-second-color"
                >
                    <div className="flex"><UserOutlined
                        style={{fontSize: '23px', color: "var(--tg-theme-accent-text-color)"}}/></div>
                    <div className="flex flex-col" style={{fontSize: "12px", lineHeight: "14px"}}>
                        <p className='text-nowrap'>{props.first_name.length > 12 ? props.first_name.slice(0, 12) : props.first_name}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center text-xs w-full px-5"
                     onClick={() => {
                         router.push(
                             `/level?id=${props.levelID}
                             &name=${props.levelName}
                             &start=${props.countOrdersStart}
                             &completed=${props.countCompletedOrders}
                             &need=${props.needCountCompletedOrders}`
                         )
                     }
                }
                >
                    <div className="flex w-full items-center justify-between">
                        <span>{`${props.levelName} >`}</span>
                        <span>{props.countCompletedOrders}<span className="text-tg-subtitle-color">/{props.needCountCompletedOrders}</span></span>
                    </div>
                    <Progress
                        percent={props.countCompletedOrders / props.needCountCompletedOrders * 100}
                        size={["100%", 10]}
                        showInfo={false}
                        trailColor="var(--tg-second-section-color)"
                        strokeColor="var(--tg-theme-accent-text-color)"

                    />
                </div>
                <div className="flex gap-2 font-medium text-tg-text-color">
                    <SettingOutlined style={{fontSize: '23px'}}/>
                </div>
            </div>
            <div className="flex flex-col mt-6 items-center">
                <span className="text-tg-subtitle-color">Сегодня</span>
                <span className="mt-2 text-4xl font-medium">{props.incomeToday} <span
                    className="text-tg-subtitle-color">₽</span></span>
            </div>
        </div>
    )
}