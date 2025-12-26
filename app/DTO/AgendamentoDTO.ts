import { z } from "zod";

export const PacienteDTO = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .transform((v) => v.trim()),
  telefone: z
    .string()
    .min(8, "Telefone inválido")
    .transform((v) => v.replace(/\D/g, "")),
  email: z.string().email().optional().nullable().or(z.literal("")),
});

export const AgendamentoDTO = z.object({
  paciente: PacienteDTO,
  professionalId: z.number().int().nullable(),
  dataHora: z
    .string()
    .datetime("Formato de dataHora inválido")
    .transform((v) => new Date(v)),
  tempoAtendimento: z
    .number()
    .optional()
    .default(60),
  tipoAgendamento: z
    .string()
    .optional()
    .default("CONSULTA")
    .transform((v) => v.toUpperCase()),
  empresaId: z
    .number()
    .min(1, "empresaId é obrigatório"),
  statusConfirmacao: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'MENSAGEM_ENVIADA', 'NAO_CONFIRMADO']),
});

export type AgendamentoPayload = z.infer<typeof AgendamentoDTO>;
