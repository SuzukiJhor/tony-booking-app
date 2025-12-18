import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { enviarWhatsApp } from '@/lib/evolution';

/**
 * Configurações
 */
const CRON_LOCK_KEY = 'cron:dispatch-appointments';
const CRON_LOCK_TTL = 300; // 5 minutos
const MAX_PER_EXECUTION = 20; // evita timeout
const WINDOW_MINUTES = 10; // janela de envio

export async function POST() {
    /**
     * 🔐 Segurança básica (opcional, mas recomendado)
     * Use um secret para evitar chamadas externas
     */
    const cronSecret = headers().get('x-cron-secret');
    if (
        process.env.NODE_ENV === 'production' &&
        cronSecret !== process.env.CRON_SECRET
    ) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    /**
     * 🔒 Lock distribuído (Upstash Redis)
     * Evita duas execuções simultâneas
     */
    const locked = await redis.set(CRON_LOCK_KEY, '1', {
        nx: true,
        ex: CRON_LOCK_TTL,
    });

    if (!locked) {
        return NextResponse.json({ skipped: true, reason: 'locked' });
    }

    try {
        /**
         * ⏰ Janela de execução
         * Busca agendamentos que devem disparar agora
         */
        const now = new Date();
        const windowEnd = new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000);

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                statusConfirmacao: 'PENDENTE',
                isDeleted: false,
                dataHora: {
                    lte: windowEnd,
                },
            },
            include: {
                paciente: true,
                empresa: true,
            },
            orderBy: {
                dataHora: 'asc',
            },
            take: MAX_PER_EXECUTION,
        });

        let enviados = 0;
        let erros = 0;

        for (const agendamento of agendamentos) {
            try {
                /**
                 * 📩 Monta mensagem
                 */
                const mensagem = montarMensagem(agendamento);

                /**
                 * 📲 Envia WhatsApp (EvolutionAPI)
                 */
                const response = await enviarWhatsApp({
                    empresaId: agendamento.empresaId,
                    telefone: agendamento.paciente.telefone,
                    mensagem,
                });

                /**
                 * ✅ Idempotência forte
                 * Só atualiza se ainda estiver PENDENTE
                 */
                const updated = await prisma.agendamento.updateMany({
                    where: {
                        id: agendamento.id,
                        statusConfirmacao: 'PENDENTE',
                    },
                    data: {
                        statusConfirmacao: 'MENSAGEM_ENVIADA',
                        mensagemEnviadaEm: new Date(),
                        mensagemId: response.messageId ?? null,
                    },
                });

                if (updated.count > 0) {
                    enviados++;
                }
            } catch (error: any) {
                erros++;

                console.error(
                    `[CRON][AGENDAMENTO ${agendamento.id}]`,
                    error?.message || error
                );

                // (Opcional) log em tabela de auditoria
                await prisma.logMensagem?.create?.({
                    data: {
                        agendamentoId: agendamento.id,
                        empresaId: agendamento.empresaId,
                        status: 'ERRO',
                        erro: error?.message ?? 'Erro desconhecido',
                    },
                });
            }
        }

        return NextResponse.json({
            ok: true,
            total: agendamentos.length,
            enviados,
            erros,
        });
    } finally {
        /**
         * 🔓 Libera o lock
         */
        await redis.del(CRON_LOCK_KEY);
    }
}

/**
 * 🧠 Função de montagem de mensagem
 * Centralize isso para facilitar ajustes futuros
 */
function montarMensagem(agendamento: any) {
    const nome = agendamento.paciente.nome;
    const data = agendamento.dataHora.toLocaleDateString('pt-BR');
    const hora = agendamento.dataHora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        `Olá ${nome}! 👋\n\n` +
        `Lembrando da sua *consulta* agendada para:\n` +
        `📅 ${data}\n` +
        `⏰ ${hora}\n\n` +
        `Por favor, responda:\n` +
        `👉 *SIM* para confirmar\n` +
        `👉 *NÃO* para cancelar`
    );
}
