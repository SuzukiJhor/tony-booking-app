'use client'

import { EventFormProps, CalendarEvent } from "@ilamy/calendar";
import { useState } from "react";

export function DialogNewEvent({
    open,
    selectedEvent,
    onAdd,
    onUpdate,
    onDelete,
    onClose,
}: EventFormProps) {

    const [start, setStart] = useState<string>(
        selectedEvent?.start
            ? new Date((selectedEvent.start as any).toDate()).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16)
    );

    const [duration, setDuration] = useState<number>(60); // default 1h (em minutos)

    const handleSubmit = (formData: FormData) => {
        const startDate = new Date(start);
        const endDate = new Date(startDate.getTime() + duration * 60000);

        const eventData: CalendarEvent = {
            id: selectedEvent?.id || `event-${Date.now()}`,
            title: formData.get('title') as string,
            patientName: formData.get('patientName') as string,
            contact: formData.get('contact') as string,
            status: formData.get('status') as string,
            start: startDate,
            end: endDate,
        };

        selectedEvent?.id ? onUpdate?.(eventData) : onAdd?.(eventData);
        onClose();
    };

    if (!open) return null;

    return (
        <dialog
            open={open}
            className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/50 z-[9999]"
        >
            <form
                className="bg-white text-black p-6 rounded-xl shadow-xl w-[350px] space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(new FormData(e.currentTarget));
                }}
            >
                <h2 className="text-xl font-bold">
                    {selectedEvent?.id ? 'Editar Agendamento' : 'Novo Agendamento'}
                </h2>

                {/* Nome do Paciente */}
                <label className="text-sm font-medium">Paciente</label>
                <input
                    name="patientName"
                    defaultValue={(selectedEvent as any)?.patientName}
                    placeholder="Nome do paciente"
                    required
                    className="w-full p-2 rounded border border-gray-300"
                />

                {/* Contato */}
                <label className="text-sm font-medium">Contato</label>
                <input
                    name="contact"
                    defaultValue={(selectedEvent as any)?.contact}
                    placeholder="Telefone / Email"
                    className="w-full p-2 rounded border border-gray-300"
                />

                {/* Horário */}
                <label className="text-sm font-medium">Horário inicial</label>
                <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300"
                    required
                />

                {/* Duração */}
                <label className="text-sm font-medium">Duração (minutos)</label>
                <input
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min={15}
                    step={15}
                    className="w-full p-2 rounded border border-gray-300"
                />

                {/* Status */}
                <label className="text-sm font-medium">Status</label>
                <select
                    name="status"
                    defaultValue={(selectedEvent as any)?.status || "pending"}
                    className="w-full p-2 rounded border border-gray-300"
                >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="canceled">Cancelado</option>
                </select>

                {/* Ações */}
                <div className="flex justify-between gap-3">
                    {selectedEvent?.id && (
                        <button
                            type="button"
                            onClick={() => {
                                onDelete?.(selectedEvent);
                                onClose();
                            }}
                            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Excluir
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="px-3 py-2 rounded bg-indigo-600 text-white hover:opacity-90"
                    >
                        {selectedEvent?.id ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
