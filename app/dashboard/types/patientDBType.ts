export type DataBasePacienteType = {
    id: number;
    nome: string;
    telefone: string;
    email: string | null;
    empresaId: number;
    agendamentos: {
        profissionalId?: number;
        tempoAtendimento?: string;
        statusConfirmacao: string;
        id: number;
        dataHora: string;
        status: string;
        isDeleted: boolean;
    }[];
};