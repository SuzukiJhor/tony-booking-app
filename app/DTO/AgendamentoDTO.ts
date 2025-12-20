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
  email: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim().toLowerCase() : null)),
});

export const AgendamentoDTO = z.object({
  paciente: PacienteDTO,
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
});
  
export type AgendamentoPayload = z.infer<typeof AgendamentoDTO>;
