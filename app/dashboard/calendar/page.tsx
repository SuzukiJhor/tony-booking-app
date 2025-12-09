'use client';
import { IlamyCalendar, EventFormProps, CalendarEvent } from "@ilamy/calendar";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";
import { fetchAppointments } from "@/util/api-calendar";
import { useState, useEffect } from "react";
import TitlePage from "@/app/components/TitlePage";


const eventDataBase = {
    id: 1,
    dataHora: '2025-12-11T18:06:41.052Z',
    statusConfirmacao: 'MENSAGEM_ENVIADA',
    mensagemEnviadaEm: null,
    mensagemId: null,
    pacienteId: 1,
    empresaId: 1,
    createdAt: '2025-12-08T05:16:08.287Z',
    updatedAt: '2025-12-08T05:16:08.287Z'
};

const eventsMetaData = [
    {
        id: '1',
        title: 'Team Meeting',
        start: new Date('2025-12-15T10:00:00'),
        end: new Date('2025-12-15T11:00:00'),
        description: 'Weekly team sync',
        backgroundColor: '#3b82f6',
        color: 'black'
    },
    {
        id: '2',
        title: 'Project Deadline',
        start: new Date('2025-12-20T23:59:59'),
        end: new Date('2025-12-20T23:59:59'),
        allDay: true,
        backgroundColor: '#ef4444',
        color: 'black'
    }
];

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
        <div className="h-screen bg-background">
            <div className="p-4">

                <TitlePage title="Calendário" />

                <IlamyCalendar
                    events={eventsMetaData}
                    timeFormat="12-hour"
                    locale="pt-BR"
                    translations={brasilTranslations}
                    timezone="America/Sao_Paulo" headerClassName="text-secondary" viewHeaderClassName="bg-primary text-background font-semibold py-3"
                    // onEventClick={handleEventClick}
                    // onCellClick={handleDateClick}
                    // renderEvent={renderEvent}
                    onViewChange={handleViewChange}
                    renderEventForm={(props: EventFormProps) => <DialogNewEvent {...props} />}
                />
            </div>
        </div>
    </>
}