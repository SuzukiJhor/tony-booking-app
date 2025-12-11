import { StatusConfirmacao } from "@/app/enum/statusConfirmacao";

export interface AgendamentoPayload {
    paciente: {
        nome: string;
        telefone: string;
        email?: string | null;
    };
    dataHora: string;
    statusConfirmacao: StatusConfirmacao;
    tempoAtendimento: number;
    tipoAgendamento: string;
    empresaId: number;
}