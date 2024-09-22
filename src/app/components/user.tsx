import {HeaderSectionUser} from "@/app/components/headerSectionUser";

export default function User() {
    return (
        <main className="flex w-full flex-col bg-tg-secondary-background-color items-center">
            <HeaderSectionUser first_name={window.Telegram.WebApp.initDataUnsafe.user?.first_name as string} />

        </main>
)
}