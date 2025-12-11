import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AgendamentoDTO } from "@/app/dashboard/DTO/AgendamentoDTO";
import { getErrorMessage } from "@/util/errors/get-error-message";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const json = await request.json();

        // Valida e sanitiza os dados enviados
        const data = AgendamentoDTO.partial().parse(json);

        // Atualiza o agendamento
        const updated = await prisma.agendamento.update({
            where: { id: Number(id) },
            data: {
                dataHora: data.dataHora,
                tempoAtendimento: data.tempoAtendimento,
                tipoAgendamento: data.tipoAgendamento as any ?? undefined,
                paciente: data.paciente
                    ? {
                        update: {
                            nome: data.paciente.nome,
                            telefone: data.paciente.telefone,
                            email: data.paciente.email,
                        },
                    }
                    : undefined,
            },
        });

        return NextResponse.json(
            { message: "Agendamento atualizado!", agendamento: updated },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Erro ao buscar agendamentos:", error);

        return NextResponse.json(
            { message: "Falha ao buscar dados do NeonDB.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {

    const params = await context.params;
    const { id } = params;

    try {
        const appointmentId = Number(id);
        if (!appointmentId || Number.isNaN(appointmentId)) {
            return NextResponse.json(
                { message: "ID inválido." },
                { status: 400 }
            );
        }
        const updated = await prisma.agendamento.update({
            where: { id: appointmentId },
            data: {
                isDeleted: true,
            },
        });

        return NextResponse.json(
            { message: "Agendamento removido (soft delete).", agendamento: updated },
            { status: 200 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Erro ao deletar agendamento.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
