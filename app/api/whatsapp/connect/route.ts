import { NextResponse } from 'next/server';

const WUZAPI_BASE_URL = process.env.WUZAPI_URL!;
const MAX_WAIT_TIME = 20000; // 20s
const POLL_INTERVAL = 2000;  // 2s

export async function GET() {
    const start = Date.now();

    console.log('🟢 [API] /api/whatsapp/connect iniciado');

    try {
        let status = await checkStatusConnected('initial');

        if (!status.ok) {
            console.error('❌ [STATUS] Erro ao obter status inicial', status);
            return NextResponse.json(
                { error: 'Erro ao obter status' },
                { status: status.status }
            );
        }

        console.log('📡 [STATUS] Inicial:', status.data);
        if (!status.data.connected) {
            console.log('🔄 [CONNECT] Sessão não conectada. Chamando /session/connect');
            await connectSession();
        }

        while (Date.now() - start < MAX_WAIT_TIME) {
            status = await checkStatusConnected('polling');
            const { connected, loggedIn, qrcode } = status.data;

            if (qrcode) {
                console.log('🟩 [QR] QR encontrado no /session/status');
                return NextResponse.json({
                    status: 'AWAITING_QR',
                    qrCode: qrcode,
                });
            }

            if (loggedIn) {
                console.log('✅ [SUCCESS] WhatsApp autenticado com sucesso');
                return NextResponse.json({
                    status: 'CONNECTED',
                    message: 'WhatsApp já está conectado',
                });
            }

            if (connected && !loggedIn) {
                console.log('📸 [QR] Buscando QR Code');
                const qrCode = await fetchQRCode();

                if (qrCode) {
                    console.log('🟩 [QR] QR Code obtido');
                    return NextResponse.json({
                        status: 'AWAITING_QR',
                        qrCode,
                    });
                } else {
                    console.log('🟨 [QR] QR ainda não disponível');
                }
            }

            console.log(`⏳ [WAIT] Aguardando ${POLL_INTERVAL}ms`);
            await sleep(POLL_INTERVAL);
        }

        console.warn('⌛ [TIMEOUT] Tempo máximo excedido, QR não disponível');

        return NextResponse.json({
            status: 'PENDING',
            message: 'Sessão iniciada, QR ainda não disponível',
        });

    } catch (error) {
        console.error('🔥 [ERROR] Erro inesperado WUZAPI:', error);

        return NextResponse.json(
            { error: 'Erro interno ao conectar com WUZAPI' },
            { status: 500 }
        );
    }
}

async function checkStatusConnected(context: string) {
    console.log(`📡 [STATUS:${context}] GET /session/status`);

    const response = await fetch(`${WUZAPI_BASE_URL}/session/status`, {
        headers: {
            accept: 'application/json',
            token: process.env.WUZAPI_ADMIN_TOKEN!,
        },
        cache: 'no-store',
    });

    const json = await response.json();

    console.log(`📡 [STATUS:${context}] Response`, {
        ok: response.ok,
        status: response.status,
        data: json.data,
    });

    return {
        ok: response.ok,
        status: response.status,
        data: json.data,
    };
}

async function connectSession() {
    console.log('🔌 [CONNECT] POST /session/connect');

    const response = await fetch(`${WUZAPI_BASE_URL}/session/connect`, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            token: process.env.WUZAPI_ADMIN_TOKEN!,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Subscribe: ['Message', 'ChatPresence'],
            Immediate: true,
        }),
    });

    console.log('🔌 [CONNECT] Response', {
        ok: response.ok,
        status: response.status,
    });
}

async function fetchQRCode(): Promise<string> {
    console.log('📸 [QR] GET /session/qr');

    const response = await fetch(`${WUZAPI_BASE_URL}/session/qr`, {
        headers: {
            accept: 'application/json',
            token: process.env.WUZAPI_ADMIN_TOKEN!,
        },
        cache: 'no-store',
    });

    const json = await response.json();

    console.log('📸 [QR] Response', {
        ok: response.ok,
        status: response.status,
        hasQr: Boolean(json?.data?.qrcode),
    });

    return json?.data?.qrcode ?? '';
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
