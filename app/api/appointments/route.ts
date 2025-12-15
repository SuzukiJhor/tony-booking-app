import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { getErrorMessage } from '@/util/errors/get-error-message';
import { AgendamentoDTO } from '@/app/DTO/AgendamentoDTO';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // valida + sanitiza + tipa
    const data = AgendamentoDTO.parse(json);

    const paciente = await prisma.paciente.upsert({
      where: {
        telefone_empresaId: {
          telefone: data.paciente.telefone,
          empresaId: data.empresaId,
        },
      },
      update: {
        nome: data.paciente.nome,
        email: data.paciente.email,
      },
      create: {
        nome: data.paciente.nome,
        telefone: data.paciente.telefone,
        email: data.paciente.email,
        empresaId: data.empresaId,
      },
    });

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        dataHora: data.dataHora,
        tempoAtendimento: data.tempoAtendimento,
        tipoAgendamento: data.tipoAgendamento as any,
        statusConfirmacao: "PENDENTE",
        pacienteId: paciente.id,
        empresaId: data.empresaId,
      },
    });

    return NextResponse.json(
      { message: "Agendamento criado!", agendamento: novoAgendamento },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Erro ao buscar agendamentos:", error);

    return NextResponse.json(
      { message: "Falha ao buscar dados do NeonDB.", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {

  try {
    const eventsAll = await prisma.agendamento.findMany({
      where: {
        isDeleted: false
      },
      include: {
        paciente: {
          select: {
            nome: true,
            telefone: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(eventsAll, { status: 200 });

  } catch (error: unknown) {
    console.error("Erro ao buscar agendamentos:", error);

    return NextResponse.json(
      { message: "Falha ao buscar dados do NeonDB.", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
