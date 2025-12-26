import { StatusConfirmacao } from "@/app/enum/statusConfirmacao";
import { TipoAgendamento } from "@prisma/client";

export interface DataBaseEventType {
    id: number;
    dataHora: string | Date;
    statusConfirmacao: StatusConfirmacao;
    mensagemEnviadaEm?: string | null;
    mensagemId?: string | null;
    pacienteId?: number;
    profissionalId?: number;
    paciente: PacienteEventInfo;
    empresaId: number;
    tipoAgendamento: TipoAgendamento;
    tempoAtendimento: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PacienteEventInfo {
    nome: string;
    telefone: string | null;
    email: string | null;
}