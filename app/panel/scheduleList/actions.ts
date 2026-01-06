'use server';
import { ScheduleService } from "@/app/services/ScheduleService";
import { WuzapiService } from "@/app/services/WuzapiService";
import { getValidatedCompanyId } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

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

export async function sendConfirmationWhatsAppAction(agendamentoId: number) {
    try {
        const companyId = await getValidatedCompanyId();
        const wuzapiService = new WuzapiService(companyId);
        await wuzapiService.sendConfirmationMessage(agendamentoId);
        revalidatePath("/panel/scheduleList");
        return {
            success: true,
            message: "Mensagem enviada com sucesso!",
        };
    } catch (error: any) {
        console.error(`Action Error (Send WhatsApp - ID ${agendamentoId}):`, error);
        return {
            success: false,
            error: error.message || "Falha ao disparar mensagem pelo servidor"
        };
    }
}