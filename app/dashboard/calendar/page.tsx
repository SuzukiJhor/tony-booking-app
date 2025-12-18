'use client';
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useCalendar } from "@/app/context/CalendarContext";
import TitlePage from "@/app/dashboard/components/TitlePage";
import { DialogNewEvent } from "../components/DialogNewEvent";
import { CalendarEvent, IlamyCalendar } from "@ilamy/calendar";
import { brasilTranslations } from "@/util/translations-calendar";
import { mapEventsToCalendar } from "@/util/map-event-to-calendar";
import { deleteAppointment, registerAppointment, updateAppointment } from "@/util/api/api-calendar";
import { useLoading } from "@/app/components/LoadingProvider";
import { useEffect } from "react";

const styleConfigureToast = {
    style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    }
};

export default function Calendar() {
    const { events, reloadEvents } = useCalendar();
    const { setIsLoading } = useLoading();
    const handleAdd = async (eventData: any) => {
        await toast.promise(
            registerAppointment(eventData),
            {
                loading: 'Registrando agendamento...',
                success: 'Agendamento registrado com sucesso!',
                error: 'Erro ao registrar o agendamento.',
            },
            {
                style: styleConfigureToast.style,
            }
        );
        await reloadEvents();
    };

    const handleUpdate = async (eventData: any) => {
        if (!eventData?.id) {
            console.error("❌ ID do agendamento não informado!");
            return;
        }

        await toast.promise(
            updateAppointment(eventData.id, eventData),
            {
                loading: 'Atualizando agendamento...',
                success: 'Agendamento atualizado com sucesso!',
                error: 'Erro ao atualizar o agendamento.',
            },
            {
                style: styleConfigureToast.style,
            }
        );
        await reloadEvents();
    };

    const handleDelete = async (event: CalendarEvent) => {
        const { id, title } = event;
        if (!id) return;
        const result = await Swal.fire({
            title: `Tem certeza que deseja excluir a reserva para "${title}"?`,
            text: "Esta reserva sera desativada e não aparecerá mais no calendário",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, Excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await toast.promise(
                deleteAppointment(Number(id)),
                {
                    loading: 'Excluindo agendamento...',
                    success: 'Agendamento excluido com sucesso!',
                    error: 'Erro ao excluir o agendamento.',
                },
                {
                    style: styleConfigureToast.style,
                }
            );
            await reloadEvents();
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await reloadEvents();
            } catch (error) {
                console.error('Erro ao carregar dados do calendário:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    return <>
        <div className="h-full bg-background dark:bg-background-tertiary">
            <Toaster
                position="top-right"
                reverseOrder={true}
            />
            <div className="p-4">
                <TitlePage title="Calendário" />
                <IlamyCalendar
                    events={mapEventsToCalendar(events)}
                    timeFormat="12-hour"
                    locale="pt-BR"
                    translations={brasilTranslations}
                    timezone="America/Sao_Paulo"
                    headerClassName="text-secondary bg-black/50 dark:bg-background-secondary dark:text-primary"
                    viewHeaderClassName="bg-sky-700 text-background font-semibold py-3"
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