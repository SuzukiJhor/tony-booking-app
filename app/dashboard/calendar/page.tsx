'use client';
import { IlamyCalendar, EventFormProps, CalendarEvent } from "@ilamy/calendar";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";
import { fetchAppointments } from "@/util/api-calendar";
import { useState, useEffect } from "react";


export default function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await fetchAppointments();
            setEvents(data);
        }
        load();
    }, []);

    console.log(events);

    const handleEventClick = (event) => {
        console.log('Event clicked:', event);
        // Open event details modal, navigate to event page, etc.
    };

    const handleDateClick = (info) => {
        console.log('Date clicked:', info.start, info.end);
        // Create new event, switch to day view, etc.
        // info contains: { start: Dayjs, end: Dayjs, resourceId?: string | number }
    };

    const handleViewChange = (view) => {
        console.log('View changed to:', view);
        // Update URL, track analytics, etc.
    };
    const renderEvent = (event) => (
        console.log('Rendering event:', event),
        <div className="px-2 py-1 rounded bg-blue-100 text-blue-800">
            <div className="font-semibold">{event.title}</div>
            <div className="text-xs">{event.description}</div>
        </div>
    );

    return <>
        <div className=" p-4 bg-background">
            <h1 className="text-3xl font-extrabold text-primary pb-10">Calendário</h1>
            <IlamyCalendar
                timeFormat="12-hour"
                locale="pt-BR"
                // translations={brasilTranslations}
                timezone="America/Sao_Paulo" headerClassName="text-secondary" viewHeaderClassName="bg-primary text-background font-semibold py-3"
                // onEventClick={handleEventClick}
                // onCellClick={handleDateClick}
                // renderEvent={renderEvent}
                onViewChange={handleViewChange}
                renderEventForm={(props: EventFormProps) => <DialogNewEvent {...props} />}
            />
        </div>
    </>
}