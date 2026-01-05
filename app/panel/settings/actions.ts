'use server';
import { SettingsService } from "@/app/services/SettingsService";
import { getValidatedCompanyId } from "@/lib/auth-utils";

export async function getMainPhoneAction() {
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

export async function setMainPhoneAction(phone: string) {
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

export async function checkConnectionWppAction() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new SettingsService(companyId);
        const { data } = await service.checkConnectionWpp();
        console.log('action', data);
        return { success: true, data };
    } catch (error: any) {
        console.error("Action Error (Check Connection):", error);
        return { success: false, error: "Erro ao verificar conexão com o serviço WPP" };
    }
}

export async function connectionAndPollStatusAction() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new SettingsService(companyId);
        const { data } = await service.connectAndPollStatus();
        return { success: true, data };
    } catch (error: any) {
        console.error("Action Error (Check Connection):", error);
        return { success: false, error: "Erro ao verificar conexão com o serviço WPP" };
    }
}