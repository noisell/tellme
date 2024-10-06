'use client'

import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'
import { DrawerSchedule } from '@/app/components/drawerSchedule'
import { ExecutorSchedule } from '@/app/types'
import { Checkbox, ConfigProvider, message, Popover } from 'antd'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimeClock } from '@mui/x-date-pickers/TimeClock'
import { PickerSelectionState } from '@mui/x-date-pickers/internals'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { createSchedule, updateSchedule } from '@/app/API'

interface Props {
  schedule: ExecutorSchedule[] | []
  weekday: number
  timezoneOffset: number
}
const daysOfWeekList = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]
const daysOfWeekMap: Record<ExecutorSchedule['day_of_week'], string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
}

interface ScheduleDataPart {
  start: { value: 'Начало' | string; open: boolean; timeClock: React.ReactNode }
  end: { value: 'Конец' | string; open: boolean; timeClock: React.ReactNode }
}

interface ScheduleData {
  monday: ScheduleDataPart | undefined
  tuesday: ScheduleDataPart | undefined
  wednesday: ScheduleDataPart | undefined
  thursday: ScheduleDataPart | undefined
  friday: ScheduleDataPart | undefined
  saturday: ScheduleDataPart | undefined
  sunday: ScheduleDataPart | undefined
}

export function ScheduleSection(props: Props) {
  const schedule = props.schedule
  const [oldUser, setOldUser] = useState<boolean>(!!props.schedule.length)
  const [mode, setMode] = useState<'view' | 'edit'>(oldUser ? 'view' : 'edit')
  const [showMode, setShowMode] = useState<boolean>(oldUser)
  const [saveChange, setSaveChange] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [scheduleData, setScheduleData] = useState<ScheduleData>(
    oldUser
      ? schedule.reduce((acc, executorSchedule) => {
          const { day_of_week, day_off, start_time, end_time } =
            executorSchedule
          acc[day_of_week] = day_off
            ? undefined
            : {
                start: {
                  value: (start_time as string)
                    .split(':')
                    .slice(0, 2)
                    .join(':'),
                  open: false,
                  timeClock: <></>,
                },
                end: {
                  value: (end_time as string).split(':').slice(0, 2).join(':'),
                  open: false,
                  timeClock: <></>,
                },
              }
          return acc
        }, {} as ScheduleData)
      : {
          monday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          tuesday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          wednesday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          thursday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          friday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          saturday: {
            start: { value: 'Начало', open: false, timeClock: <></> },
            end: { value: 'Конец', open: false, timeClock: <></> },
          },
          sunday: undefined,
        },
  )
  const previousDataRef = useRef<ScheduleData | null>(null)
  const [originalDataRef, setOriginalDataRef] =
    useState<ScheduleData>(scheduleData)
  const updateTime = (
    value: any,
    selectionState: PickerSelectionState | undefined,
    day: keyof ScheduleData,
    part: keyof ScheduleDataPart,
  ) => {
    setScheduleData(prevState1 => ({
      ...prevState1,
      [day]: {
        ...prevState1[day],
        [part]: {
          ...prevState1[day]?.[part],
          value: `${value.hour().toString().padStart(2, '0')}:${value
            .minute()
            .toString()
            .padStart(2, '0')}`,
        },
      },
    }))
    if (selectionState === 'finish') {
      if (part === 'start') {
        setScheduleData(prevState1 => ({
          ...prevState1,
          [day]: {
            ...prevState1[day],
            start: {
              ...prevState1[day]?.start,
              open: false,
            },
            end: {
              ...prevState1[day]?.end,
              open: true,
            },
          },
        }))
      } else {
        setScheduleData(prevState1 => ({
          ...prevState1,
          [day]: {
            ...prevState1[day],
            end: {
              ...prevState1[day]?.end,
              open: false,
            },
          },
        }))
      }
    }
  }
  useEffect(() => {
    console.log('scheduleData::: ', scheduleData)
    console.log('previousDataRef::: ', previousDataRef.current)
    if (previousDataRef.current === null) {
      previousDataRef.current = scheduleData
      return
    }
    const changeStateTimeClock = (
      day: keyof ScheduleData,
      part: keyof ScheduleDataPart,
    ) => {
      setScheduleData(prevState => ({
        ...prevState,
        [day]: {
          ...prevState[day],
          [part]: {
            ...prevState[day]?.[part],
            timeClock: (
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeClock
                    key={`${day} ${part} ${Date.now()}`}
                    ampm={false}
                    sx={{ width: 'auto', margin: '0' }}
                    onChange={(value, selectionState, _) => {
                      updateTime(value, selectionState, day, part)
                    }}></TimeClock>
                </LocalizationProvider>
              </div>
            ),
          },
        },
      }))
    }
    const areValuesEqual = Object.entries(scheduleData).every(
      ([day, value]) => {
        const originalValue = originalDataRef[day as keyof ScheduleData]
        return (
          value?.start.value === originalValue?.start.value &&
          value?.end.value === originalValue?.end.value
        )
      },
    )

    if (!areValuesEqual) {
      setSaveChange(true)
    } else {
      setSaveChange(false)
    }
    for (const day of daysOfWeekList) {
      const dayKey = day as keyof ScheduleData
      if (
        scheduleData[dayKey]?.start.open !==
          previousDataRef.current[dayKey]?.start.open &&
        scheduleData[dayKey] !== undefined
      ) {
        changeStateTimeClock(dayKey, 'start' as keyof ScheduleDataPart)
      }
      if (
        scheduleData[dayKey]?.end.open !==
          previousDataRef.current[dayKey]?.end.open &&
        scheduleData[dayKey] !== undefined
      ) {
        changeStateTimeClock(dayKey, 'end' as keyof ScheduleDataPart)
      }
    }
    previousDataRef.current = scheduleData
  }, [scheduleData])
  const [messageApi, contextHolder] = message.useMessage()
  const error = () => {
    messageApi
      .open({
        type: 'error',
        content: 'Создайте график для каждого дня!',
      })
      .then(() => {
        return
      })
  }
  const success = () => {
    messageApi
      .open({
        type: 'success',
        content: 'Изменения успешно сохранены!',
      })
      .then(() => {
        return
      })
  }
  const saveSchedule = () => {
    for (const day of daysOfWeekList) {
      const dayKey = day as keyof ScheduleData
      if (
        scheduleData[dayKey]?.start.value === 'Начало' ||
        scheduleData[dayKey]?.end.value === 'Конец'
      ) {
        return error()
      }
    }
    setShowMode(true)
    setSaveChange(false)
    setMode('view')
    let new_schedule: ExecutorSchedule[] = []
    for (const day of daysOfWeekList) {
      const scheduleDataPart = scheduleData[day as keyof ScheduleData]
      const executorSchedule: ExecutorSchedule = {
        day_of_week: day as keyof ScheduleData,
        day_off: scheduleDataPart === undefined,
        start_time:
          scheduleDataPart === undefined ? null : scheduleDataPart.start.value,
        end_time:
          scheduleDataPart === undefined ? null : scheduleDataPart.end.value,
      }
      new_schedule.push(executorSchedule)
    }
    oldUser ? updateSchedule(new_schedule) : createSchedule(new_schedule)
    setOriginalDataRef(scheduleData)
    setOldUser(true)
    return success()
  }
  return (
    <div className='flex flex-col w-full h-auto items-center bg-tg-section-color rounded-3xl mt-3 p-4'>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentBg: 'var(--tg-second-section-color)',
              colorText: 'var(--tg-theme-text-color)',
            },
          },
        }}>
        {contextHolder}
      </ConfigProvider>
      <div className='flex w-full items-center justify-between pr-2'>
        <div className='flex gap-2 font-medium items-center ml-2'>
          <ClockCircleOutlined />
          <p>График работы</p>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className='flex font-normal text-tg-subtitle-color'
            onClick={() => {
              setModalOpen(true)
            }}>
            <ExclamationCircleOutlined style={{ fontSize: '18px' }} />
          </span>
          {showMode && (
            <span
              className={`flex font-normal ${
                mode === 'edit'
                  ? 'text-tg-accent-color'
                  : 'text-tg-subtitle-color'
              }`}
              onClick={() => {
                if (mode === 'view') {
                  setMode('edit')
                } else {
                  setScheduleData(originalDataRef)
                  setMode('view')
                }
              }}>
              <EditRoundedIcon fontSize='small' />
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-col w-full px-2' style={{ fontSize: '14px' }}>
        {!oldUser ? (
          <p className='mr-auto text-xs text-tg-subtitle-color mt-2'>
            У вас еще не создан график работы, давайте это исправим. Нажимайте
            на время и выбирайте подходящее.
          </p>
        ) : (
          mode === 'edit' && (
            <p className='mr-auto text-xs text-tg-subtitle-color mt-2'>
              Вы находитесь в режиме редактирования, пожалуйста не забывайте
              сохранять изменения.
            </p>
          )
        )}
        <div className='flex flex-col w-full mt-2'>
          {Object.entries(scheduleData).map(([day, value]) => (
            <div className='flex w-full items-center justify-between'>
              <span style={{ color: 'var(--tg-theme-text-color)' }}>
                {daysOfWeekMap[day as keyof ScheduleData]}
              </span>
              {
                <span style={{ color: 'var(--tg-theme-subtitle-text-color)' }}>
                  {value ? (
                    <span
                      style={{ color: 'var(--tg-theme-subtitle-text-color)' }}>
                      {mode === 'edit' ? (
                        <Popover
                          content={value.start.timeClock}
                          trigger='click'
                          placement='top'
                          open={value.start.open}
                          onOpenChange={open =>
                            setScheduleData(prevState => ({
                              ...prevState,
                              [day]: {
                                ...prevState[day as keyof ScheduleData],
                                start: {
                                  ...prevState[day as keyof ScheduleData]
                                    ?.start,
                                  open: open,
                                },
                              },
                            }))
                          }>
                          <button
                            style={
                              value.start.open
                                ? {
                                    textDecoration:
                                      'underline 1px var(--tg-theme-accent-text-color)',
                                    textUnderlineOffset: '3px',
                                  }
                                : {}
                            }>
                            {value.start.value}
                          </button>
                        </Popover>
                      ) : (
                        value.start.value
                      )}
                      <span> - </span>
                      {mode === 'edit' ? (
                        <Popover
                          content={value.end.timeClock}
                          trigger='click'
                          placement='top'
                          open={value.end.open}
                          onOpenChange={open =>
                            setScheduleData(prevState => ({
                              ...prevState,
                              [day]: {
                                ...prevState[day as keyof ScheduleData],
                                end: {
                                  ...prevState[day as keyof ScheduleData]?.end,
                                  open: open,
                                },
                              },
                            }))
                          }>
                          <button
                            style={
                              value.end.open
                                ? {
                                    textDecoration:
                                      'underline 1px var(--tg-theme-accent-text-color)',
                                    textUnderlineOffset: '3px',
                                  }
                                : {}
                            }>
                            {value.end.value}
                          </button>
                        </Popover>
                      ) : (
                        value.end.value
                      )}
                    </span>
                  ) : (
                    <span
                      style={{ color: 'var(--tg-theme-subtitle-text-color)' }}>
                      Выходной
                    </span>
                  )}
                  {mode === 'edit' && (
                    <ConfigProvider
                      theme={{
                        components: {
                          Checkbox: {
                            colorPrimary: 'var(--tg-theme-accent-text-color)',
                            colorPrimaryHover:
                              'var(--tg-theme-accent-text-color)',
                            colorBgContainer: 'none',
                            colorBorder: 'var(--tg-theme-hint-color)',
                          },
                        },
                      }}>
                      <Checkbox
                        style={{ marginLeft: '5px' }}
                        checked={value !== undefined}
                        onChange={e => {
                          if (e.target.checked) {
                            setScheduleData(prevState => ({
                              ...prevState,
                              [day]: {
                                start: {
                                  value: 'Начало',
                                  open: false,
                                  timeClock: <></>,
                                },
                                end: {
                                  value: 'Конец',
                                  open: false,
                                  timeClock: <></>,
                                },
                              },
                            }))
                          } else {
                            setScheduleData(prevState => ({
                              ...prevState,
                              [day]: undefined,
                            }))
                          }
                        }}
                      />
                    </ConfigProvider>
                  )}
                </span>
              }
            </div>
          ))}
        </div>
        {saveChange && (
          <div className='flex w-full items-center justify-between mt-3'>
            <button
              className='p-3 bg-tg-button-color text-tg-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={saveSchedule}>
              Сохранить
            </button>
            <button
              className='p-3 bg-tg-section-second-color text-tg-destructive-text-color rounded-xl'
              style={{ width: '48%' }}
              onClick={() => {
                setScheduleData(originalDataRef)
                if (oldUser) {
                  setMode('view')
                }
              }}>
              Отменить
            </button>
          </div>
        )}
      </div>
      <DrawerSchedule open={modalOpen} setOpen={setModalOpen} />
    </div>
  )
}
