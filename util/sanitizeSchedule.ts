import { StatusConfirmacao } from "@/app/enum/statusConfirmacao";

export function sanitizeSchedule(event: { paciente: { nome: string; telefone: string; email: string; }; statusConfirmacao: StatusConfirmacao; start: string | number | Date; tempoAtendimento: any; tipoAgendamento: string; profissionalId: any; empresaId: any; }) {
  return {
    paciente: {
      nome: event.paciente.nome.trim(),
      telefone: event.paciente.telefone.replace(/\D/g, ""),
      email: event.paciente.email?.trim().toLowerCase() ?? null,
    },
    statusConfirmacao: event.statusConfirmacao as StatusConfirmacao,
    dataHora: new Date(event.start).toISOString(),
    tempoAtendimento: Number(event.tempoAtendimento),
    tipoAgendamento: event.tipoAgendamento?.toUpperCase(),
    professionalId: event.profissionalId ? Number(event.profissionalId) : null,
    empresaId: Number(event.empresaId),
  };
}