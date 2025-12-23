import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Não autorizado', { status: 401 });
    // }

    try {
        // 2. Definir janela: Agendamentos de AMANHÃ
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const inicioAmanha = new Date(amanha.setHours(0, 0, 0, 0));
        const fimAmanha = new Date(amanha.setHours(23, 59, 59, 999));
        console.log('Janela de agendamentos:', inicioAmanha, fimAmanha);
        const agendamentos = await prisma.agendamento.findMany({
            where: {
                dataHora: { gte: inicioAmanha, lte: fimAmanha },
                statusConfirmacao: 'PENDENTE',
                isDeleted: false,
            },
            include: {
                paciente: true,
            }
        });

        return NextResponse.json({
            processados: agendamentos.length,
            detalhes: agendamentos
        });

    } catch (error) {
        return NextResponse.json({ error: 'Erro interno no cron' }, { status: 500 });
    }
}