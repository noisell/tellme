export type Level = {
    id: number,
    name: string,
    description: string,
    count_orders_start: number,
    count_orders_completed: number
}

export type ExecutorSchedule = {
    day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    day_off: boolean,
    start_time: string | null,
    end_time: string | null,
}

export type ExecuterData = {
    skills: string[],
    user_id: number,
    accept_orders: boolean,
    created_at: string,
    level: Level,
    executor_schedule: ExecutorSchedule[] | [],
    amount: number,
    count_completed_projects: number
    weekday: number

};

export type UserData = {
    name: string,
    time_zone: number,
    last_seen: string,
    executor: boolean
};

export type ExecutorResponseData = {
    user: UserData,
    executor: ExecuterData
};

export type PageState = {
    page: "executor" | "user" | "newUser",
    data: ExecutorResponseData | UserData | null
};

export type UserTasksCompleted = {
    subscription: boolean,
    shortcut: boolean,
    invite: number
}

export type Top = {
    user_id: number,
    user_name: string,
    level_id: number,
    count: number,
    rate: number
}