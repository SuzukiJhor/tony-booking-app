'use client';
import { IlamyCalendar, EventFormProps, CalendarEvent } from "@ilamy/calendar";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";
import { fetchAppointments } from "@/util/api-calendar";
import { useState, useEffect } from "react";
import TitlePage from "@/app/components/TitlePage";
import { mapEventsToCalendar } from "@/util/mapEventToCalendar";
import { DataBaseEventType, PacienteEventInfo } from "../types/eventDBType";
import { useCalendar } from "@/app/context/CalendarContext";

const pacienteDetailsEmpty = { nome: '', telefone: '', email: '' };
export default function Calendar() {
    const { events } = useCalendar();


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
                    events={mapEventsToCalendar(events)}
                    timeFormat="12-hour"
                    locale="pt-BR"
                    translations={brasilTranslations}
                    timezone="America/Sao_Paulo" headerClassName="text-secondary" viewHeaderClassName="bg-primary text-background font-semibold py-3"
                    // onEventClick={handleEventClick}
                    // onCellClick={handleDateClick}]
                    selectedEvent={'null'}
                    // renderEvent={renderEvent}
                    // onViewChange={handleViewChange}
                    renderEventForm={(props) => (
                        <DialogNewEvent
                            {...props}
                        />
                    )}
                />

            </div>
        </div>
    </>
}