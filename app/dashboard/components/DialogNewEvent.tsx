import { EventFormProps, CalendarEvent } from "@ilamy/calendar";

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
        const eventData: CalendarEvent = {
            id: selectedEvent?.id || `event-${Date.now()}`,
            title: formData.get('title') as string,
            start: selectedEvent?.start || new Date(),
            end: selectedEvent?.end || new Date(),
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        selectedEvent?.id ? onUpdate?.(eventData) : onAdd?.(eventData);
        onClose();
    };

    return (
        <dialog
            open={open}
            className="fixed inset-0 w-screen h-screen m-0 p-0 flex items-center justify-center z-[9999] bg-black/50"
        >
            <form
                className="bg-background text-foreground p-6 rounded-xl shadow-xl w-[320px] space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(new FormData(e.currentTarget));
                }}
            >
                <h2 className="text-xl font-bold">
                    {selectedEvent?.id ? 'Editar Evento' : 'Criar Evento'}
                </h2>

                <input
                    name="title"
                    defaultValue={selectedEvent?.title}
                    placeholder="Título do evento"
                    className="w-full p-2 rounded border border-gray-300 bg-background"
                    required
                />

                <div className="flex justify-between gap-3 pt-3">
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
                        className="px-3 py-2 rounded bg-primary text-background hover:opacity-90"
                    >
                        {selectedEvent?.id ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </form>
        </dialog>

    );
};