'use server'
import { ZodError } from 'zod';
import { revalidatePath } from 'next/cache';
import { getValidatedCompanyId } from '@/lib/auth-utils';
import { PatientService } from '@/app/services/ClientService';
import { CreatePatientSchema, DeletePatientSchema, UpdatePatientSchema } from '@/lib/validations/clients';

function handleActionError(error: any, defaultMessage: string) {
    console.error(`[ACTION ERROR]:`, error);
    if (error instanceof ZodError) {
        return {
            success: false,
            error: error.issues[0]?.message || "Dados inválidos"
        };
    }
    return {
        success: false,
        error: error.message || defaultMessage
    };
}

export async function getAllClientsAction() {
    try {
        const companyId = await getValidatedCompanyId();
        const service = new PatientService(companyId);
        const patients = await service.getAll();
        return { success: true, data: patients };
    } catch (error: any) {
        return { success: false, error: "Erro ao buscar pacientes" };
    }
}

export async function createClientAction(data: any) {
    try {
        const companyId = await getValidatedCompanyId();
        const validatedData = CreatePatientSchema.parse(data);
        const service = new PatientService(companyId);
        await service.create(validatedData);
        revalidatePath('/dashboard/clients');
        return { success: true };
    } catch (error: any) {
        return handleActionError(error, "Erro ao registrar cliente");
    }
}

export async function updateClientAction(id: number, data: any) {
    try {
        const empresaId = await getValidatedCompanyId();
        const validatedData = UpdatePatientSchema.parse({ id, ...data });
        const service = new PatientService(empresaId);
        await service.update(id, validatedData);
        revalidatePath('/dashboard/clients');
        return { success: true };
    } catch (error: any) {
        return handleActionError(error, "Erro ao atualizar cliente");
    }
}

export async function deleteClientAction(id: number) {
    try {
        const empresaId = await getValidatedCompanyId();
        const service = new PatientService(empresaId);
        const { id: validatedId } = DeletePatientSchema.parse({ id });
        await service.delete(validatedId);
        revalidatePath('/dashboard/clients');
        return { success: true };
    } catch (error: any) {
        return handleActionError(error, "Erro ao inativar cliente");
    }
}