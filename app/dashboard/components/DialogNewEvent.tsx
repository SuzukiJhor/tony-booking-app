/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useState } from "react";
import dayjs from "@/util/dayjs-config";
import { useSession } from "next-auth/react";
import { formatPhone } from "@/util/mask/mask-phone-br";
import { useCalendar } from "@/app/context/CalendarContext";
import { durationOptions } from "@/util/options-duration-input";
import { ExtendedEventFormProps } from "../types/eventDetailsType";
import { DataBaseEventType } from "@/app/dashboard/types/eventDBType";

export function DialogNewEvent({
    open,
    selectedEvent,
    onAdd,
    onUpdate,
    onDelete,
    onClose,
}: ExtendedEventFormProps) {
    if (!open) return null;
    const { events } = useCalendar();
    const { data: session, } = useSession();
    const eventDetails = getEventById(Number(selectedEvent?.id));
    const pacienteDetails = eventDetails ? eventDetails.paciente : { nome: '', telefone: '', email: '' };
    const [phoneValue, setPhoneValue] = useState(pacienteDetails?.telefone ?? "");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatPhone(value);
        setPhoneValue(formatted);
    };

    const handleSubmit = (formData: FormData) => {
        const startDate = dayjs(formData.get("start") as string);
        const duration = Number(formData.get("tempoAtendimento") || 60);
        const eventData: DataBaseEventType = {
            id: selectedEvent?.id as number,
            paciente: {
                nome: formData.get("pacientName") as string,
                telefone: formData.get("phone") as string,
                email: formData.get("email") as string | null,
            },
            dataHora: startDate.toDate(),
            tempoAtendimento: duration,
            tipoAgendamento: formData.get(
                "tipoAgendamento"
            ) as DataBaseEventType["tipoAgendamento"],
            statusConfirmacao: formData.get("statusAgendamento") as DataBaseEventType["statusConfirmacao"],
            empresaId: session?.user.empresaID as number,
        };

        const calendarEvent = {
            ...eventData,
            title: eventData.paciente?.nome ?? "",
            start: startDate,
            end: startDate.add(duration, "minute"),
        };
        selectedEvent?.id ? onUpdate?.(calendarEvent) : onAdd?.(calendarEvent);
        onClose();
    };

    function getEventById(id: number | null) {
        return events.find(event => event.id === id) || null;
    }

    return (
        <dialog
            open={open}
            className="fixed inset-0 w-screen h-screen m-0 p-0 flex items-center justify-center z-9999 bg-black/50"
        >
            <form
                className="bg-background text-foreground p-8 rounded-xl shadow-xl w-full max-w-md space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(new FormData(e.currentTarget));
                }}
            >
                <h2 className="text-2xl font-bold mb-4">
                    {selectedEvent?.id ? "Editar Agendamento" : "Criar Agendamento"}
                </h2>

                <div className="flex flex-col">
                    <label htmlFor="start" className="mb-2 font-medium">Data e Hora</label>
                    <input
                        type="datetime-local"
                        name="start"
                        id="start"
                        defaultValue={
                            selectedEvent?.start ? selectedEvent.start.format("YYYY-MM-DDTHH:mm") : ""
                        }
                        className="w-full p-3 rounded border border-gray-300 bg-background"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="pacientName" className="mb-2 font-medium">Nome do Paciente</label>
                    <input
                        type="text"
                        name="pacientName"
                        id="pacientName"
                        defaultValue={pacienteDetails?.nome}
                        placeholder="Digite o nome do paciente"
                        className="w-full p-3 rounded border border-gray-300 bg-background"
                        required
                    />
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">

                    <div className="flex flex-col flex-1">
                        <label htmlFor="phone" className="mb-2 font-medium">Telefone (WhatsApp)</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={phoneValue}
                            placeholder="(XX) XXXXX-XXX"
                            onChange={handlePhoneChange}
                            maxLength={15}
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                            required
                        />
                    </div>
                    <div className="flex flex-col flex-1 mt-4 md:mt-0">
                        <label htmlFor="email" className="mb-2 font-medium">Email (opcional)</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={pacienteDetails?.email || ""}
                            placeholder="exemplo@email.com"
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="tipoAgendamento" className="mb-2 font-medium">Tipo de Agendamento</label>
                        <select
                            name="tipoAgendamento"
                            id="tipoAgendamento"
                            defaultValue={"CONSULTA"}
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                            required
                        >
                            <option value="CONSULTA">Consulta</option>
                            <option value="RETORNO">Retorno</option>
                            <option value="EXAME">Exame</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-1 mt-4 md:mt-0">
                        <label htmlFor="tempoAtendimento" className="mb-2 font-medium">Duração (minutos)</label>
                        <select
                            name="tempoAtendimento"
                            id="tempoAtendimento"
                            defaultValue={60}
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                            required
                        >
                            {durationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="statusAgendamento" className="mb-2 font-medium">Status do Agendamento</label>
                    <select
                        name="statusAgendamento"
                        id="statusAgendamento"
                        defaultValue={eventDetails?.statusConfirmacao || "PENDENTE"}
                        className="w-full p-3 rounded border border-gray-300 bg-background"
                        required
                    >
                        <option value="PENDENTE">Pendente de Confirmação</option>
                        <option value="MENSAGEM_ENVIADA">Mensagem Enviada</option>
                        <option value="CONFIRMADO">Confirmado</option>
                        <option value="NAO_CONFIRMADO">Não Confirmado</option>
                    </select>
                </div>

                <div className="flex justify-between gap-3 pt-4">
                    {selectedEvent?.id && (
                        <button
                            type="button"
                            onClick={() => {
                                onDelete?.(selectedEvent);
                                onClose();
                            }}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Excluir
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-primary text-background hover:opacity-90"
                    >
                        {selectedEvent?.id ? "Salvar" : "Criar"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
