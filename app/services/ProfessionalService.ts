import { Profissional } from '@prisma/client';
import { BaseService } from './BaseService';

export class ProfessionalService extends BaseService {
    async getAll() {
        this.logAction('Listagem', 'Profissional');
        return await this.db.profissional.findMany({
            where: {
                empresaId: this.empresaId,
                ativo: true,
            },
            include: { agendamentos: true },
            orderBy: { nome: 'desc' },
        });
    }

    async getById(id: number) {
        this.logAction('Busca por ID', `Profissional ${id}`);

        return await this.db.profissional.findFirst({
            where: {
                id,
                empresaId: this.empresaId,
            },
            include: {
                agendamentos: {
                    where: { isDeleted: false },
                    include: { paciente: true },
                    orderBy: { dataHora: 'desc' }
                }
            },
        });
    }

    async create(data: Partial<Profissional>) {
        if (data.documento) {
            const existing = await this.db.profissional.findFirst({
                where: {
                    documento: data.documento,
                    empresaId: this.empresaId
                }
            });
            if (existing) throw new Error("Documento já cadastrado para outro profissional.");
        }
        return await this.db.profissional.create({
            data: {
                nome: data.nome!,
                documento: data.documento,
                especialidade: data.especialidade,
                telefone: data.telefone,
                empresaId: this.empresaId,
                ativo: true,
            },
        });
    }

    async update(id: number, data: Partial<Profissional>) {
        return await this.db.profissional.update({
            where: {
                id,
                empresaId: this.empresaId
            },
            data,
        });
    }

    async delete(id: number) {
        return await this.db.profissional.update({
            where: {
                id,
                empresaId: this.empresaId
            },
            data: { ativo: false },
        });
    }
}