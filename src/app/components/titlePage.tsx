'use client'
import React, {useRef, useState, useEffect} from 'react'
import {Carousel, ConfigProvider, Input, message, Tag, theme, Tree, TreeDataNode, TreeProps} from "antd";
import type { RadioChangeEvent, InputRef } from 'antd';
import {MenuUnfoldOutlined, OrderedListOutlined, UserOutlined} from '@ant-design/icons';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {createExecutor} from "@/app/API";
import {useRouter} from "next/navigation";
import {useNav} from "@/context/navContext";

const treeData: TreeDataNode[] = [
    {
        title: 'Программирование',
        key: 'Программирование',
        children: [
            {
                title: 'Web разработка',
                key: '0-0-0',
                children: [
                    { title: 'Web приложения', key: '0-0-0-0' },
                    { title: 'Сайты', key: '0-0-0-1' },
                    { title: 'Landing page', key: '0-0-0-2' },
                ],
            },
            {
                title: 'Десктоп разработка',
                key: '0-0-1',
                children: [
                    { title: 'Windows', key: '0-0-1-0' },
                    { title: 'Linux', key: '0-0-1-1' },
                    { title: 'Mac', key: '0-0-1-2' },
                ],
            },
            {
                title: 'Мобильная разработка',
                key: '0-0-2',
            },
        ],
    },
    {
        title: 'Строительство',
        key: '0-1',
        children: [
            { title: 'Фундаменты', key: '0-1-0-0' },
            { title: 'Кирпичная кладка', key: '0-1-0-1' },
            { title: 'Кровля', key: '0-1-0-2' },
        ],
    },
    {
        title: 'Хозяйство',
        key: '0-2',
    },
];

