import { StatusAgendamento } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'


interface SchedulePayload {
  clientName: string;
  clientContact: string;
  timeDate: string;
}

export async function POST(request: Request) {
  try {
    // 1. Obter e Desestruturar o corpo da requisição
    const body: SchedulePayload = await request.json();
    const { clientName, clientContact, timeDate } = body;

    if (!clientName || !clientContact || !timeDate) {
      return NextResponse.json(
        { message: 'Dados incompletos. Nome, telefone e data/hora são obrigatórios.' },
        { status: 400 }
      );
    }

    // Preparação dos dados
    const cleanedPhone = clientContact.replace(/\D/g, '');
    const timeDateObject = new Date(timeDate);

    // Validação básica
    if (isNaN(timeDateObject.getTime())) {
      return NextResponse.json(
        { message: 'Formato de data e hora inválido.' },
        { status: 400 }
      );
    }

    // 2. Encontrar ou Criar o Paciente (usando o telefone como chave única)
    const patient = await prisma.paciente.upsert({
      where: { telefone: cleanedPhone },
      update: { nome: clientName },
      create: {
        nome: clientName,
        telefone: cleanedPhone,
      },
    });

    // 3. Criar o Novo Agendamento
    const newAppointment = await prisma.agendamento.create({
      data: {
        timeDate: timeDateObject,
        statusConfirmacao: StatusAgendamento.PENDENTE,
        pacienteId: patient.id,
      },
    });

    // 4. Acionar o Job de Confirmação (Próximo Passo)
    // Se a confirmação for Imediata: Chamar aqui a rota /api/whatsapp/send
    // Se a confirmação for Agendada: Chamar aqui o serviço de fila (QStash, Cron, etc.)

    // Exemplo de chamada para serviço de fila AGENDADA:
    // await scheduleWhatsappConfirmation({ agendamentoId: novoAgendamento.id, timeDate: timeDateObject });


    return NextResponse.json(
      {
        message: 'Agendamento criado com sucesso!',
        agendamento: newAppointment
      },
      { status: 201 }
    );

  } catch (error: Error | any) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      {
        message: 'Falha interna ao processar o agendamento.',
        error: error.message
      },
      { status: 500 }
    );
  } finally {
    // Em ambientes Serverless, desconectar o cliente Prisma é uma boa prática 
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {

  try {


    const eventsAll = await prisma.agendamento.findMany();

    return NextResponse.json(eventsAll, { status: 200 });

  } catch (error: any) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { message: 'Falha ao buscar dados do NeonDB.', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}