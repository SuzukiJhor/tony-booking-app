import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

export abstract class BaseService {
    protected readonly db: PrismaClient;
    protected readonly empresaId: number;

    constructor(empresaId: number, db: PrismaClient = prisma) {
        this.db = db;
        this.empresaId = empresaId;
    }

    protected logAction(action: string, model: string) {
        console.log(`[Tenant ${this.empresaId}] ${action} em ${model} às ${new Date().toISOString()}`);
    }
}