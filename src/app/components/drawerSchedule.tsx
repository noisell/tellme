import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export function DrawerSchedule (props: Props) {
    const {open, setOpen} = props;
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={ () => setOpen(false)}
            onOpen={() => setOpen(true)}

        >
            <div className="flex flex-col w-full items-center px-7 pt-3 pb-7 bg-tg-section-color text-tg-text-color rounded-t-3xl">
                <span className="w-10 h-1 bg-tg-subtitle-color rounded-xl"></span>
                <img src="/moon.gif" alt="My GIF" width={"60%"}/>
                <span className="flex flex-col text-left gap-y-2">
                    <p className="font-bold mb-2 " style={{fontSize: "14px"}}>От вашего графика работы зависит время, когда вы будете получать заказы:</p>
                    <p className="text-tg-subtitle-color" style={{fontSize: "14px"}}>• В выходные и нерабочее время заказы не будут поступать</p>
                    <p className="text-tg-subtitle-color" style={{fontSize: "14px"}}>• Положение переключателя "Принимаю заказы" будет переведено в неактивное после завершения рабочего дня или наступления выходного дня</p>
                    <p className="text-tg-subtitle-color" style={{fontSize: "14px"}}>• Когда переключатель "Принимаю заказы" в неактивном положении, вы можете включить его и заказы сразу начнут поступать, даже если по графику у вас выходной или нерабочее время.</p>
                </span>
            </div>

        </SwipeableDrawer>
    )
}