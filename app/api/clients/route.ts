import prisma from '@/lib/prisma'
import { getErrorMessage } from '@/util/errors/get-error-message';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

    try {
        const pacientsAll = await prisma.paciente.findMany({
            include: {
                agendamentos: true,
            },
        });

        return NextResponse.json(pacientsAll, { status: 200 });

    } catch (error: unknown) {
        console.error("Erro ao buscar agendamentos:", error);

        return NextResponse.json(
            { message: "Falha ao buscar dados do NeonDB.", error: getErrorMessage(error) },
            { status: 500 }
        );
    }
}