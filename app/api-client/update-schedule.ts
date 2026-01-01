import { sanitizeSchedule } from "@/util/sanitizeSchedule";

export function updateSchedule(id: number, data: any) {
    return fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizeSchedule(data)),
    });
}