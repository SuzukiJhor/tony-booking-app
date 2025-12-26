import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Não autorizado', { status: 401 });
    // }

    try {
        const hoje = new Date();       
        const inicioHoje = new Date(hoje);
        inicioHoje.setHours(0, 0, 0, 0);

        // Configuramos o fim do dia (23:59:59)
        const fimHoje = new Date(hoje);
        fimHoje.setHours(23, 59, 59, 999);

        console.log('Buscando agendamentos entre:', inicioHoje.toISOString(), 'e', fimHoje.toISOString());

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                dataHora: {
                    gte: inicioHoje,
                    lte: fimHoje
                },
                statusConfirmacao: 'PENDENTE',
                isDeleted: false,
            },
            include: {
                paciente: true,
                profissional: true
            }
        });

        return NextResponse.json({
            processados: agendamentos.length,
            hoje: inicioHoje.toLocaleDateString('pt-BR'),
            detalhes: agendamentos
        });

    } catch (error) {
        console.error('Erro no Cron:', error);
        return NextResponse.json({ error: 'Erro interno no cron' }, { status: 500 });
    }
}