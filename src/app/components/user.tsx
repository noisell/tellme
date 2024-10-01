import React, {useEffect, useState} from "react";
import {ConfigProvider, TreeSelect, TreeSelectProps, DatePicker, Switch, Select, message} from 'antd';
import {
    ArrowRightOutlined,
    CaretRightOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    FieldTimeOutlined,
    ShoppingOutlined,
    SolutionOutlined,
    UserOutlined
} from "@ant-design/icons";
import {TasksProgress} from "@/app/components/progress";
import Link from "next/link";
import { Input } from 'antd';
import TelegramIcon from '@mui/icons-material/Telegram';
import {Categories, Level, Price, TreeCategories} from "@/app/types"
import {getCategories, getLevels} from "@/app/API";
import {languageFontMap} from "next/dist/compiled/@vercel/og/language";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const levelFind: Record<number, keyof Price> = {1: "price_one", 2: "price_two", 3: "price_three", 4: "price_four"}
const colorFind: Record<number, string> = {1: "rgb(234 179 8)", 2: "rgb(59 130 246)", 3: "rgb(34 197 94)", 4: "rgb(168 85 247)"}
const times = [{value: 1, label: '30 мин'}, {value: 2, label: '1 час'}, {value: 3, label: '1.5 часа'}, {value: 4, label: '2 часа'}]

function transformCategories(categories: Categories[]): TreeCategories[] {
    return categories.map((category) => ({
        value: category.id,
        title: category.name,
        children: category.children.length >= 1 ? transformCategories(category.children) : [],
    }));
}

const findCategoryById = (categories: Categories[], id: number): Categories | undefined => {
    for (const category of categories) {
        if (category.id === id) {
            return category;
        }
        if (category.children.length > 0) {
            const foundCategory = findCategoryById(category.children, id);
            if (foundCategory) {
                return foundCategory;
            }
        }
    }
    return undefined;
};

interface TimeOption {
  label: any;
  value: number;
  key: number;
  disabled?: boolean;
  title?: string;
}

