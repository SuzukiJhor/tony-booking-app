'use server'
import { ZodError } from "zod";
import { revalidatePath } from 'next/cache';
import { getValidatedCompanyId } from '@/lib/auth-utils';
import { ProfessionalService } from '@/app/services/ProfessionalService';
import { CreateProfessionalSchema, DeleteProfessionalSchema, UpdateProfessionalSchema } from '@/lib/validations/professional';

export async function getProfessionalsAction() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ProfessionalService(companyId);
        const professionals = await service.getAll();
        return { success: true, data: professionals };
    } catch (error: any) {
        console.error("Action Error (Get All):", error);
        return { success: false, error: "Erro ao buscar profissionais" };
    }
}

export async function getAllProfessionalsAction() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new ProfessionalService(companyId);
        const professionals = await service.getAll();
        return { success: true, data: professionals };
    } catch (error: any) {
        console.error("Action Error (Get All):", error);
        return { success: false, error: "Erro ao buscar profissionais" };
    }
}

export async function createProfessionalAction(data: any) {
    try {
        const companyId = await getValidatedCompanyId();
        const validatedData = CreateProfessionalSchema.parse(data);
        const service = new ProfessionalService(companyId);
        await service.create(validatedData);
        revalidatePath('/dashboard/professionals');
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
            error: error.message || "Erro ao registrar profissional"
        };
    }
}

export async function updateProfessionalAction(id: number, data: any) {
    try {
        const empresaId = await getValidatedCompanyId();
        const validatedData = UpdateProfessionalSchema.parse({ id, ...data });
        const service = new ProfessionalService(empresaId);
        await service.update(id, validatedData);
        revalidatePath('/dashboard/professionals');
        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const mensagem = error.issues[0]?.message;
            return {
                success: false,
                error: mensagem || "Dados de formulário inválidos"
            };
        }
        return { success: false, error: "Erro ao atualizar profissional" };
    }
}

export async function deleteProfessionalAction(id: number) {
    try {
        const empresaId = await getValidatedCompanyId();
        const service = new ProfessionalService(empresaId);
        const { id: validatedId } = DeleteProfessionalSchema.parse({ id });
        await service.delete(validatedId);
        revalidatePath('/dashboard/professionals');
        return { success: true };
    } catch (error: any) {
        if (error instanceof ZodError) {
            const mensagem = error.issues[0]?.message;
            return {
                success: false,
                error: mensagem || "Dados de formulário inválidos"
            }; 
        }
        return { success: false, error: "Erro ao inativar profissional" };
    }
}