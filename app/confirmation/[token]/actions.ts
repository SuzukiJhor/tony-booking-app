'use server'

import prisma from '@/lib/prisma';
import { decrypt } from '@/util/crypto-id';
import { StatusAgendamento } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function processConfirmation(formData: FormData): Promise<void> {
  const action = formData.get('action') as string;
  const token = formData.get('uuid') as string;
  try {
    const decodedToken = decodeURIComponent(token);
    const idReal = await decrypt(decodedToken);
    if (!idReal)
      return console.error('Erro na Action: idReal inválido');
    await prisma.agendamento.update({
      where: { id: parseInt(idReal) },
      data: { statusConfirmacao: action as StatusAgendamento },
    });

    revalidatePath(`/confirmation/${token}`);
  } catch (error) {
    console.error('Erro na Action:', error);
  }
}