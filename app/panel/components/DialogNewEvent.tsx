'use client';
import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import dayjs from "@/util/dayjs-config";
import { useSession } from "next-auth/react";
import { formatPhone } from "@/util/mask/mask-phone-br";
import { useLoading } from "@/app/components/LoadingProvider";
import { durationOptions } from "@/util/options-duration-input";
import { DataBaseEventType } from "@/app/panel/types/eventDBType";
import { getAllProfessionalsAction } from "../professionals/actions";
import { useCalendarController } from "../calendar/controller/CalendarController";

export function DialogNewEvent({
    open,
    selectedEvent,
    onAdd,
    onUpdate,
    onDelete,
    onClose,
}: any) {
    const { setIsLoading } = useLoading();
    const { data: session } = useSession();
    const calendarController = useCalendarController();
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [phoneValue, setPhoneValue] = useState("");
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState("");

    const pacienteDetails = eventDetails?.paciente ?? { nome: '', telefone: '', email: '' };

    const handleSubmit = async (formData: FormData) => {
        const startDate = dayjs(formData.get("start") as string);
        if (!startDate.isValid()) {
            Swal.fire({ icon: "error", title: "Data obrigatória", text: "Informe a data e horário." });
            return;
        }

        const duration = Number(formData.get("tempoAtendimento") || 60);
        const eventData: DataBaseEventType = {
            id: selectedEvent?.id as number,
            paciente: {
                nome: formData.get("pacientName") as string,
                telefone: formData.get("phone") as string,
                email: (formData.get("email") as string) || null,
            },
            dataHora: startDate.toDate(),
            tempoAtendimento: duration,
            tipoAgendamento: formData.get("tipoAgendamento") as any,
            statusConfirmacao: formData.get("statusAgendamento") as any,
            empresaId: session?.user.empresaID as number,
            profissionalId: formData.get("professionalId") ? Number(formData.get("professionalId")) : undefined,
        };

        const calendarEvent = {
            ...eventData,
            title: eventData.paciente?.nome ?? "",
            start: startDate,
            end: startDate.add(duration, "minute"),
        };

        const result = await calendarController.onValidate(calendarEvent)

        if (!result.success)
            return toast.error(result.error || "Dados inválidos");

        if (selectedEvent?.id) {
            return onUpdate?.(calendarEvent, onClose);
        }

        onAdd?.(calendarEvent);
        onClose();
    };

    async function loadData() {
        const id = Number(selectedEvent?.id);
        if (!id) {
            setPhoneValue("");
            return setEventDetails(null);
        }
        setIsLoading(true);
        try {
            const { data } = await calendarController.onGetById(id);
            setEventDetails(data);
            setPhoneValue(data?.paciente?.telefone ?? "");
            setSelectedProfessionalId(data?.profissionalId?.toString() ?? "");
        } catch (error) {
            toast.error("Erro ao carregar detalhes");
        } finally {
            setIsLoading(false);
        }
    }

    async function loadProfessionals() {
        try {
            const { data } = await getAllProfessionalsAction();
            setProfessionals(data ?? []);
        } catch (error) {
            toast.error("Erro ao carregar profissionais");
        }
    }

    useEffect(() => {
        if (open) {
            loadData();
            loadProfessionals();
        }
    }, [open]);

    if (!open) return null;

    return (
        <dialog
            open={open}
            className="fixed inset-0 z-9999 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4"
        >
            <form
                key={eventDetails?.id || 'novo-agendamento'}
                className="bg-background dark:bg-background-secondary text-foreground w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(new FormData(e.currentTarget));
                }}
            >

                <div className="p-6 border-b border-border sticky top-0 bg-background dark:bg-background-secondary z-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-primary">
                        {selectedEvent?.id ? "Editar Agendamento" : "Novo Agendamento"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <X />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    <div className="flex flex-col">
                        <label htmlFor="start" className="text-sm font-semibold mb-1 dark:text-background">Data e Hora</label>
                        <input
                            type="datetime-local"
                            name="start"
                            id="start"
                            // defaultValue={selectedEvent?.start ? selectedEvent.start.format("YYYY-MM-DDTHH:mm") : ""}
                            defaultValue={selectedEvent?.start ? dayjs(selectedEvent.start).format("YYYY-MM-DDTHH:mm") : ""}

                            className="
                            w-full px-3 py-2 rounded-lg border
                            bg-background text-foreground dark:text-background border-border
                            focus:ring-2 focus:ring-primary focus:outline-none

                            [&::-webkit-calendar-picker-indicator]:invert-0
                            dark:[&::-webkit-calendar-picker-indicator]:invert
                            dark:bg-gray-700
                        "
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pacientName" className="text-sm font-semibold mb-1 dark:text-background">Nome do Paciente</label>
                        <input
                            type="text"
                            name="pacientName"
                            id="pacientName"
                            defaultValue={pacienteDetails?.nome}
                            placeholder="Nome completo"
                            className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="phone" className="text-sm font-semibold mb-1 dark:text-background">WhatsApp</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={phoneValue}
                                onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-semibold mb-1 dark:text-background">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={pacienteDetails?.email || ""}
                                placeholder="opcional@email.com"
                                className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="professionalId" className="text-sm font-semibold mb-1 dark:text-background">Profissional Responsável</label>
                        <select
                            name="professionalId"
                            id="professionalId"
                            value={selectedProfessionalId}
                            onChange={(e) => setSelectedProfessionalId(e.target.value)}
                            className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                        >
                            <option value="">Selecione um profissional</option>
                            {professionals.map((pro) => (
                                <option key={pro.id} value={pro.id}>{pro.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="tipoAgendamento" className="text-sm font-semibold mb-1 dark:text-background">Tipo</label>
                            <select name="tipoAgendamento" defaultValue={eventDetails?.tipoAgendamento || "CONSULTA"} className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            >
                                <option value="CONSULTA">Consulta</option>
                                <option value="RETORNO">Retorno</option>
                                <option value="EXAME">Exame</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="tempoAtendimento" className="text-sm font-semibold mb-1 dark:text-background">Duração</label>
                            <select name="tempoAtendimento" defaultValue={eventDetails?.tempoAtendimento || 30}
                                className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background">
                                {durationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="statusAgendamento" className="text-sm font-semibold mb-1 dark:text-background">Status</label>
                        <select
                            name="statusAgendamento"
                            defaultValue={eventDetails?.statusConfirmacao || "PENDENTE"}
                            className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                        >
                            <option value="PENDENTE">🟡 Pendente</option>
                            <option value="MENSAGEM_ENVIADA">🔵 Mensagem Enviada</option>
                            <option value="CONFIRMADO">🟢 Confirmado</option>
                            <option value="NAO_CONFIRMADO">🔴 Não Confirmado</option>
                            <option value="CANCELADO">🔴 Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/30 sticky bottom-0 backdrop-blur-md flex flex-col-reverse md:flex-row justify-between gap-3">

                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 cursor-pointer">
                        Cancelar
                    </button>
                    {selectedEvent?.id && (
                        <button
                            type="button"
                            onClick={() => { onDelete?.(selectedEvent); onClose(); }}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        >
                            Excluir
                        </button>
                    )}

                    <button type="submit" className="px-4 py-2 rounded bg-chart-2 hover:opacity-90 cursor-pointer text-card">
                        {selectedEvent?.id ? "Salvar Alterações" : "Criar Agendamento"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}