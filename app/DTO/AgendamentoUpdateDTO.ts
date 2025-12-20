import { z } from "zod";

export const AgendamentoUpdateDTO = z.object({
    id: z.number().int().positive(),
    dataHora: z.coerce.date().optional(),
    tempoAtendimento: z.number().min(1).optional(),
    tipoAgendamento: z.string().optional(),
    empresaId: z.number().int().positive(),
    statusConfirmacao: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'MENSAGEM_ENVIADA', 'NAO_CONFIRMADO']),
    paciente: z.object({
        nome: z.string().trim().min(1).optional(),
        telefone: z.string().regex(/^\d+$/).optional(),
        email: z.string().trim().optional(),
    }).optional(),
});

export type AgendamentoUpdateType = z.infer<typeof AgendamentoUpdateDTO>;