export default function User() {
    const [categories, setCategories] = useState<Categories[] | undefined>(undefined);
    const [value, setValue] = useState<number | undefined>(undefined);
    const [time, setTime] = useState<number>(1)
    const [price, setPrice] = useState<number>(300)
    const [level, setLevel] = useState<number>(1)
    const [fast, setFast] = useState<boolean>(true)
    const [currentCategory, setCurrentCategory] = useState<Categories | null>(null)
    const [tree, setTree] = useState<TreeCategories[] | undefined>(undefined)
    const [levelInfo, setLevelInfo] = useState<Level[] | undefined>(undefined)
    const [messageApi, contextHolder] = message.useMessage();
    const [levelsData, setLevelsData] = useState([
        {value: 1, label: <p className="text-[15px]" style={{color: `${colorFind[1]}`}}>Новичок</p>},
        {value: 2, label: <p className="text-[15px]" style={{color: `${colorFind[2]}`}}>Специалист</p>},
        {value: 3, label: <p className="text-[15px]" style={{color: `${colorFind[3]}`}}>Профессионал</p>},
        {value: 4, label: <p className="text-[15px]" style={{color: `${colorFind[4]}`}}>Гуру</p>},
    ])

    const error = (text: string) => {
        messageApi.open({
            type: 'error',
            content: text
        }).then(() => {return});
    }
    const success = (text: string) => {
        messageApi.open({
            type: 'success',
            content: text
        }).then(() => {return});
    }

    const onChange = (newValue: number | undefined) => {
        setValue(newValue);
        if (newValue === undefined) return;
        const category = findCategoryById(categories as Categories[], newValue) as Categories;
        setPrice(category.price[levelFind[level]] * time);
        setCurrentCategory(category);
    };
    const onChangeLevel = (option: TimeOption) => {
        const {value} = option
        if (!currentCategory) {
            error("Сначала выберите категорию!")
            return
        }
        setLevel(value)
        const currentLevel = levelInfo?.find((lvl) => lvl.id === value)
        success(`${currentLevel?.name}: от ${currentLevel?.count_orders_start} советов | ${currentCategory.price[levelFind[value]]}₽/30 мин`)
        setPrice(currentCategory.price[levelFind[value]] * time)
    }
    const onChangeTime = (option: TimeOption) => {
        const {value} = option
        if (!currentCategory) {
            error("Сначала выберите категорию!")
            return
        }
        setTime(value)
        setPrice(currentCategory.price[levelFind[level]] * value)
    }
    const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
        console.log('onPopupScroll', e);
    };
    useEffect(() => {
        getCategories().then(r => {if (r) {
            setCategories(r)
            setTree(transformCategories(r))
        }})
    }, []);
    useEffect(() => {
        getLevels().then(r => {if (r) {
            setLevelsData(
                r.map((item) => ({
                        value: item.id, label: <p className="text-[15px]" style={{color: `${colorFind[item.id]}`}}>{item.name}</p>,
                    })
                )
            )
            setLevelInfo(r)
        }})
    }, []);
    return (
        <main className="flex w-full flex-col bg-tg-secondary-background-color items-center">
            <ConfigProvider theme={{
                components: {
                    TreeSelect: {
                        colorBgElevated: "var(--tg-theme-section-bg-color)",
                        colorText: "var(--tg-theme-text-color)",
                        colorPrimaryBorder: "none",
                        nodeSelectedBg: "var(--tg-second-section-color)",
                        colorPrimaryHover: "var(--tg-theme-accent-text-color)",
                        colorPrimary: "var(--tg-theme-accent-text-color)",
                    },
                    Empty: {
                        colorTextDescription: "var(--tg-theme-text-color)",
                    },
                    Dropdown: {
                        colorBgElevated: "var(--tg-second-section-color)"
                    },
                    Input: {
                        colorBgContainer: "var(--tg-second-section-color)",
                        colorBorder: "transparent",
                        colorText: "var(--tg-theme-text-color)",
                        colorTextPlaceholder: "var(--tg-theme-subtitle-text-color)",
                        borderRadiusLG: 12,
                        activeBorderColor: "transparent",
                        activeShadow: "transparent",
                        hoverBorderColor: "transparent"
                    },
                    Select: {
                        colorBgContainer: "var(--tg-second-section-color)",
                        colorBorder: "transparent",
                        colorText: "var(--tg-theme-text-color)",
                        colorTextPlaceholder: "var(--tg-theme-subtitle-text-color)",
                        borderRadiusLG: 12,
                        colorPrimary: "transparent",
                        colorBgElevated: "var(--tg-second-section-color)",
                        optionSelectedBg: "var(--tg-theme-section-bg-color)",
                        controlOutlineWidth: 0,
                        colorPrimaryHover: "transparent",
                    },
                    Message: {
                        contentBg: 'var(--tg-second-section-color)',
                        colorText: 'var(--tg-theme-text-color)'
                    }
                }
            }}>
                {contextHolder}
                <div
                    className={`flex w-full items-center bg-tg-button-color rounded-b-3xl py-3 px-5 font-bold justify-between ${window.Telegram.WebApp.colorScheme === 'light' && 'shadow-md shadow-gray-400'}`}>
                    <p className="text-tg-button-text-color text-2xl" >Tellme</p>
                    <Link href="https://t.me/Tellme_tips" className="ml-auto"><TelegramIcon sx={{fontSize: "32px", color: "var(--tg-theme-button-text-color)"}}/></Link>
                    <UserOutlined style={{fontSize: '24px', color: "var(--tg-theme-button-text-color)", marginLeft: "10px"}}/>
                </div>
                <div className={`flex flex-col w-full h-auto mt-3 items-center bg-tg-section-color rounded-3xl py-4 px-4 ${window.Telegram.WebApp.colorScheme === 'light' && 'shadow-md shadow-gray-400'}`}>
                    <div className="w-full flex flex-col">
                        <div className="flex w-full items-center justify-between mt-1 font-medium mb-3 px-1">
                            <div className="flex w-full items-center gap-2">
                                <ShoppingOutlined/>
                                <span>Получить совет</span>
                            </div>
                            <ExclamationCircleOutlined
                                style={{fontSize: "18px", color: "var(--tg-theme-subtitle-text-color)", cursor: "pointer"}}
                            />
                        </div>
                        <ConfigProvider theme={{
                            token: {
                                colorBgContainer: "var(--tg-second-section-color)",
                                colorBorder: "transparent",
                                colorText: "var(--tg-theme-text-color)",
                                colorTextPlaceholder: "var(--tg-theme-subtitle-text-color)",
                                borderRadiusLG: 12,
                                colorPrimary: "var(--tg-theme-accent-text-color)",
                                lineWidth: 0,
                            }
                        }}>
                            {tree ? <TreeSelect
                                variant="outlined"
                                style={{
                                    width: '100%',
                                    background: "none",
                                    color: "var(--tg-theme-text-color)",
                                    height: "45px",
                                    borderRadius: "20px"
                                }}
                                value={value}
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                    background: "var(--tg-theme-section-bg-color)",
                                    color: "#FFF"
                                }}
                                listHeight={400}
                                placeholder="Выберите категорию"
                                allowClear={{
                                    clearIcon: <CloseOutlined style={{
                                        fontSize: "15px",
                                        color: "var(--tg-theme-accent-text-color)",
                                        background: "var(--tg-second-section-color)",
                                        marginLeft: "-3px",
                                        marginTop: "-1px"
                                    }}/>
                                }}
                                onChange={onChange}
                                treeData={tree}
                                onPopupScroll={onPopupScroll}
                                size="large"
                                suffixIcon={<DownOutlined
                                    style={{fontSize: "15px", color: "var(--tg-theme-accent-text-color)"}}/>}
                            /> : <h1>Загрузка</h1>}
                        </ConfigProvider>
                        <div className="flex w-full mt-3 items-center justify-between gap-2">
                            <Select
                                labelInValue
                                // @ts-ignore
                                value={level}
                                onChange={onChangeLevel}
                                options={levelsData}
                                size="large"
                                suffixIcon={<DownOutlined style={{fontSize: "15px", color: `${colorFind[level]}`}}/>}

                                className="flex w-full min-h-[45px] items-center text-[15px] text-yellow-500 bg-tg-section-second-color rounded-xl p-2.5 gap-2 justify-between"
                            />
                            <Select
                                labelInValue
                                // @ts-ignore
                                value={time}
                                options={times}
                                onChange={onChangeTime}
                                size="large"
                                suffixIcon={<DownOutlined style={{fontSize: "15px", color: "var(--tg-theme-accent-text-color)"}}/>}
                                className="flex min-w-[105px] w-auto min-h-[45px] items-center text-[15px] text-nowrap text-tg-accent-color bg-tg-section-second-color rounded-xl py-2.5 px-3 gap-2 justify-center"
                            />
                        </div>

                        <div className="mt-3">
                            <TextArea autoSize={{minRows: 4, maxRows: 10}} size="large" placeholder="Напишите свой вопрос"/>
                        </div>
                        <div className="flex w-full min-h-[45px] items-center mt-3 justify-between bg-tg-section-second-color rounded-xl p-2.5">
                            <div className={`flex gap-2 items-center text-[15px] ${fast ? 'text-tg-accent-color' : 'text-tg-subtitle-color'}`}>
                                <ClockCircleOutlined />
                                <p>Как можно скорее</p>
                            </div>
                            <ConfigProvider theme={{components: {Switch: {colorPrimary: "var(--tg-theme-accent-text-color)"}}}}>
                                <Switch value={fast} onChange={() => setFast(!fast)}/>
                            </ConfigProvider>
                        </div>
                        {!fast &&
                            <div
                                className="flex flex-col w-full min-h-[45px] items-center mt-3 bg-tg-section-second-color rounded-xl p-2.5">
                                <div className="flex w-full gap-2 items-center text-[15px]">
                                    <FieldTimeOutlined/>
                                    <p>Выберите временной промежуток</p>
                                </div>
                                <div className="flex relative w-full mt-3 items-center justify-between gap-2">
                                    <DatePicker
                                        placeholder="Выберите дату"
                                        picker={'date'}
                                        size="middle"
                                        format={"DD.MM.YYYY"}
                                        inputReadOnly={true}
                                        style={{borderRadius: "10px"}}
                                        popupStyle={{}}
                                        placement="bottomRight"

                                    />
                                </div>
                            </div>
                        }
                        <button
                            className="flex w-full mt-3 items-center h-auto bg-tg-button-color rounded-2xl p-3 text-tg-button-text-color justify-center font-bold">
                            Начать поиск · {price}₽
                        </button>
                        <p className="text-[10px] mt-1 w-full text-center text-tg-subtitle-color px-2">
                            Создавая заказ вы принимаете нашу <Link href="http://localhost:8080">публичную оферту</Link>
                        </p>
                    </div>
                </div>
                <TasksProgress user_id={window.Telegram.WebApp.initDataUnsafe.user?.id as number} isClient={true}/>
                <div
                    className={`flex w-full h-auto items-center justify-between bg-tg-section-color rounded-3xl mt-3 py-4 px-6 font-medium ${window.Telegram.WebApp.colorScheme === 'light' && 'shadow-md shadow-gray-400'}`}>
                    <div className="flex w-full items-center gap-2">
                        <SolutionOutlined/>
                        <span>История заказов</span>
                    </div>
                    <CaretRightOutlined/>
                </div>
            </ConfigProvider>
        </main>
    )
}