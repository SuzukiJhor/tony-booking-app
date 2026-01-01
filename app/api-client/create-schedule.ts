import { sanitizeSchedule } from "@/util/sanitizeSchedule";

export function createSchedule(appointmentData: any) {
    return fetch(`/api/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizeSchedule(appointmentData)),
    });
}