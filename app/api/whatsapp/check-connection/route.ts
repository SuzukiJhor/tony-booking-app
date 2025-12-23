import { NextResponse } from "next/server";

const WUZAPI_BASE_URL = process.env.WUZAPI_URL || "https://wuzapi.tonyv1.cloud";
const WUZAPI_ADMIN_TOKEN = process.env.WUZAPI_ADMIN_TOKEN!;

export async function GET() {
    if (!WUZAPI_ADMIN_TOKEN)
        return NextResponse.json(
            { status: 'error', message: 'Configuração do servidor ausente (Token).' },
            { status: 500 }
        );

    try {
        const response = await fetch(`${WUZAPI_BASE_URL}/session/status`, {
            headers: {
                accept: 'application/json',
                token: WUZAPI_ADMIN_TOKEN!,
            },
            cache: 'no-store',
        });
        const { data } = await response.json();

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