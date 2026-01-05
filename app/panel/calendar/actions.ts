'use server';
import { ZodError } from "zod";
import { revalidatePath } from 'next/cache';
import { getValidatedCompanyId } from "@/lib/auth-utils";
import { ScheduleService } from "@/app/services/ScheduleService";
import { CreateScheduleSchema, DeleteScheduleSchema, UpdateScheduleSchema } from "@/lib/validations/events";

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

export async function createScheduleAction(data: any) {

    const validatedData = CreateScheduleSchema.parse(data);
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ScheduleService(companyId);
        await service.create(validatedData);
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const mensagem = error.issues[0]?.message;
            return {
                success: false,
                error: mensagem || "Dados de formulário inválidos"
            };
        }
        return {
            success: false,
            error: error.message || "Erro ao registrar agendamento"
        };
    }
}

export async function updateScheduleAction(id: number, data: any) {
    try {
        const empresaId = await getValidatedCompanyId();
        const validatedData = UpdateScheduleSchema.parse({ id, ...data });
        const service = new ScheduleService(empresaId);
        await service.update(id, validatedData);
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const mensagem = error.issues[0]?.message;
            return {
                success: false,
                error: mensagem || "Dados de formulário inválidos"
            };
        }
        return { success: false, error: "Erro ao atualizar agendamento" };
    }
}

export async function getEventByIdAction(id: number) {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ScheduleService(companyId);
        const event = await service.getById(id);
        return { success: true, data: event };
    } catch (error: any) {
        return { success: false, error: "Erro ao buscar agendamento" };
    }
}

export async function deleteProfessionalAction(id: number) {
    try {
        const empresaId = await getValidatedCompanyId();
        const service = new ScheduleService(empresaId);
        const { id: validatedId } = DeleteScheduleSchema.parse({ id });
        await service.delete(validatedId);
        revalidatePath('/dashboard/calendar');
        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const mensagem = error.issues[0]?.message;
            return {
                success: false,
                error: mensagem || "Dados de formulário inválidos"
            }; 
        }
        return { success: false, error: "Erro ao deletar agendamento" };
    }
}