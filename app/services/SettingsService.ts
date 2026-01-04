import { NextResponse } from "next/server";
import { BaseService } from './BaseService';

export class SettingsService extends BaseService {

    async getCompanyPhone() {
        this.logAction('Listagem', 'Telefone da Empresa');
        const settingsData = await this.db.configuracao.findMany({
            where: {
                empresaId: this.empresaId,
            },
        });

        const mainConfig = settingsData[0];

        return {
            mainPhone: mainConfig?.telefone || null
        }
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

        return {
            success: true,
            data: updatedSetting
        };
    }
}