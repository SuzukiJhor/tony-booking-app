import { StatusAgendamento } from '@prisma/client';
import { PrismaClient } from '@prisma/client/extension';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

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
  // 1. Proteção da Rota (Apenas usuários autenticados podem buscar dados)
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    
    // Filtros de Data: O Frontend passará o início e o fim do período de visualização
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let whereClause: any = {};

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      // Filtra os agendamentos cuja dataHora esteja dentro do intervalo [start, end]
      whereClause.dataHora = {
        gte: startDate, // Greater Than or Equal (Maior ou Igual a data de início)
        lt: endDate,    // Less Than (Menor que a data de fim)
      };
    }
    
    // 2. Buscar Agendamentos no NeonDB usando Prisma
    const agendamentos = await prisma.agendamento.findMany({
      where: whereClause,
      // Inclui os dados do Paciente associado para exibição no calendário
      include: {
        paciente: {
          select: {
            nome: true,
            telefone: true,
          }
        },
      },
      // Ordena por data e hora para facilitar a visualização
      orderBy: {
        dataHora: 'asc',
      }
    });
    
    // 3. Formatar os dados para o Frontend
    const agendamentosFormatados = agendamentos.map(ag => ({
      id: ag.id,
      title: `${ag.paciente.nome} (${ag.paciente.telefone})`, // Título para o calendário
      start: ag.dataHora, // Data de início do evento
      end: ag.dataHora,   // Em consultas pontuais, start = end
      status: ag.statusConfirmacao,
      pacienteNome: ag.paciente.nome,
    }));

    return NextResponse.json(agendamentosFormatados, { status: 200 });

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