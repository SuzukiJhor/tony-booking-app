import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getErrorMessage } from "@/util/errors/get-error-message";
import { ProfissionalDTO } from '@/app/DTO/ProfessionalDTO';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

    const professional = await prisma.profissional.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            agendamentos: {
                where: {
                    isDeleted: false
                },
                include: {
                    paciente: true
                },
                orderBy: {
                    dataHora: 'desc'
                }
            },
        },
    });

    if (!professional) {
        return NextResponse.json(
            { message: "Profissional não encontrado." },
            { status: 404 }
        );
    }

    return NextResponse.json(professional, { status: 200 });

} catch (error: unknown) {
    console.error(`Erro ao buscar profissional ${params.id}:`, error);

    return NextResponse.json(
        { message: "Falha ao buscar dados no servidor.", error: getErrorMessage(error) },
        { status: 500 }
    );
}
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const json = await request.json();

        const data = ProfissionalDTO.partial().parse(json);

        const updated = await prisma.profissional.update({
            where: { id: Number(id) },
            data: {
                nome: data.nome,
                documento: data.documento,
                especialidade: data.especialidade,
                telefone: data.telefone,
                ativo: data.ativo,
                empresaId: data.empresaId,
            },
        });

        return NextResponse.json(
            { message: "Profissional atualizado!", profissional: updated },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Erro ao atualizar profissional:", error);

        if (typeof error === "object" && error !== null && "flatten" in error) {
            return NextResponse.json(
                { message: "Dados inválidos.", errors: (error as any).flatten().fieldErrors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Falha ao atualizar dados no NeonDB.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const professionalId = Number(id);

        if (!professionalId || Number.isNaN(professionalId)) {
            return NextResponse.json(
                { message: "ID inválido." },
                { status: 400 }
            );
        }

        const existingProfessional = await prisma.profissional.findUnique({
            where: { id: professionalId },
            select: { ativo: true }
        });

        if (!existingProfessional) {
            return NextResponse.json(
                { message: "Profissional não encontrado." },
                { status: 404 }
            );
        }

        if (existingProfessional.ativo === false) {
            return NextResponse.json(
                { message: "Este profissional já se encontra inativo." },
                { status: 400 }
            );
        }

        const deleted = await prisma.profissional.update({
            where: { id: professionalId },
            data: { ativo: false },
        });

        return NextResponse.json(
            { message: "Profissional desativado com sucesso.", profissional: deleted },
            { status: 200 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Erro ao deletar profissional.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}