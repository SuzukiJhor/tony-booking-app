export interface WuzapiStatus {
    connected: boolean;
    loggedIn: boolean;
    qrcode?: string;
}

export class WuzapiClient {
    private baseUrl: string;
    private token: string;

    constructor(token: string) {
        this.baseUrl = process.env.WUZAPI_URL || "https://wuzapi.tonyv1.cloud";
        this.token = token;
    }

    private async request(path: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                ...options.headers,
                'accept': 'application/json',
                'token': this.token,
            },
            cache: 'no-store',
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error || `Erro na API Wuzapi: ${response.status}`);
        }

        return json;
    }

    async getStatus(): Promise<WuzapiStatus> {
        const res = await this.request('/session/status');
        return {
            connected: !!res.data?.connected,
            loggedIn: !!res.data?.loggedIn,
            qrcode: res.data?.qrcode
        };
    }

    async connect(): Promise<void> {
        await this.request('/session/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Subscribe: ['Message'], Immediate: true }),
        });
    }

    async getQR(): Promise<string> {
        const res = await this.request('/session/qr');
        return res.data?.qrcode ?? '';
    }

    async transmitMessage(number: string, body: string): Promise<any> {
        let num = number.replace(/\D/g, '');

        if (!num.startsWith('55')) num = `55${num}`;

        if (num.length === 13 && num[4] === '9' && ['6', '7', '8', '9'].includes(num[5]))
            num = num.substring(0, 4) + num.substring(5);

        const whatsappPayload = { Phone: num, body: body };

        return await fetch(`${this.baseUrl}/chat/send/text`, {
            method: 'POST',
            headers: {
                "accept": "application/json",
                'token': `${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(whatsappPayload),
        });
    }
}