'use client'
import {useTelegram} from "@/context/telegramContext";
import {useNav} from "@/context/navContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function MainPage() {
    const { user, webApp } = useTelegram();
    const { setActiveButton } = useNav();
    const router = useRouter()
    useEffect(() => {
        setActiveButton('/main')
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
            <h1>Main</h1>
        </div>
    )
}