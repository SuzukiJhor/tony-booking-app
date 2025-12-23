import { ProfissionalDTO } from '@/app/DTO/ProfessionalDTO';
import prisma from '@/lib/prisma'
import { getErrorMessage } from '@/util/errors/get-error-message';
import { NextResponse } from 'next/server';
import * as z from 'zod';

export async function GET(request: Request) {
    try {
        const profissionaisAll = await prisma.profissional.findMany({
            include: {
                agendamentos: true,
            },
            orderBy: [
                {
                    ativo: 'desc',
                },
                {
                    nome: 'asc',
                }
            ],
        });

        return NextResponse.json(profissionaisAll, { status: 200 });

    } catch (error: unknown) {
        console.error("Erro ao buscar profissionais:", error);

        return NextResponse.json(
            { message: "Falha ao buscar dados do NeonDB.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = ProfissionalDTO.parse(body);

        const newProfessional = await prisma.profissional.create({
            data: {
                nome: validatedData.nome,
                documento: validatedData.documento,
                especialidade: validatedData.especialidade,
                telefone: validatedData.telefone,
                ativo: validatedData.ativo,
                empresaId: validatedData.empresaId,
            },
        });

        return NextResponse.json(newProfessional, { status: 201 });

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Erro de validação nos dados enviados.",
                    errors: (error as z.ZodError<any>).flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { message: "Já existe um profissional com este documento nesta empresa." },
                { status: 409 }
            );
        }

        console.error("Erro ao criar profissional:", error);
        return NextResponse.json(
            {
                message: "Falha ao criar profissional no banco de dados.",
                error: getErrorMessage(error)
            },
            { status: 500 }
        );
    }
}