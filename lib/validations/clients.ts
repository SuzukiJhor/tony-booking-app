import { z } from "zod";

const emptyToOptional = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().optional()
);

export const CreatePatientSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(8, "Telefone inválido ou muito curto"),
  email: emptyToOptional.pipe(
    z.string().email("Formato de e-mail inválido").optional()
  ),
  isDeleted: z.boolean().default(false),
});

export const UpdatePatientSchema = CreatePatientSchema.partial().extend({
  id: z.coerce.number().positive("ID do paciente é obrigatório"),
});

export const DeletePatientSchema = z.object({
  id: z.coerce.number().positive("ID inválido para exclusão"),
});

export const GetPatientSchema = z.object({
  id: z.coerce.number().positive("ID inválido"),
});