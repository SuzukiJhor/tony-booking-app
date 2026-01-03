import { z } from "zod";

const emptyToOptional = z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().optional()
);

export const PacienteDTO = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    telefone: z.string().min(8, "Telefone inválido ou muito curto"),
    email: emptyToOptional.pipe(
        z.string().email("Formato de e-mail inválido").optional()
    ),
});

const StatusAgendamento = z.enum(["PENDENTE", "CONFIRMADO", "MENSAGEM_ENVIADA", "NAO_CONFIRMADO", "CANCELADO"]);
const TipoAgendamento = z.enum(["CONSULTA", "RETORNO", "EXAME"]);

export const CreateScheduleSchema = z.object({
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
    tipoAgendamento: TipoAgendamento
        .optional()
        .default("CONSULTA"),
    empresaId: z
        .number()
        .min(1, "empresaId é obrigatório"),
    statusConfirmacao: StatusAgendamento.default("PENDENTE"),
});

export const UpdateScheduleSchema = CreateScheduleSchema.partial().extend({
    id: z.coerce.number().positive(),
});

export const DeleteScheduleSchema = z.object({
    id: z.coerce.number().positive("ID inválido"),
});

export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof UpdateScheduleSchema>;