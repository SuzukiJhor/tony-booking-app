'use client';
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { brasilTranslations } from "@/util/translations-calendar";

import TitlePage from "@/app/components/TitlePage";
import { mapEventsToCalendar } from "@/util/mapEventToCalendar";
import { useCalendar } from "@/app/context/CalendarContext";
import { deleteAppointment, registerAppointment, updateAppointment } from "@/util/api-calendar";

export default function Calendar() {
    const { events } = useCalendar();

    const handleAdd = (eventData: any) => {
        console.log("📥 Novo evento recebido do Dialog:", eventData);
        try {
            registerAppointment(eventData)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao registrar o agendamento");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Agendamento registrado com sucesso:", data);
                })
                .catch((error) => {
                    console.error("Erro ao registrar o agendamento:", error);
                });
        } catch (error) {
            console.error("Erro ao processar o novo evento:", error);
        }
    };

    const handleUpdate = (eventData: any) => {
        console.log("✏️ Dados para atualização:", eventData);

        if (!eventData?.id) {
            console.error("❌ ID do agendamento não informado!");
            return;
        }

        try {
            updateAppointment(eventData.id, eventData)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao atualizar o agendamento");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("✔️ Agendamento atualizado com sucesso:", data);
                })
                .catch((error) => {
                    console.error("❌ Erro ao atualizar o agendamento:", error);
                });

        } catch (error) {
            console.error("Erro inesperado ao processar atualização:", error);
        }
    };

    const handleDelete = (event: CalendarEvent) => {
        const { id } = event;
        if (!id) return;
        deleteAppointment(Number(id))
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao deletar o agendamento");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Agendamento deletado:", data);
            })
            .catch((error) => console.error(error));
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