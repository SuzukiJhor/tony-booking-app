import { z } from "zod";

export const ProfissionalDTO = z.object({
    nome: z
        .string()
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .transform((v) => v.trim()),

    documento: z
        .string()
        .min(1, "Documento (CRM/CRO/CPF) é obrigatório")
        .transform((v) => v.trim().toUpperCase()),

    especialidade: z
        .string()
        .optional()
        .transform((v) => (v ? v.trim() : "Clínico Geral")),

    telefone: z
        .string()
        .optional()
        .transform((v) => (v ? v.replace(/\D/g, "") : null)),

    ativo: z
        .boolean()
        .optional()
        .default(true),

    empresaId: z
        .number()
        .min(1, "empresaId inválido"),
});

export type ProfissionalPayload = z.infer<typeof ProfissionalDTO>;