import { CalendarEventType } from "@/app/dashboard/types/eventCalendarType";
import { DataBaseEventType } from "@/app/dashboard/types/eventDBType";

const statusColorMap: Record<string, string> = {
    CONFIRMADO: "#16a34a",
    PENDENTE: "#eab308",
    MENSAGEM_ENVIADA: "#3b82f6",
    NAO_CONFIRMADO: "#dc2626",
};

export function mapEventsToCalendar(events: DataBaseEventType[]): CalendarEventType[] {
    return events.map((event) => {
        const start = new Date(event.dataHora);
        const end = new Date(start.getTime() + (event.tempoAtendimento ?? 60) * 60000);

        return {
            id: String(event.id),
            title: event.paciente?.nome || "Sem Nome",
            start,
            end,
            description: event.statusConfirmacao,
            backgroundColor: statusColorMap[event.statusConfirmacao] ?? "#6b7280",
            color: "#ffffff",
        };
    });
}