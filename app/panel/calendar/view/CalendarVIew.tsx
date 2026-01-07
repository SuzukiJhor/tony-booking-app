'use client';
import { Info } from "lucide-react";
import { Toaster } from "react-hot-toast";
import TitlePage from "@/app/panel/components/TitlePage";
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

    return (
        <div className="min-h-screen bg-background dark:bg-background-tertiary">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{ zIndex: 99999 }} />

            <div className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <TitlePage title="Calendário" />

                    <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-lg">
                        <Info size={16} className="text-sky-600 dark:text-sky-400" />
                        <p className="text-xs sm:text-sm text-sky-800 dark:text-sky-300">
                            <span className="font-bold">Dica:</span> Clique em um horário para <span className="underline decoration-sky-500/30">agendar</span> ou sobre um evento para <span className="underline decoration-sky-500/30">editar</span>.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary overflow-hidden">
                    <IlamyCalendar
                        events={mapEventsToCalendar(initialData)}
                        timeFormat="12-hour"
                        locale="pt-BR"
                        translations={brasilTranslations}
                        timezone="America/Sao_Paulo"
                        headerClassName="text-secondary rounded-t-xl border-b bg-gray-50 dark:bg-background-secondary dark:text-primary p-4"
                        viewHeaderClassName="bg-sky-600 text-white font-medium uppercase text-[10px] sm:text-xs tracking-wider"
                        renderEventForm={(props) => (
                            <DialogNewEvent
                                {...props}
                                onAdd={onAdd}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}