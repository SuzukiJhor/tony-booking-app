import { Paciente } from '@prisma/client';
import { BaseService } from './BaseService';

export class PatientService extends BaseService {

    async getAll() {
        this.logAction('Listagem', 'Paciente');
        return await this.db.paciente.findMany({
            where: {
                empresaId: this.empresaId,
                isDeleted: false,
            },
            include: {
                agendamentos: {
                    where: { isDeleted: false },
                    take: 5, // Opcional: traz apenas os últimos 5
                    orderBy: { dataHora: 'desc' }
                }
            },
            orderBy: { nome: 'asc' },
        });
    }

    async getById(id: number) {
        this.logAction('Busca por ID', `Paciente ${id}`);

        return await this.db.paciente.findFirst({
            where: {
                id,
                empresaId: this.empresaId,
                isDeleted: false
            },
            include: {
                agendamentos: {
                    // where: { isDeleted: false },
                    include: { profissional: true },
                    orderBy: { dataHora: 'desc' }
                }
            },
        });
    }

    async create(data: Partial<Paciente>) {
        return await this.db.paciente.create({
            data: {
                nome: data.nome!,
                telefone: data.telefone!,
                email: data.email,
                empresaId: this.empresaId,
                isDeleted: false,
            },
        });
    }

    async update(id: number, data: Partial<Paciente>) {
        return await this.db.paciente.update({
            where: {
                id,
                empresaId: this.empresaId
            },
            data: {
                nome: data.nome,
                telefone: data.telefone,
                email: data.email,
            },
        });
    }

    async delete(id: number) {
        return await this.db.paciente.update({
            where: {
                id,
                empresaId: this.empresaId
            },
            data: { isDeleted: true },
        });
    }
}