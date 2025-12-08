// app/api/whatsapp/send/route.ts

import { PrismaClient, StatusAgendamento } from '@prisma/client';
import { NextResponse } from 'next/server';
// Use 'axios' ou a biblioteca oficial do seu provedor (Meta, Twilio, etc.)
import axios from 'axios'; 

const prisma = new PrismaClient();
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_AUTH_TOKEN = process.env.WHATSAPP_AUTH_TOKEN;

export async function POST(request: Request) {
  try {
    // 1. **SEGURANÇA**: Implementar aqui uma chave secreta/validação para garantir que
    // a chamada veio do seu Cron Job/Fila, e não de um invasor externo.
    // Ex: if (request.headers.get('Authorization') !== `Bearer ${process.env.INTERNAL_JOB_TOKEN}`) { ... }

    const { agendamentoId } = await request.json();

    if (!agendamentoId) {
      return NextResponse.json({ message: 'ID do agendamento é obrigatório.' }, { status: 400 });
    }

    // 2. Buscar Agendamento e Paciente no NeonDB
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { paciente: true },
    });

    if (!agendamento || agendamento.statusConfirmacao !== StatusAgendamento.PENDENTE) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou já processado.' }, { status: 404 });
    }

    const { paciente } = agendamento;

    // 3. Preparar e Enviar a Mensagem
    const dataFormatada = agendamento.dataHora.toLocaleDateString('pt-BR');
    const horaFormatada = agendamento.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // NOTE: Sempre use o formato de telefone padrão E.164 (ex: +5511999999999)
    const mensagem = `Olá, ${paciente.nome}! Lembrete: Sua consulta é dia ${dataFormatada} às ${horaFormatada}. Confirme respondendo **SIM** ou cancele respondendo **NAO**.`;

    const whatsappPayload = {
        // Ajuste este payload para o formato exato da API que você está usando
        to: paciente.telefone,
        body: mensagem,
    };

    const apiResponse = await axios.post(WHATSAPP_API_URL, whatsappPayload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const messageId = apiResponse.data?.messageId || 'MOCK_ID_' + Date.now(); 

    // 4. Atualizar o Status do Agendamento no NeonDB
    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        statusConfirmacao: StatusAgendamento.MENSAGEM_ENVIADA,
        mensagemId: messageId,
        mensagemEnviadaEm: new Date(),
      },
    });

    return NextResponse.json({ success: true, messageId }, { status: 200 });

  } catch (error) {
    console.error('Erro ao enviar mensagem via WhatsApp:', error);
    // Se o envio falhar, mantemos o status PENDENTE para tentar novamente mais tarde
    return NextResponse.json({ message: 'Falha no envio da mensagem', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}