'use client'
import React, { useEffect, useState} from "react";
import { UserOutlined, ThunderboltOutlined, SettingOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EditOutlined, SolutionOutlined, CaretRightOutlined} from "@ant-design/icons"
import { Switch, Progress, ConfigProvider, Card, Col, Row, } from 'antd';
import { TasksProgress } from "@/app/components/progress"
import {DrawerSchedule} from "@/app/components/drawerSchedule";
import {ITelegramUser, IWebApp} from "@/context/types";

type Props = {
    user: ITelegramUser | undefined,
    webApp: IWebApp | undefined,
}

export function HomePage(props: Props) {
    const { user, webApp} = props;

    const data = [
        {name: '01.09', 'Заработанно': 0},
        {name: '02.09', 'Заработанно': 100},
        {name: '03.09', 'Заработанно': 300},
        {name: '04.09', 'Заработанно': 200},
    ];

    return (
        <main className={"flex w-full flex-col bg-tg-secondary-background-color items-center"}>
        </main>
    );
}
