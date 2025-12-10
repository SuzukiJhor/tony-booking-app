'use client';
import { IlamyCalendar } from "@ilamy/calendar";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";

import TitlePage from "@/app/components/TitlePage";
import { mapEventsToCalendar } from "@/util/mapEventToCalendar";
import { useCalendar } from "@/app/context/CalendarContext";

export default function Calendar() {
    const { events } = useCalendar();

    const handleAdd = (eventData: any) => {
        console.log("📥 Novo evento recebido do Dialog:", eventData);
    };

    const handleUpdate = (eventData: any) => {
        console.log("📥 Novo evento recebido do Dialog:", eventData);
    };

    const handleDelete = (eventData: any) => {
        console.log("🗑 Evento deletado:", eventData);
    };

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
                    selectedEvent={'null'}
                    renderEventForm={(props) => (
                        <DialogNewEvent
                            {...props}
                            onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete}
                        />
                    )}
                />

            </div>
        </div>
    </>
}