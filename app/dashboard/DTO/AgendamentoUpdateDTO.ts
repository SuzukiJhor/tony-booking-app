import { z } from "zod";

export const AgendamentoUpdateDTO = z.object({
    id: z.number().int().positive(), // obrigatório para editar

    dataHora: z.coerce.date().optional(),
    tempoAtendimento: z.number().min(1).optional(),
    tipoAgendamento: z.string().optional(),

    empresaId: z.number().int().positive(),

    paciente: z.object({
        nome: z.string().trim().min(1).optional(),
        telefone: z.string().regex(/^\d+$/).optional(),
        email: z.string().email().trim().optional(),
    }).optional(),
});

export type AgendamentoUpdateType = z.infer<typeof AgendamentoUpdateDTO>;
