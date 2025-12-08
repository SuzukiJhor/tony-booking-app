export async function fetchAppointments() {
    const response = await fetch(`/api/appointments`, {
        method: "GET",
        cache: "no-cache",
    });

    if (!response.ok) throw new Error("Erro ao buscar agendamentos");

    return response.json();
}
