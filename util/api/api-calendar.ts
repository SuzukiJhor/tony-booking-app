import { sanitizeSchedule } from "@/app/dashboard/sanitizers/sanitizeSchedule";

export async function fetchAppointments() {
    const response = await fetch(`/api/appointments`, {
        method: "GET",
        cache: "no-cache",
    });

    if (!response.ok) throw new Error("Erro ao buscar agendamentos");

    return response.json();
}


export function registerAppointment(appointmentData: any) {
    return fetch(`/api/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizeSchedule(appointmentData)),
    });
}

export function updateAppointment(id: number, data: any) {
    return fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizeSchedule(data)),
    });
}

export function deleteAppointment(id: number) {
  return fetch(`/api/appointments/${id}`, {
    method: "DELETE",
  });
}
