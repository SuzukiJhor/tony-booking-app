// ./app/dashboard/settings/ScheduleSettings.jsx

'use client';

import React, { useState } from 'react';

// Dados base para os dias da semana
const daysOfWeek = [
    { key: 'sun', label: 'Domingo' },
    { key: 'mon', label: 'Segunda-feira' },
    { key: 'tue', label: 'Terça-feira' },
    { key: 'wed', label: 'Quarta-feira' },
    { key: 'thu', label: 'Quinta-feira' },
    { key: 'fri', label: 'Sexta-feira' },
    { key: 'sat', label: 'Sábado' },
];

export default function ScheduleSettings() {
    const [scheduleConfig, setScheduleConfig] = useState({
        // Array com os dias de atendimento padrão
        activeDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
        // Horários em formato HH:MM
        startTime: '09:00',
        endTime: '18:00',
        defaultDuration: 30, // Duração padrão em minutos
        intervalStep: 15,    // Intervalo de visualização dos horários (em minutos)
        minAdvanceBooking: 4, // Mínimo de horas de antecedência para agendar
    });

    // Manipula a mudança de inputs de texto/número
    const handleChange = (e) => {
        const { name, value } = e.target;
        setScheduleConfig(prevConfig => ({
            ...prevConfig,
            [name]: value
        }));
    };

    // Manipula a seleção/desseleção dos dias da semana
    const handleDayToggle = (dayKey) => {
        setScheduleConfig(prevConfig => {
            const isActive = prevConfig.activeDays.includes(dayKey);
            return {
                ...prevConfig,
                activeDays: isActive
                    ? prevConfig.activeDays.filter(key => key !== dayKey)
                    : [...prevConfig.activeDays, dayKey].sort((a, b) =>
                        daysOfWeek.findIndex(d => d.key === a) - daysOfWeek.findIndex(d => d.key === b)
                    ),
            };
        });
    };

    const handleSave = async () => {
        console.log("Configurações de Horário salvas:", scheduleConfig);
        try {
            // **Ação de API:** Enviar scheduleConfig para o seu backend
            // Ex: await fetch('/api/settings/schedule', { method: 'PUT', body: JSON.stringify(scheduleConfig) });
            alert("Horário de Funcionamento salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar o horário de funcionamento.");
        }
    };

    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white dark:bg-background-secondary">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
                🗓️ Horário de Funcionamento e Agenda
            </h3>

            {/* Configuração 1: Dias de Atendimento */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Dias da Semana de Atendimento:
                </label>
                <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day.key}
                            onClick={() => handleDayToggle(day.key)}
                            className={`px-4 py-2 text-sm rounded-full transition duration-150 ${scheduleConfig.activeDays.includes(day.key)
                                ? 'bg-blue-600 text-white font-semibold shadow-md'
                                : 'bg-gray-200 text-gray-700 dark:text-background hover:bg-gray-300'
                                }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-white mt-2">
                    Selecione os dias em que a empresa estará aberta para agendamentos.
                </p>
            </div>

            {/* Configuração 2 & 3: Início e Fim do Expediente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Início do Expediente:
                    </label>
                    <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        value={scheduleConfig.startTime}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 bg-white dark:bg-gray-700"
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Fim do Expediente:
                    </label>
                    <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        value={scheduleConfig.endTime}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 bg-white dark:bg-gray-700"
                    />
                </div>
            </div>

            {/* Configuração 4, 5 & 6: Duração, Intervalo e Antecedência Mínima */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                {/* Duração Padrão */}
                <div>
                    <label htmlFor="defaultDuration" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Duração Padrão do Serviço (Min):
                    </label>
                    <input
                        type="number"
                        name="defaultDuration"
                        id="defaultDuration"
                        value={scheduleConfig.defaultDuration}
                        onChange={handleChange}
                        min="5"
                        step="5"
                        className="mt-1 block w-full border dark:bg-gray-700 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Intervalo de Agendamento */}
                <div>
                    <label htmlFor="intervalStep" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Passo do Calendário (Min):
                    </label>
                    <input
                        type="number"
                        name="intervalStep"
                        id="intervalStep"
                        value={scheduleConfig.intervalStep}
                        onChange={handleChange}
                        min="5"
                        step="5"
                        className="mt-1 block w-full border dark:bg-gray-700 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-white mt-1">
                        Intervalo que os horários serão mostrados (ex: 09:00, 09:15, 09:30).
                    </p>
                </div>

                {/* Antecedência Mínima */}
                <div>
                    <label htmlFor="minAdvanceBooking" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Agendamento Mínimo (Horas):
                    </label>
                    <input
                        type="number"
                        name="minAdvanceBooking"
                        id="minAdvanceBooking"
                        value={scheduleConfig.minAdvanceBooking}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full border dark:bg-gray-700 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-white mt-1">
                        Clientes não podem agendar para as próximas X horas.
                    </p>
                </div>
            </div>

            {/* Botão de salvar */}
            <div className="pt-6 border-t mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-primary hover:opacity-90 cursor-pointer"
                >
                    Salvar Horário
                </button>
            </div>
        </div>
    );
}