import prisma from '@/lib/prisma';
import { encrypt } from '@/util/crypto-id';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const hoje = new Date();
        const inicioHoje = new Date(hoje);
        inicioHoje.setHours(0, 0, 0, 0);

        const fimHoje = new Date(hoje);
        fimHoje.setHours(23, 59, 59, 999);

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                dataHora: {
                    gte: inicioHoje,
                    lte: fimHoje
                },
                statusConfirmacao: 'PENDENTE',
                mensagemEnviadaEm: null,
                isDeleted: false,
            },
            include: {
                paciente: true,
                profissional: true
            }
        });

        const resultados = [];

        for (const agenda of agendamentos) {
            try {
                const uuid = await encrypt(agenda.id.toString());
                const linkConfirmacao = `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation/${uuid}`;

                const dataAgendamento = agenda.dataHora.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long'
                });

                const horaAgendamento = agenda.dataHora.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const infoPersonal = agenda.paciente?.nome
                    ? `*${agenda.paciente.nome}*`
                    : "";

                const infoProfissional = agenda.profissional?.nome
                    ? ` com o(a) *${agenda.profissional.nome}*`
                    : "";

                const corpoMensagem = `Olá, ${infoPersonal}! 👋

Você tem uma consulta${infoProfissional} agendada para hoje (${dataAgendamento}) às *${horaAgendamento}h*.

✅ *Por favor, confirme sua presença clicando no link abaixo:*
${linkConfirmacao}

📍 *Nosso endereço:*
Rua Cristóvão Colombo, nº 1433, Centro - Alto Paraná.

Muito obrigado(a)! 😊`.trim();

                const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/whatsapp/dispatch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-internal-secret': process.env.CRON_SECRET || ''
                    },
                    body: JSON.stringify({
                        number: agenda.paciente.telefone,
                        body: corpoMensagem,
                        agendamentoId: agenda.id
                    }),
                });

                resultados.push({
                    id: agenda.id,
                    sucesso: sendResponse.ok
                });

            } catch (err: any) {
                console.error(`Falha ao processar agendamento ${agenda.id}:`, err);
                resultados.push({ id: agenda.id, sucesso: false, erro: err.message });
            }
        }

        return NextResponse.json({
            total: agendamentos.length,
            processados: resultados
        });

    } catch (error) {
        console.error('Erro no Cron:', error);
        return NextResponse.json({ error: 'Erro interno no cron' }, { status: 500 });
    }
}