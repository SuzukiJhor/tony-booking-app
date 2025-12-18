import { PrismaClient, StatusAgendamento } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_AUTH_TOKEN = process.env.WHATSAPP_AUTH_TOKEN;

export async function POST(request: Request) {
  try {
    // Segurança: checar token do Cron/Fila
    const token = request.headers.get('Authorization');
    if (token !== `Bearer ${process.env.INTERNAL_JOB_TOKEN}`) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { agendamentoId } = await request.json();

    if (!agendamentoId) {
      return NextResponse.json({ message: 'ID do agendamento é obrigatório.' }, { status: 400 });
    }

    // Buscar Agendamento e Paciente no NeonDB
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { paciente: true },
    });

    if (!agendamento || agendamento.statusConfirmacao !== StatusAgendamento.PENDENTE) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou já processado.' }, { status: 404 });
    }

    const { paciente } = agendamento;

    // Preparar e Enviar a Mensagem
    const dataFormatada = agendamento.dataHora.toLocaleDateString('pt-BR');
    const horaFormatada = agendamento.dataHora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const mensagem = `Olá, ${paciente.nome}! Lembrete: Sua consulta é dia ${dataFormatada} às ${horaFormatada}. Confirme respondendo **SIM** ou cancele respondendo **NAO**.`;

    const whatsappPayload = {
      to: paciente.telefone, // E.164
      body: mensagem,
    };

    // Enviar usando fetch
    const response = await fetch(`${WHATSAPP_API_URL}/message/sendText`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API WhatsApp: ${errorText}`);
    }

    const responseData = await response.json();
    const messageId = responseData?.messageId || 'MOCK_ID_' + Date.now();

    // Atualizar o Status do Agendamento no NeonDB
    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        statusConfirmacao: StatusAgendamento.MENSAGEM_ENVIADA,
        mensagemId: messageId,
        mensagemEnviadaEm: new Date(),
      },
    });

    return NextResponse.json({ success: true, messageId }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao enviar mensagem via WhatsApp:', error);
    return NextResponse.json(
      { message: 'Falha no envio da mensagem', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
