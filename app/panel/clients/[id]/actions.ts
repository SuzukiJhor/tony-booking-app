'use server';
import { PatientService } from "@/app/services/ClientService";
import { getValidatedCompanyId } from "@/lib/auth-utils";

export async function getClientByIdAction(id: number) {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new PatientService(companyId);
        const client = await service.getById(id);
        if (!client) return { success: false, error: "Cliente não encontrado" };
        return { success: true, data: client };
    } catch (error) {
        return { success: false, error: "Erro ao carregar" };
    }
}