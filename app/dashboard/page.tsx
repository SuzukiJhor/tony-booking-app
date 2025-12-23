'use client';

import { useEffect, useMemo } from 'react';
import TitlePage from './components/TitlePage';
import { useClient } from '../context/ClientsContext';
import DashboardCard from './components/DashboardCard';
import { useLoading } from '../components/LoadingProvider';
import { DataBasePacienteType } from './types/patientDBType';
import { CalendarCheck, Clock, Users, MessageSquare } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

export default function Dashboard() {
    const { clients, reloadEvents } = useClient() as {
        clients: DataBasePacienteType[];
        reloadEvents: () => void;
    };
    const { setIsLoading } = useLoading();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date();
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const formatDateLabel = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Hoje';
        if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';

        return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });

    const statusLabelMap: Record<string, string> = {
        CONFIRMADO: 'CONFIRMADO',
        PENDENTE: 'PENDENTE',
        NAO_CONFIRMADO: 'NÃO CONFIRMADO',
        MENSAGEM_ENVIADA: 'MENSAGEM ENVIADA',
    };

    const schedules = useMemo(
        () =>
            clients.flatMap(client =>
                client.agendamentos.filter(a => !a.isDeleted)
            ),
        [clients]
    );

    /* =========================
     * Métricas
     * ========================= */
    const todayKey = new Date().toDateString();

    const schedulesToday = schedules.filter(
        a => new Date(a.dataHora).toDateString() === todayKey
    ).length;

    const now = new Date();
    const limit24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const confirmed24h = schedules.filter(
        a =>
            a.statusConfirmacao === 'CONFIRMADO' &&
            new Date(a.dataHora) >= limit24h
    ).length;

    const waitingForResponse = schedules.filter(
        a => a.statusConfirmacao === 'PENDENTE'
    ).length;

    const monthInit = new Date();
    monthInit.setDate(1);
    monthInit.setHours(0, 0, 0, 0);

    const newClientsMonth = clients.filter(client =>
        client.agendamentos.some(
            a => !a.isDeleted && new Date(a.dataHora) >= monthInit
        )
    ).length;

    const dashboardMetrics = [
        {
            title: 'Consultas Hoje',
            value: schedulesToday,
            icon: CalendarCheck,
            description: 'Total de agendamentos para o dia.',
            color: 'indigo',
        },
        {
            title: 'Confirmados (24h)',
            value: confirmed24h,
            icon: Clock,
            description: 'Consultas confirmadas nas últimas 24h.',
            color: 'green',
        },
        {
            title: 'Aguardando Resposta',
            value: waitingForResponse,
            icon: MessageSquare,
            description: 'Agendamentos pendentes.',
            color: 'amber',
        },
        {
            title: 'Novos Pacientes Mês',
            value: newClientsMonth,
            icon: Users,
            description: 'Pacientes com agendamentos neste mês.',
            color: 'blue',
        },
    ];

    /* =========================
     * Próximos Agendamentos
     * ========================= */
    const nextSchedules = useMemo(
        () =>
            clients
                .flatMap(client =>
                    client.agendamentos
                        .filter(a => {
                            const date = new Date(a.dataHora);
                            return (
                                !a.isDeleted &&
                                date >= startOfToday &&
                                date <= endOfTomorrow
                            );
                        })
                        .map(agendamento => ({
                            ...agendamento,
                            patientName: client.nome,
                        }))
                )
                .sort(
                    (a, b) =>
                        new Date(a.dataHora).getTime() -
                        new Date(b.dataHora).getTime()
                )
                .slice(0, 5),
        [clients]
    );

    /* =========================
     * Gráfico Pizza
     * ========================= */
    const statusChartData = useMemo(() => {
        const statusCount: Record<string, number> = {};

        schedules.forEach(s => {
            statusCount[s.statusConfirmacao] =
                (statusCount[s.statusConfirmacao] || 0) + 1;
        });

        return [
            { name: 'Confirmado', value: statusCount.CONFIRMADO || 0 },
            { name: 'Pendente', value: statusCount.PENDENTE || 0 },
            { name: 'Não Confirmado', value: statusCount.NAO_CONFIRMADO || 0 },
            { name: 'Mensagem Enviada', value: statusCount.MENSAGEM_ENVIADA || 0 },
        ];
    }, [schedules]);

    /* =========================
     * Gráfico Linha – 30 dias
     * ========================= */
    const last30DaysData = useMemo(() => {
        const days: Record<string, any> = {};

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toLocaleDateString('pt-BR');

            days[key] = {
                date: key,
                CONFIRMADO: 0,
                PENDENTE: 0,
                NAO_CONFIRMADO: 0,
            };
        }

        schedules.forEach(s => {
            const key = new Date(s.dataHora).toLocaleDateString('pt-BR');
            if (days[key] && days[key][s.statusConfirmacao] !== undefined) {
                days[key][s.statusConfirmacao]++;
            }
        });

        return Object.values(days);
    }, [schedules]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await reloadEvents();
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);


    return (
        <div className="p-4 bg-background dark:bg-background-tertiary">
            <TitlePage title="Visão Geral da Clínica" />

            <div className="min-h-screen">
                {/* Cards */}
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
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gráfico Linha */}
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Histórico de Confirmações (Últimos 30 Dias)
                            </h3>

                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={last30DaysData}>
                                        <XAxis dataKey="date" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="CONFIRMADO" stroke="#22c55e" />
                                        <Line type="monotone" dataKey="PENDENTE" stroke="#f59e0b" />
                                        <Line type="monotone" dataKey="NAO_CONFIRMADO" stroke="#ef4444" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Próximos */}
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Próximos Agendamentos (Hoje e Amanhã)
                            </h3>

                            <ul className="divide-y divide-gray-200 dark:divide-background-secondary">
                                {nextSchedules.length === 0 && (
                                    <li className="py-4 text-sm text-gray-500 text-center">
                                        Nenhum agendamento para hoje ou amanhã
                                    </li>
                                )}

                                {nextSchedules.map(s => {
                                    const date = new Date(s.dataHora);

                                    return (
                                        <li key={s.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {s.patientName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateLabel(date)}, {formatTime(date)} –{' '}
                                                    <strong>{statusLabelMap[s.statusConfirmacao]}</strong>
                                                </p>
                                            </div>

                                            {/* <button className="px-3 py-1.5 rounded-md bg-indigo-50 text-sky-700 hover:bg-indigo-100 dark:bg-primary/10 dark:text-primary text-sm font-medium">
                                                Ver
                                            </button> */}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Status Atual dos Agendamentos
                            </h3>

                            <div className="flex items-center gap-4">
                                {/* Gráfico */}
                                <div className="h-40 w-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusChartData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={40}
                                                outerRadius={60}
                                            >
                                                <Cell fill="#22c55e" />
                                                <Cell fill="#f59e0b" />
                                                <Cell fill="#ef4444" />
                                                <Cell fill="#3b82f6" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legenda */}
                                <ul className="space-y-2 text-sm">
                                    {statusChartData.map((item, index) => (
                                        <li key={item.name} className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'][index] }}
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {item.name} ({item.value})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
