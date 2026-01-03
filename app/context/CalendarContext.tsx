'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchAppointments } from "@/util/api/api-calendar";
import { DataBaseEventType } from "../panel/types/eventDBType";

interface CalendarContextProps {
    events: DataBaseEventType[];
    reloadEvents: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<DataBaseEventType[]>([]);

    async function reloadEvents() {
        const data = await fetchAppointments();
        setEvents(data);
    }

    useEffect(() => {
        const fetchData = async () => {
            await reloadEvents();
        };
        fetchData();
    }, []);

    return (
        <CalendarContext.Provider value={{ events, reloadEvents }}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error("useCalendar must be used within a CalendarProvider");
    }
    return context;
}
