// ./app/dashboard/settings/NotificationSettings.jsx

'use client'; // <-- ESSENCIAL para usar hooks e interatividade

import { durationOptions } from '@/util/options-duration-input';
import { advanceTimeOptions, cancellationLimitOptions, resendIntervalOptions } from '@/util/options-notification-interval';
import React, { useState } from 'react';

/**
 * Componente focado nas configurações de Notificações e Confirmações.
 * Agora é um Client Component.
 */
export default function NotificationSettings() {
    // 1. Estado inicial das configurações
    const [notificationConfig, setNotificationConfig] = useState({
        antecedenciaConfirmacao: 120, // Minutos: 2 horas antes
        intervaloReenvio: 6,         // Horas: Reenviar 6h depois, se não responder
        metodoPadrao: 'whatsapp',    // whatsapp, email, sms
        tempoLimiteCancelamento: 24, // Horas: Cliente pode cancelar até 24h antes
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Converte valores numéricos de volta para number (caso não seja checkbox)
        const finalValue = type === 'number' ? parseInt(value) : value;

        setNotificationConfig(prevConfig => ({
            ...prevConfig,
            [name]: type === 'checkbox' ? checked : finalValue
        }));
    };

    // 2. A função de salvar AGORA VAI AQUI (no Client Component)
    const handleSave = async () => {
        // Simulação de chamada de API:
        console.log("Enviando para API:", notificationConfig);
        try {
            // Lógica de sucesso
            alert("Configurações de Notificação salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar as configurações.");
        }
    };

    return (
        <div className="p-6 border dark:border-background-secondary rounded-lg shadow-md bg-white dark:bg-background-secondary">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                ⏰ Agendamento de Confirmações
            </h3>

            {/* Início dos Inputs de Configuração */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Configuração 1: Antecedência da Primeira Confirmação */}
                <div>
                    <label htmlFor="antecedenciaConfirmacao" className="block text-sm font-medium text-gray-800 dark:text-white">
                        Tempo de Antecedência para Confirmação:
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">

                        <select
                            name="antecedenciaConfirmacao"
                            id="antecedenciaConfirmacao"
                            value={notificationConfig.antecedenciaConfirmacao}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                            required
                        >
                            {advanceTimeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-white mt-1">
                        O sistema enviará a primeira solicitação X minutos antes do agendamento.
                    </p>
                </div>

                {/* Configuração 2: Intervalo de Reenvio */}
                <div>
                    <label htmlFor="intervaloReenvio" className="block text-sm font-medium text-gray-800 dark:text-white">
                        Intervalo de Reenvio (Lembrete):
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <select
                            name="intervaloReenvio"
                            id="intervaloReenvio"
                            value={notificationConfig.intervaloReenvio}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                            required
                        >
                            {resendIntervalOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs text-gray-800 dark:text-white mt-1">
                        Se o cliente não responder, será enviado um novo lembrete a cada X horas.
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 mt-8">
                💬 Padrões de Comunicação
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Configuração 3: Método Padrão */}
                <div>
                    <label htmlFor="metodoPadrao" className="block text-sm font-medium text-gray-800 dark:text-white pb-1">
                        Método de Notificação Padrão:
                    </label>
                    <select
                        id="metodoPadrao"
                        name="metodoPadrao"
                        value={notificationConfig.metodoPadrao}
                        onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="whatsapp">WhatsApp (Recomendado)</option>
                        <option value="sms">SMS</option>
                        <option value="email">E-mail</option>
                    </select>
                    <p className="text-xs text-gray-800 dark:text-white mt-1">
                        Selecione o canal principal para o envio automático de mensagens.
                    </p>
                </div>

                {/* Configuração 4: Limite de Cancelamento pelo Cliente */}
                <div>
                    <label htmlFor="tempoLimiteCancelamento" className="block text-sm font-medium text-gray-800 dark:text-white">
                        Tempo Limite para Cancelamento pelo Cliente:
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <select
                            name="tempoLimiteCancelamento"
                            id="tempoLimiteCancelamento"
                            value={notificationConfig.tempoLimiteCancelamento}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                            required
                        >
                            {cancellationLimitOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs text-gray-800 dark:text-white mt-1">
                        O cliente pode cancelar/reagendar sozinho até X horas antes do horário.
                    </p>
                </div>
            </div>

            {/* Fim dos Inputs de Configuração */}

            <div className="pt-6 border-t mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-primary hover:opacity-90 cursor-pointer"
                >
                    Salvar Configurações de Notificação
                </button>
            </div>
        </div>
    );
}