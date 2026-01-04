'use server';
import { SettingsService } from "@/app/services/SettingsService";
import { getValidatedCompanyId } from "@/lib/auth-utils";

export async function getMainPhone() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new SettingsService(companyId);
        const data = await service.getCompanyPhone();
        return { success: true, data };
    } catch (error: any) {
        console.error("Action Error (Get All):", error);
        return { success: false, error: "Erro ao buscar configurações" };
    }
}

export async function setMainPhone(phone: string) {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new SettingsService(companyId);
        const { data } = await service.setCompanyPhone(phone);
        return { success: true, data };
    } catch (error: any) {
        console.error("Action Error (Set):", error);
        return { success: false, error: "Erro ao atualizar telefone da empresa" };
    }
}