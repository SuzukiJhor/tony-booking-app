import prisma from '@/lib/prisma';
import { encrypt } from '@/util/crypto-id';
import { WuzapiClient } from '../api-client/wuzapi-client';
import { getConfirmationMessage } from '@/lib/messages/appointment-templates';
import { SettingsService } from './SettingsService';
import { StatusAgendamento } from '@prisma/client';

export class WuzapiService {
    private settingsService: SettingsService;

    constructor(empresaId: number) {
        this.settingsService = new SettingsService(empresaId);
    }

    async sendConfirmationMessage(agendamentoId: number) {
        const connection = await this.settingsService.checkConnectionWpp();

        if (connection.success === false) throw new Error("Conexão não configurada.");

        if (
            connection.data &&
            typeof (connection.data as any).connected === 'boolean' &&
            (connection.data as any).connected === false
        ) {
            throw new Error("Conexão não Conectada.");
        }

        const agenda = await prisma.agendamento.findUnique({
            where: { id: agendamentoId },
            include: {
                paciente: true,
                profissional: true
            }
        });

        if (!agenda || !agenda.paciente?.telefone)
            throw new Error("Agendamento não encontrado ou paciente sem telefone.");

        if (agenda.statusConfirmacao !== StatusAgendamento.PENDENTE)
            throw new Error(`Mensagem não enviada. O agendamento já está com status: ${agenda.statusConfirmacao}`);

        const uuid = await encrypt(agenda.id.toString());
        const linkConfirmacao = `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation/${uuid}`;

        const dataAgendamento = agenda.dataHora.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long'
        });

        const horaAgendamento = agenda.dataHora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const corpoMensagem = getConfirmationMessage({
            nome: agenda.paciente.nome ?? "",
            profissional: agenda.profissional?.nome ?? "",
            data: dataAgendamento,
            hora: horaAgendamento,
            link: linkConfirmacao
        });

        const token = await this.settingsService.fetchToken();
        const client = new WuzapiClient(token);

        try {
            const response = await client.transmitMessage(agenda.paciente.telefone, corpoMensagem);
            const messageId = `sent_${Date.now()}`;
            await prisma.agendamento.update({
                where: { id: agendamentoId },
                data: {
                    mensagemEnviadaEm: new Date(),
                    statusConfirmacao: StatusAgendamento.MENSAGEM_ENVIADA,
                    mensagemId: String(messageId),
                },
            });
            return response;
        } catch (error) {
            console.error(`Erro ao enviar WhatsApp para agendamento ${agendamentoId}:`, error);
            throw error;
        }
    }
}