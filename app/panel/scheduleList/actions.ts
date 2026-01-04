'use server';
import { ScheduleService } from "@/app/services/ScheduleService";
import { getValidatedCompanyId } from "@/lib/auth-utils";

export async function getAllSchedules() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ScheduleService(companyId);
        const professionals = await service.getAll();
        return { success: true, data: professionals };
    } catch (error: any) {
        console.error("Action Error (Get All):", error);
        return { success: false, error: "Erro ao buscar profissionais" };
    }
}