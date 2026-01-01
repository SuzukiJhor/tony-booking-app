export function deleteSchedule(id: number) {
    return fetch(`/api/appointments/${id}`, {
        method: "DELETE",
    });
}