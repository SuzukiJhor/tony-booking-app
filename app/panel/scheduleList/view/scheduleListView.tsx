'use client';

import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import GoToBack from "@/app/components/GoToBack";
import ButtonCard from "@/app/components/ButtonCard";
import { ListFilter, Search, Plus, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useClient } from "@/app/context/ClientsContext";
import FullScheduleList from "../components/FullScheduleList";
import { DialogNewEvent } from "../../components/DialogNewEvent";
import { useScheduleListController } from "../controller/useScheduleListController";
import { useCalendarController } from "../../calendar/controller/CalendarController";
import { NextSchedulesModalDetails } from "@/app/components/NextSchedulesModalDetails";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { mapEventsToCalendar } from "@/util/map-event-to-calendar";
import { brasilTranslations } from "@/util/translations-calendar";

export default function ScheduleListView({ initialData }: { initialData: any[] }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const { selectedDentistId } = useClient();
    const {
        filtro,
        setFiltro,
        selectedSchedule,
        setSelectedSchedule,
        filteredAppointments,
        searchQuery,
        setSearchQuery,
        handleSendWhatsApp,
        isSendingMessage,
    } = useScheduleListController(initialData);

    const { onAdd, onDelete, onUpdate } = useCalendarController();
    const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const getInitialEvent = {
        title: "Novo Evento",
        start: now.toISOString(),
        end: oneHourLater.toISOString(),
        description: "",
        allDay: false
    };

    const finalFilteredAppointments = useMemo(() => {
        if (!selectedDentistId || selectedDentistId === "all") {
            return filteredAppointments;
        }
        return filteredAppointments.filter(
            (appointment: any) => String(appointment.profissionalId) === String(selectedDentistId)
        );
    }, [filteredAppointments, selectedDentistId]);

    const finalFilteredAppointmentsCalendar = useMemo(() => {
        if (!selectedDentistId || selectedDentistId === "all") {
            return initialData;
        }
        return initialData.filter(
            (appointment: any) => String(appointment.profissionalId) === String(selectedDentistId)
        );
    }, [initialData, selectedDentistId]);

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
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{ zIndex: 99999 }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <GoToBack SubTitlePage="Voltar" />

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-medium text-sm
                            ${showCalendar
                                ? 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-900/20 dark:border-sky-800'
                                : 'bg-white border-gray-200 text-gray-600 dark:bg-background-secondary dark:border-gray-800 dark:text-gray-300'}
                            hover:shadow-sm active:scale-95`}
                    >
                        <Calendar size={18} />
                        {showCalendar ? "Ocultar Calendário" : "Exibir Calendário"}
                        {showCalendar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <ButtonCard onClick={() => setIsNewEventModalOpen(true)}>
                        Novo Agendamento
                        <Plus size={16} className="ml-2" />
                    </ButtonCard>
                </div>
            </div>

            {showCalendar && (
                <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <IlamyCalendar
                        events={mapEventsToCalendar(finalFilteredAppointmentsCalendar)}
                        timeFormat="12-hour"
                        locale="pt-BR"
                        translations={brasilTranslations}
                        timezone="America/Sao_Paulo"
                        headerClassName="hidden text-secondary rounded-t-xl border-b bg-gray-50 dark:bg-background-secondary dark:text-primary p-4"
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
            )}

            <div className="bg-white dark:bg-background-secondary rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden mt-6">
                <div className="p-5 border-b dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sky-600">
                            <ListFilter size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Listagem de Agendamentos</h3>
                            <p className="text-xs text-gray-500 italic">Filtrando por: {filtro === 'hoje' ? 'Hoje' : 'Próximos 7 dias'}</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar paciente ou profissional..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-gray-200"
                        />
                    </div>

                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                        {['hoje', 'semana'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFiltro(type as any)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${filtro === type
                                    ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {type === 'hoje' ? 'Hoje' : 'Próximos 7 dias'}
                            </button>
                        ))}
                    </div>
                </div>

                <FullScheduleList
                    filteredAppointments={finalFilteredAppointments}
                    setSelectedSchedule={setSelectedSchedule}
                    handleMessage={handleSendWhatsApp}
                    loading={!!isSendingMessage}
                />

                <DialogNewEvent
                    open={isNewEventModalOpen}
                    onClose={() => setIsNewEventModalOpen(false)}
                    title="Novo Agendamento"
                    selectedEvent={getInitialEvent}
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            </div>

            {selectedSchedule && (
                <NextSchedulesModalDetails
                    schedule={selectedSchedule}
                    onClose={() => setSelectedSchedule(null)}
                />
            )}
        </div>
    );
}