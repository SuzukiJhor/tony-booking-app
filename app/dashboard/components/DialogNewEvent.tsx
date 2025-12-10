import { EventFormProps, CalendarEvent } from "@ilamy/calendar";
import { DataBaseEventType } from "@/app/dashboard/types/eventDBType";
import dayjs from "@/util/dayjs-config";

export function DialogNewEvent({
    open,
    selectedEvent,
    onAdd,
    onUpdate,
    onDelete,
    onClose,
}: EventFormProps) {
    if (!open) return null;

    const handleSubmit = (formData: FormData) => {
        const startDate = dayjs(formData.get("start") as string);
        const duration = Number(formData.get("tempoAtendimento") || 60);
        const endDate = startDate.add(duration, "minute");

        const eventData: CalendarEvent & Partial<DataBaseEventType> = {
            id: selectedEvent?.id as number,
            title: formData.get("pacientName") as string,
            start: startDate,
            end: endDate,
            tempoAtendimento: duration,
            tipoAgendamento: formData.get(
                "tipoAgendamento"
            ) as DataBaseEventType["tipoAgendamento"],
            phone: formData.get("phone") as string,
            email: formData.get("email") as string | null,
        };

        selectedEvent?.id ? onUpdate?.(eventData) : onAdd?.(eventData);
        onClose();
    };

    return (
        <dialog
            open={open}
            className="fixed inset-0 w-screen h-screen m-0 p-0 flex items-center justify-center z-[9999] bg-black/50"
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

                {/* Data e hora */}
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

                {/* Paciente */}
                <div className="flex flex-col">
                    <label htmlFor="pacientName" className="mb-2 font-medium">Nome do Paciente</label>
                    <input
                        type="text"
                        name="pacientName"
                        id="pacientName"
                        defaultValue={selectedEvent?.title === "newEvent" ? "" : selectedEvent?.title}
                        placeholder="Digite o nome do paciente"
                        className="w-full p-3 rounded border border-gray-300 bg-background"
                        required
                    />
                </div>

                {/* Telefone e Email lado a lado */}
                <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="phone" className="mb-2 font-medium">Telefone (WhatsApp)</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            defaultValue={selectedEvent?.phone || ""}
                            placeholder="+55 11 91234-5678"
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
                            defaultValue={selectedEvent?.email || ""}
                            placeholder="exemplo@email.com"
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                        />
                    </div>
                </div>

                {/* Tipo de agendamento e Duração lado a lado */}
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
                        <input
                            type="number"
                            name="tempoAtendimento"
                            id="tempoAtendimento"
                            defaultValue={60}
                            min={1}
                            className="w-full p-3 rounded border border-gray-300 bg-background"
                            required
                        />
                    </div>
                </div>

                {/* Botões */}
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
