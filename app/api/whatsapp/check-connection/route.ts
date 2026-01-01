import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
const WUZAPI_BASE_URL = process.env.WUZAPI_URL || "https://wuzapi.tonyv1.cloud";

export async function POST(request: Request) {

    const { companyId } = await request.json();

    if (!companyId) return NextResponse.json({ message: 'Company ID é obrigatório' }, { status: 400 });

    const settingsData = await prisma.configuracao.findMany({
        where: { empresaId: companyId },
    });

    const settings = settingsData.reduce((acc: any, curr) => {
        acc[curr.chave] = curr.valor || curr.telefone;
        return acc;
    }, {});

    const authToken = settings['wuzapiInstance'];
    if (!authToken)
        return NextResponse.json({ message: 'Token de autenticação não encontrado' }, { status: 400 });

    try {
        const response = await fetch(`${WUZAPI_BASE_URL}/session/status`, {
            headers: {
                accept: 'application/json',
                token: authToken!,
            },
            cache: 'no-store',
        });
        const { data, error } = await response.json();

        if (error == 'unauthorized') {
            return NextResponse.json(
                { data: { connected: false }, error: 'unauthorized' },
            );
        }

        if (data?.connected) {
            return NextResponse.json(
                { data: { connected: true } },
            );
        }
        return NextResponse.json(
            { data: { connected: false } },
        );
    } catch (error) {
        console.error('🔥 [ERROR] Erro inesperado WUZAPI:', error)
        return NextResponse.json(
            { data: { connected: false } },
        );
    }
}