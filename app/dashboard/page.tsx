'use client'
import { CalendarCheck, Clock, Users, MessageSquare } from 'lucide-react'
import DashboardCard from './components/DashboardCard';
import TitlePage from './components/TitlePage';

// Dados de Exemplo (FAKE)
const dashboardMetrics = [
    {
        title: 'Consultas Hoje',
        value: 15,
        icon: CalendarCheck,
        description: 'Total de agendamentos para o dia.',
        color: 'indigo',
    },
    {
        title: 'Confirmados (24h)',
        value: 12,
        icon: Clock,
        description: 'Taxa de confirmação: 80%',
        color: 'green',
    },
    {
        title: 'Aguardando Resposta',
        value: 3,
        icon: MessageSquare,
        description: 'Mensagens enviadas, sem SIM/NÃO.',
        color: 'amber',
    },
    {
        title: 'Novos Pacientes Mês',
        value: 45,
        icon: Users,
        description: 'Crescimento de 12% em relação ao mês anterior.',
        color: 'blue',
    },
];

export default function Dashboard() {
    return (
        <div className=" p-4 bg-background dark:bg-background-secondary">
            <TitlePage title="Visão Geral da Clínica" />
            <div className="min-h-screen">

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {dashboardMetrics.map((metric, index) => (
                        <DashboardCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            icon={metric.icon}
                            description={metric.description}
                            color={metric.color as 'indigo' | 'green' | 'amber' | 'blue'}
                        />
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Histórico de Confirmações (Últimos 30 Dias)
                            </h3>
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                [Placeholder: Gráfico de Barras ou Linhas aqui]
                            </div>
                        </div>

                        {/* Lista de Agendamentos Recentes (Próximos) */}
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700 ">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Próximos Agendamentos (Hoje e Amanhã)
                            </h3>
                            {/* Exemplo de item */}
                            <ul className="divide-y divide-gray-200 dark:divide-background-secondary">
                                <li className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Maria da Silva</p>
                                        <p className="text-sm text-gray-500">Hoje, 14:30 - Status: **CONFIRMADO**</p>
                                    </div>
                                    <button
                                        className="
                                        px-3 py-1.5
                                        rounded-md
                                        bg-indigo-50 text-sky-700
                                        hover:bg-indigo-100 hover:text-indigo-800
                                        dark:bg-primary/10 dark:text-primary
                                        dark:hover:bg-primary/20 dark:hover:text-white
                                        text-sm font-medium
                                        transition-colors
                                        cursor-pointer
                                    "
                                    >
                                        Ver
                                    </button>
                                </li>
                                <li className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">João Souza</p>
                                        <p className="text-sm text-gray-500">Amanhã, 09:00 - Status: **PENDENTE**</p>
                                    </div>
                                    <button
                                        className="
                                            px-3 py-1.5
                                            rounded-md
                                            bg-indigo-50 text-sky-700
                                            hover:bg-indigo-100 hover:text-indigo-800
                                            dark:bg-primary/10 dark:text-primary
                                            dark:hover:bg-primary/20 dark:hover:text-white
                                            text-sm font-medium
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        Ver
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Coluna Lateral (1/3 da largura) */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Card de Ações Rápidas */}
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Ações Rápidas
                            </h3>
                            <div className="space-y-3">
                                <button onClick={() => console.log('novo agendamento')} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                                    + Novo Agendamento
                                </button>
                                <button onClick={() => console.log('Reenviar Não Confirmados')} className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
                                    Reenviar Não Confirmados
                                </button>
                                <button onClick={() => console.log('Configurações do WhatsApp')} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition">
                                    Configurações do WhatsApp
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Status Atual dos Agendamentos
                            </h3>
                            <div className="h-40 flex items-center justify-center text-gray-400">
                                [Placeholder: Gráfico de Pizza/Donut]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}