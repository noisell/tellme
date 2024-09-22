'use client';
import {useTelegram} from "@/context/telegramContext";
import {useNav} from "@/context/navContext";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";

export default function ProfilePage() {
    const { user, webApp } = useTelegram();
    const { setActiveButton } = useNav();
    const router = useRouter()
    useEffect(() => {
        setActiveButton('/profile')
        const backButton = window.Telegram.WebApp.BackButton
        backButton.show()
        backButton.onClick(() => {
            router.back()
        })
        console.log('userID: ', user?.id)
        return () => {
            backButton.hide();
            backButton.offClick(() => {router.back()});
        };
    }, []);
    return (
        <div>
            <h1>Profile</h1>
        </div>
    )
}