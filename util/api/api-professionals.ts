import { ProfissionalPayload } from "@/app/DTO/ProfessionalDTO";

const base_endpoint = "/api/professionals";

export async function fetchProfessionals() {
    const response = await fetch(`${base_endpoint}`, {
        method: "GET",
        cache: "no-cache",
    });

    if (!response.ok) throw new Error("Erro ao buscar profissionais");

    return response.json();
}

export async function fetchProfessionalById(id: number) {
    const response = await fetch(`${base_endpoint}/${id}`, {
        method: "GET",
        cache: "no-cache",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar detalhes do profissional");
    }

    return response.json();
}

export async function registerProfessional(professionalData: ProfissionalPayload) {
    const response = await fetch(`${base_endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(professionalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar profissional");
    }

    return response.json();
}


export function updateProfessional(id: number, data: any) {
    return fetch(`${base_endpoint}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function deleteProfessional(id: number) {
    const response = await fetch(`${base_endpoint}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao remover profissional");
    }

    return response.json();
}