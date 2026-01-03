import { Agendamento, StatusAgendamento } from '@prisma/client';
import { BaseService } from './BaseService';
import { AgendamentoUpdateDTO } from '../DTO/AgendamentoUpdateDTO';
import { TipoAgendamento } from "@/app/enum/tipoAgendamento";

export class ScheduleService extends BaseService {

    async getAll() {
        this.logAction('Listagem', 'Agendamento');
        return await this.db.agendamento.findMany({
            where: {
                empresaId: this.empresaId,
                isDeleted: false,
            },
            include: {
                paciente: {
                    select: { nome: true, telefone: true, email: true }
                },
                profissional: {
                    select: {
                        id: true,
                        nome: true,
                        especialidade: true,
                        documento: true,
                        ativo: true
                    }
                }
            },
            orderBy: { dataHora: 'asc' },
        });
    }

    async getById(id: number) {
        this.logAction('Busca por ID', `Agendamento ${id}`);
        return await this.db.agendamento.findFirst({
            where: {
                id,
                empresaId: this.empresaId,
                isDeleted: false
            },
            include: {
                paciente: true,
                profissional: true
            }
        });
    }

    async create(data: any) {
        this.logAction('Criação', 'Agendamento');

        if (data.dataHora && data.profissionalId) {
            const conflitScheduleProfissional = await this.db.agendamento.findFirst({
                where: {
                    empresaId: this.empresaId,
                    profissionalId: data.profissionalId,
                    dataHora: data.dataHora,
                    isDeleted: false
                }
            });
            if (conflitScheduleProfissional)
                throw new Error('O profissional já possui um agendamento neste horário.');
        }

        if (data.paciente.email) {
            const emailExists = await this.db.paciente.findFirst({
                where: {
                    email: data.paciente.email,
                    empresaId: this.empresaId,
                    isDeleted: false,
                    NOT: { telefone: data.paciente.telefone }
                }
            });
            if (emailExists) throw new Error("Este e-mail já pertence a outro paciente cadastrado.");
        }

        const paciente = await this.db.paciente.upsert({
            where: {
                telefone_empresaId: {
                    telefone: data.paciente.telefone,
                    empresaId: this.empresaId,
                },
            },
            update: {
                nome: data.paciente.nome,
                email: data.paciente.email,
            },
            create: {
                nome: data.paciente.nome,
                telefone: data.paciente.telefone,
                email: data.paciente.email,
                empresaId: this.empresaId,
            },
        });

        const profissional = data.professionalId
            ? await this.db.profissional.findUnique({
                where: {
                    id: data.professionalId,
                },
                select: { id: true },
            })
            : null;

        return await this.db.agendamento.create({
            data: {
                dataHora: data.dataHora,
                tempoAtendimento: data.tempoAtendimento,
                tipoAgendamento: data.tipoAgendamento as any,
                statusConfirmacao: data.statusConfirmacao as any ?? "PENDENTE",
                pacienteId: paciente.id,
                empresaId: data.empresaId,
                profissionalId: profissional?.id,
            },
        });
    }

    async update(id: number, dataSchedule: Partial<Agendamento>) {
        this.logAction('Atualização', `Agendamento ${id}`);
        const data = AgendamentoUpdateDTO.partial().parse(dataSchedule);
        return await this.db.agendamento.update({
            where: {
                id: data.id,
                empresaId: this.empresaId
            },
            data: {
                dataHora: data.dataHora ? new Date(data.dataHora) : undefined,
                statusConfirmacao: data.statusConfirmacao as StatusAgendamento ?? undefined,
                profissional: data.professionalId
                    ? { connect: { id: Number(data.professionalId) } }
                    : undefined,
                tipoAgendamento: data.tipoAgendamento as TipoAgendamento ?? undefined,
                tempoAtendimento: data.tempoAtendimento,
                paciente: data.paciente
                    ? {
                        update: {
                            nome: data.paciente.nome,
                            telefone: data.paciente.telefone,
                            email: data.paciente.email ?? undefined,
                        },
                    }
                    : undefined,
            },
        });
    }

    async delete(id: number) {
        this.logAction('Exclusão Lógica', `Agendamento ${id}`);
        return await this.db.agendamento.update({
            where: {
                id,
                empresaId: this.empresaId
            },
            data: { isDeleted: true },
        });
    }

    /**
     * Busca agendamentos por um intervalo de datas (Útil para o Calendário)
     */
    async getByRange(start: Date, end: Date) {
        return await this.db.agendamento.findMany({
            where: {
                empresaId: this.empresaId,
                isDeleted: false,
                dataHora: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                paciente: { select: { nome: true } },
                profissional: { select: { nome: true } }
            }
        });
    }
}