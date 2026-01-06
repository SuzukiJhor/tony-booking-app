import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { StatusConfirmacao } from '@/app/enum/statusConfirmacao';

const WHATSAPP_API_URL = process.env.WUZAPI_URL || "https://wuzapi.tonyv1.cloud";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const { number: rawNumber, body, agendamentoId } = await request.json();

    let cleanedNumber = rawNumber.replace(/\D/g, '');

    if (!cleanedNumber.startsWith('55')) {
      cleanedNumber = `55${cleanedNumber}`;
    }
    console.log(`[WhatsApp Dispatch] Iniciando envio para: ${cleanedNumber} (ID: ${agendamentoId})`);

    const agenda = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      select: { empresaId: true }
    });
    const companyId = agenda?.empresaId;

    if (!companyId) {
      console.error('[WhatsApp Dispatch] Empresa não identificada para este agendamento');
      return NextResponse.json({ message: "Company ID not found" }, { status: 400 });
    }

    const settingsData = await prisma.configuracao.findMany({
      where: { empresaId: companyId },
    });

    const settings = settingsData.reduce((acc: any, curr) => {
      acc[curr.chave] = curr.valor || curr.telefone;
      return acc;
    }, {});

    const authToken = settings['WUZAPI_TOKEN'];

    if (!authToken) {
      console.error('[WhatsApp Dispatch] Token wuzapiAuthToken não encontrado nas configurações');
      return NextResponse.json({ message: "Auth Token missing" }, { status: 400 });
    }

    const whatsappPayload = { Phone: cleanedNumber, body: body };
    console.log(`[WhatsApp Dispatch] Chamando: ${WHATSAPP_API_URL}/chat/send/text`);

    const response = await fetch(`${WHATSAPP_API_URL}/chat/send/text`, {
      method: 'POST',
      headers: {
        "accept": "application/json",
        'token': `${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappPayload),
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { rawResponse: responseText };
    }

    if (!response.ok) {
      console.error('[WhatsApp Dispatch] Erro da API Externa:', responseText);
      throw new Error(`API WhatsApp status ${response.status}: ${responseText}`);
    }

    const messageId = responseData?.id || responseData?.key?.id || `sent_${Date.now()}`;
    console.log(`[WhatsApp Dispatch] Mensagem enviada! ID: ${messageId}`);

    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        statusConfirmacao: StatusConfirmacao.MENSAGEM_ENVIADA,
        mensagemId: String(messageId),
        mensagemEnviadaEm: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      messageId,
      duration: `${Date.now() - startTime}ms`
    }, { status: 200 });

  } catch (error: any) {
    console.error('[WhatsApp Dispatch] CRITICAL ERROR:', error.message);
    return NextResponse.json(
      { message: 'Falha no envio', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}