export function TitlePage () {
    const { setShowNavigation } = useNav();
    const ref = useRef(null);
    const [started, setStarted] = useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [executor, setExecutor] = useState<boolean>(false);
    const [firstname, setFirstname] = useState<string | undefined>(window.Telegram.WebApp.initDataUnsafe.user?.first_name);
    const [tags, setTags] = useState(['Photoshop', 'Программирую на Kotlin', 'Ремонтирую технику']);
    const [inputValue, setInputValue] = useState('');

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue as React.Key[]);
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstname(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputValue('');
    };

    const forMap = (tag: string) => (
        <span key={tag} style={{ display: 'flex'}}>
      <Tag
          closable
          onClose={(e) => {
              e.preventDefault();
              handleClose(tag);
          }}
            style={{
                width: 'auto',
                padding: '5px 15px',
                backgroundColor: 'var(--tg-second-section-color)',
                color: "var(--tg-theme-accent-text-color)",
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '10px'
      }}
      >
        {tag}
      </Tag>
    </span>
    );

    const [messageApi, contextHolder] = message.useMessage();

    const warning = (text: string) => {
        messageApi.open({
            type: 'warning',
            content: text,
        });
    };

    const tagChild = tags.map(forMap);
    const router = useRouter()
    const newExecutor = () => {
        if (tags.length === 0) {
            warning('Напишите хотя бы один навык!')
        }
        else if (!firstname) {
            warning('Введите имя пользователя!')
        }
        else {
            createExecutor(tags, firstname).then(() => {
                setShowNavigation(true);
                router.refresh()
            })

        }
    }

    return (
        <main className="w-full h-full bg-tg-secondary-background-color items-center start-page">
            {contextHolder}
            <ConfigProvider theme={{
                components: {
                    Carousel: {
                        colorBgContainer: "#ffffff",
                        dotOffset: 20,
                        dotWidth: 7,
                        dotHeight: 7,
                        dotActiveWidth: 7,
                        dotGap: 3
                    }
                }
            }}>
                <Carousel infinite={false} ref={ref}
                          className="relative w-ful bg-tg-background-color"
                          style={{display: "flex", height: "100vh", alignItems: "start", width: "100%"}}>
                    <div>
                        <div className="flex flex-col items-center">
                            <img src="/laptop.gif" alt="Изображение карточки" width={"70%"} className="mt-5"/>
                            <h1 className="text-tg-text-color text-xl font-bold mt-10">Добро пожаловать в
                                Tellme!</h1>
                            <p className="text-tg-subtitle-color mt-5 px-5 w-full text-center">
                                Забудьте о долгих поисках и бесконечных переговорах. С нашим приложением вы найдете
                                идеального специалиста для любой задачи всего за несколько секунд.
                            </p>
                            <button
                                className="p-3 w-3/4 mt-10 text-tg-button-text-color bg-tg-button-color font-bold rounded-2xl"
                                // @ts-ignore
                                onClick={() => ref.current?.next()}>Продолжить
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col items-center">
                            <img src="/diamond.gif" alt="Изображение карточки" width={"70%"} className="mt-5"/>
                            <h1 className="text-tg-text-color text-xl font-bold mt-10">Быстро! Надежно! Дешево!</h1>
                            <p className="text-tg-subtitle-color mt-5 px-5 w-full text-center">
                                Все исполнители проходят проверку на компетентность! Сервис не хранит ваши средства
                                у себя!
                                Минимальная сумма заказа от 300₽, а первый - бесплатно!
                            </p>
                            <button
                                className="p-3 w-3/4 mt-10 text-tg-button-text-color bg-tg-button-color font-bold rounded-2xl"
                                // @ts-ignore
                                onClick={() => ref.current?.next()}>Супер
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col items-center">
                            <img src="/money.gif" alt="Изображение карточки" width={"70%"} className="mt-5"/>
                            <h1 className="text-tg-text-color text-xl font-bold mt-10">Деньги сразу на карту!</h1>
                            <p className="text-tg-subtitle-color mt-5 px-5 w-full text-center">
                                С безопасной сделкой оплата за услуги происходит моментально.
                                Вам не нужно пополнять или выводить деньги с баланса. Мы сделали все для вашего
                                комфорта
                                и удобства.
                            </p>
                            <button
                                className="p-3 w-3/4 mt-10 text-tg-button-text-color bg-tg-button-color font-bold rounded-2xl"
                                onClick={() => setStarted(true)}>Начать
                            </button>
                            <button
                                className="p-3 w-3/4 mt-3 text-tg-button-text-color bg-tg-button-color font-bold rounded-2xl"
                                onClick={() => setOpenDrawer(true)}>Стать исполнителем
                            </button>
                        </div>
                    </div>
                </Carousel>
            </ConfigProvider>
            <SwipeableDrawer
                anchor="bottom"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}

            >
                <div
                    className="flex flex-col text-tg-text-color w-full h-auto items-center bg-tg-section-color rounded-t-3xl mt-3 py-4 px-6 font-medium ">
                    <span className="w-10 h-1 bg-tg-subtitle-color rounded-xl"></span>
                    <div className="flex flex-col items-center mt-5 w-full pb-5"
                         style={{borderBottom: "1px solid var(--tg-theme-section-separator-color)"}}>
                        <div className="flex w-full font-bold items-center justify-start gap-2 mb-2">
                            <UserOutlined/>
                            <span>Имя</span>
                        </div>
                        <ConfigProvider theme={{
                            components: {
                                Input: {
                                    activeShadow: "none",
                                    colorTextPlaceholder: "#9c9c9c"
                                }
                            }
                        }}>
                            <Input
                                type="name"
                                size="large"
                                style={
                                    {
                                        width: "100%",
                                        backgroundColor: "var(--tg-theme-bg-color)",
                                        borderColor: "var(--tg-theme-hint-color)",
                                        color: "var(--tg-theme-text-color)",
                                    }
                                }
                                placeholder="Ваше имя"
                                value={firstname}
                                onChange={handleFirstnameChange}
                            />
                        </ConfigProvider>
                    </div>
                    <div className="flex flex-col items-center w-full mt-5 pb-5"
                         style={{borderBottom: "1px solid var(--tg-theme-section-separator-color)"}}>
                        <div className="flex w-full font-medium items-center justify-start gap-2">
                            <MenuUnfoldOutlined/>
                            <span>Категории</span>
                        </div>
                        <p className="mr-auto text-xs text-tg-subtitle-color mt-2">
                            Выберите категории в которых вы разбираетесь и готовы выполнять в них заказы.
                        </p>
                        <div className="flex w-full items-center justify-start mt-3">
                            <Tree
                                checkable
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                onSelect={onSelect}
                                selectedKeys={selectedKeys}
                                treeData={treeData}
                                style={{
                                    backgroundColor: "var(--tg-theme-section-bg-color)",
                                    width: "100%",
                                    color: "var(--tg-theme-text-color)",
                                    fontSize: "16px",
                                    fontWeight: "normal",
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full mt-5 pb-5"
                         style={{borderBottom: "1px solid var(--tg-theme-section-separator-color)"}}>
                        <div className="flex w-full font-medium items-center justify-start gap-2">
                            <OrderedListOutlined/>
                            <span>Ваши навыки</span>
                        </div>
                        <p className="mr-auto text-xs text-tg-subtitle-color mt-2">
                            Напишите свои навыки по всем категориям. Их будут видеть только заказчики. В будущем вы
                            всегда
                            сможете изменить их в профиле
                        </p>
                        <div className="flex mt-3 mb-5 w-full items-center flex-wrap justify-start gap-y-2">
                            <ConfigProvider theme={{
                                components: {
                                    Tag: {
                                        colorTextDescription: "var(--tg-theme-accent-text-color)"
                                    }
                                }
                            }}>
                                {tagChild}
                            </ConfigProvider>
                        </div>
                        <ConfigProvider theme={{
                            components: {
                                Input: {
                                    activeShadow: "none",
                                    colorTextPlaceholder: "#9c9c9c"
                                }
                            }
                        }}>
                            <Input
                                type="text"
                                size="large"
                                style={
                                    {
                                        width: "100%",
                                        backgroundColor: "var(--tg-theme-bg-color)",
                                        borderColor: "var(--tg-theme-hint-color)",
                                        color: "var(--tg-theme-text-color)",
                                    }
                                }
                                placeholder="Введите навык..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputConfirm}
                                onPressEnter={handleInputConfirm}
                            />
                        </ConfigProvider>
                    </div>
                    <div className="flex flex-col items-center w-full mt-5 pb-5">
                        <button
                            className="w-full bg-tg-button-color p-3 text-tg-button-text-color rounded-2xl"
                            onClick={newExecutor}
                        >
                            Создать аккаунт
                        </button>
                    </div>
                </div>
            </SwipeableDrawer>
        </main>
    )
}