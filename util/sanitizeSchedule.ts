export function sanitizeSchedule(event: any) {
    return {
        paciente: {
            nome: event.paciente.nome.trim(),
            telefone: event.paciente.telefone.replace(/\D/g, ""),
            email: event.paciente.email?.trim().toLowerCase() ?? null,
        },
        dataHora: new Date(event.start).toISOString(),
        tempoAtendimento: Number(event.tempoAtendimento),
        tipoAgendamento: event.tipoAgendamento?.toUpperCase(),
        empresaId: Number(event.empresaId),
    };
}