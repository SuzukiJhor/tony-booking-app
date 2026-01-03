'use client';
import { Toaster } from "react-hot-toast";
import TitlePage from "@/app/dashboard/components/TitlePage";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { DialogNewEvent } from "../../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";
import { mapEventsToCalendar } from "@/util/map-event-to-calendar";
import { useCalendarController } from "../controller/CalendarController";

export default function CalendarView({ initialData }: { initialData: any[] }) {
    const { onAdd, onDelete, onUpdate } = useCalendarController();

    const handleUpdate = async (eventData: any, callback: () => void) => {
        if (!eventData?.id) return;
        onUpdate(eventData.id, eventData, callback);
    };

    const handleDelete = async (event: CalendarEvent) => {
        const { id, title } = event;
        if (!id) return;
        onDelete(Number(id), title);
    };

    return <>
        <div className="h-screen bg-background dark:bg-background-tertiary">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
            <div className="p-4">
                <TitlePage title="Calendário" />
                <IlamyCalendar
                    events={mapEventsToCalendar(initialData)}
                    timeFormat="12-hour"
                    locale="pt-BR"
                    translations={brasilTranslations}
                    timezone="America/Sao_Paulo"
                    headerClassName="text-secondary rounded-t-xl border-b  bg-black/50 dark:bg-background-secondary dark:text-primary"
                    viewHeaderClassName="bg-sky-600 text-white font-medium uppercase text-xs tracking-wider"
                    renderEventForm={(props) => (
                        <DialogNewEvent
                            {...props}
                            onAdd={onAdd} onUpdate={handleUpdate} onDelete={handleDelete}
                        />
                    )}
                />
            </div>
        </div>
    </>
}