import { z } from "zod";

const emptyToOptional = z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().optional()
);
export const CreateProfessionalSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    documento: emptyToOptional,
    especialidade: emptyToOptional,
    telefone: emptyToOptional.pipe(
        z.string().min(10, "O telefone deve ter no mínimo 10 caracteres").optional()
    ),
    ativo: z.boolean().default(true),
});

export const UpdateProfessionalSchema = CreateProfessionalSchema.partial().extend({
    id: z.coerce.number().positive(),
});

export const DeleteProfessionalSchema = z.object({
    id: z.coerce.number().positive("ID inválido"),
});