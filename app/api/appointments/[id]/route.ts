'use server';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/util/errors/get-error-message";
import { AgendamentoUpdateDTO } from "@/app/DTO/AgendamentoUpdateDTO";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const json = await request.json();
        const data = AgendamentoUpdateDTO.partial().parse(json);

        const updated = await prisma.agendamento.update({
            where: { id: Number(id) },
            data: {
                dataHora: data.dataHora,
                tempoAtendimento: data.tempoAtendimento,
                tipoAgendamento: data.tipoAgendamento as any ?? undefined,
                statusConfirmacao: data.statusConfirmacao as any ?? undefined,
                profissional: data.professionalId
                    ? { connect: { id: Number(data.professionalId) } }
                    : undefined,
                paciente: data.paciente
                    ? {
                        update: {
                            nome: data.paciente.nome,
                            telefone: data.paciente.telefone,
                            email: data.paciente.email ?? undefined,
                        },
                    }
                    : undefined,
            },
        });

        return NextResponse.json(
            { message: "Agendamento atualizado com sucesso!", agendamento: updated },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Erro ao buscar agendamentos:", error);

        return NextResponse.json(
            { message: "Falha ao atualizar agendamento.", error: getErrorMessage(error) },
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
