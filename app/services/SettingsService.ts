import { WuzapiClient } from '../api-client/wuzapi-client';
import { BaseService } from './BaseService';

export enum ConnectionStatusEnum {
    LOADING = 'loading',
    CONNECTED = 'connected',
    ERROR = 'error',
    DISCONNECTED = 'disconnected',
    LOGGED_OUT = 'logged-out',
    AWAITING_QR = 'awaiting-qr',
    PENDING = 'pending',
}

export class SettingsService extends BaseService {

    async getCompanyPhone() {
        this.logAction('Listagem', 'Telefone da Empresa');
        const settingsData = await this.db.configuracao.findMany({
            where: {
                empresaId: this.empresaId,
            },
        });
        const mainConfig = settingsData[0];
        return { mainPhone: mainConfig?.telefone || null }
    }

    async setCompanyPhone(phone: string) {
        this.logAction('Atualização', 'Define novo telefone');
        if (!phone) throw new Error('O telefone é obrigatório.');
        const cleanPhone = phone.replace(/\D/g, "");
        const updatedSetting = await this.db.configuracao.upsert({
            where: {
                chave_empresaId: {
                    chave: "WUZAPI_TOKEN",
                    empresaId: this.empresaId,
                },
            },
            update: {
                telefone: cleanPhone,
            },
            create: {
                chave: "WUZAPI_TOKEN",
                telefone: cleanPhone,
                empresaId: this.empresaId,
            },
        });
        return { success: true, data: updatedSetting };
    }

    async fetchToken() {
        this.logAction('Buscar', 'Token de autenticação');
        const settingsData = await this.db.configuracao.findMany({
            where: { empresaId: this.empresaId },
        });
        const settings = settingsData.reduce((acc: any, curr) => {
            acc[curr.chave] = curr.valor || curr.telefone;
            return acc;
        }, {});
        const authToken = settings['WUZAPI_TOKEN'];
        if (!authToken)
            throw new Error("Token de autenticação não encontrado");
        return authToken;
    }

    async checkConnectionWpp() {
        this.logAction('Verificar', 'Conexão com o WhatsApp');
        const authToken = await this.fetchToken();
        const wpp = new WuzapiClient(authToken);
        try {
            const status = await wpp.getStatus();
            return { data: status };
        } catch (error) {
            console.error('🔥 [ERROR] Erro inesperado WUZAPI:', error);
            return {
                success: false,
                data: { status: 'unauthorized' }
            };
        }
    }

    async connectAndPollStatus() {
        this.logAction('Conexão', 'Iniciando polling de conexão WhatsApp');

        const authToken = await this.fetchToken();
        const wpp = new WuzapiClient(authToken);

        const MAX_WAIT_TIME = 20000; // 20s
        const POLL_INTERVAL = 2000;  // 2s
        const start = Date.now();

        try {
            let status = await wpp.getStatus();
            if (!status.connected) await wpp.connect();

            while (Date.now() - start < MAX_WAIT_TIME) {
                status = await wpp.getStatus();
                const { connected, loggedIn, qrcode } = status;

                if (qrcode) {
                    return {
                        success: true,
                        data: { status: ConnectionStatusEnum.AWAITING_QR, qrCode: qrcode }
                    };
                }

                if (loggedIn) {
                    return {
                        success: true,
                        data: { status: ConnectionStatusEnum.CONNECTED, message: 'WhatsApp autenticado' }
                    };
                }

                if (connected && !loggedIn) {
                    const qrCodeFetched = await wpp.getQR();
                    if (qrCodeFetched) {
                        return {
                            success: true,
                            data: { status: ConnectionStatusEnum.AWAITING_QR, qrCode: qrCodeFetched }
                        };
                    }
                }

                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
            }

            return {
                success: true,
                data: {
                    status: ConnectionStatusEnum.PENDING,
                    message: 'Tempo esgotado. Tente atualizar em instantes.'
                }
            };

        } catch (error: any) {
            this.logAction('Erro Conexão', error.message);

            if (error.message?.includes('unauthorized')) {
                return {
                    success: true,
                    data: { status: ConnectionStatusEnum.LOGGED_OUT, message: 'Sessão expirada.' }
                };
            }

            return {
                success: false,
                error: error.message || 'Erro interno ao conectar com WUZAPI'
            };
        }
    }
}