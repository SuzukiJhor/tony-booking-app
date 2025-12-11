export async function fetchClients() {
    const response = await fetch(`/api/clients`, {
        method: "GET",
        cache: "no-cache",
    });

    if (!response.ok) throw new Error("Erro ao buscar clientes");

    return response.json();
}
