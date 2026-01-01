'use server';
import { ProfessionalService } from "@/app/services/ProfessionalService";
import { getValidatedCompanyId } from "@/lib/auth-utils";

export async function getProfessionalByIdAction(id: number) {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ProfessionalService(companyId);
        const professional = await service.getById(id);
        if (!professional) return { success: false, error: "Profissional não encontrado" };
        return { success: true, data: professional };
    } catch (error) {
        return { success: false, error: "Erro ao carregar" };
    }
}