'use client';
import { useEffect, useMemo } from 'react';
import TitlePage from './components/TitlePage';
import { useClient } from '../context/ClientsContext';
import DashboardCard from './components/DashboardCard';
import { useLoading } from '../components/LoadingProvider';
import StatusPizzaChart from '../components/StatusPizzaChart';
import { DataBasePacienteType } from './types/patientDBType';
import NextSchedulesCard from '../components/NextSchedulesCard';
import { CalendarCheck, Clock, Users, MessageSquare } from 'lucide-react';
import HistoryConfirmationCard from '../components/HistoryConfirmationCard';

export default function Dashboard() {
    const { clients, reloadEvents } = useClient() as {
        clients: DataBasePacienteType[];
        reloadEvents: () => void;
    };
    const { setIsLoading } = useLoading();

    const schedules = useMemo(
        () => clients.flatMap(client => client.agendamentos.filter(a => !a.isDeleted)),
        [clients]
    );

    const groupedSchedules = useMemo(() => {
        const todayStr = new Date().toDateString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toDateString();

        const flatSchedules = clients.flatMap(client =>
            client.agendamentos
                .filter(a => {
                    const d = new Date(a.dataHora);
                    return !a.isDeleted && (d.toDateString() === todayStr || d.toDateString() === tomorrowStr);
                })
                .map(a => ({ ...a, patientName: client.nome }))
        ).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

        return {
            hoje: flatSchedules.filter(s => new Date(s.dataHora).toDateString() === todayStr),
            amanha: flatSchedules.filter(s => new Date(s.dataHora).toDateString() === tomorrowStr),
        };
    }, [clients]);

    const todayKey = new Date().toDateString();
    const schedulesToday = schedules.filter(a => new Date(a.dataHora).toDateString() === todayKey).length;
    const now = new Date();
    const limit24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const confirmed24h = schedules.filter(a => a.statusConfirmacao === 'CONFIRMADO' && new Date(a.dataHora) >= limit24h).length;
    const waitingForResponse = schedules.filter(a => a.statusConfirmacao === 'PENDENTE').length;
    const monthInit = new Date();
    monthInit.setDate(1);
    monthInit.setHours(0, 0, 0, 0);
    const newClientsMonth = clients.filter(client => client.agendamentos.some(a => !a.isDeleted && new Date(a.dataHora) >= monthInit)).length;

    const dashboardMetrics = [
        { title: 'Consultas Hoje', value: schedulesToday, icon: CalendarCheck, description: 'Total de agendamentos para o dia.', color: 'indigo' },
        { title: 'Confirmados (24h)', value: confirmed24h, icon: Clock, description: 'Consultas confirmadas nas últimas 24h.', color: 'green' },
        { title: 'Aguardando Resposta', value: waitingForResponse, icon: MessageSquare, description: 'Agendamentos pendentes.', color: 'amber' },
        { title: 'Novos Pacientes Mês', value: newClientsMonth, icon: Users, description: 'Pacientes com agendamentos neste mês.', color: 'blue' },
    ];

    const statusChartData = useMemo(() => {
        const statusCount: Record<string, number> = {};
        schedules.forEach(s => { statusCount[s.statusConfirmacao] = (statusCount[s.statusConfirmacao] || 0) + 1; });
        return [
            { name: 'Confirmado', value: statusCount.CONFIRMADO || 0, color: '#22c55e' },
            { name: 'Pendente', value: statusCount.PENDENTE || 0, color: '#f59e0b' },
            { name: 'Não Confirmado', value: statusCount.NAO_CONFIRMADO || 0, color: '#ef4444' },
            { name: 'Mensagem Enviada', value: statusCount.MENSAGEM_ENVIADA || 0, color: '#3b82f6' },
        ];
    }, [schedules]);

    const last30DaysData = useMemo(() => {
        const days: Record<string, any> = {};
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toLocaleDateString('pt-BR');
            days[key] = { date: key, CONFIRMADO: 0, PENDENTE: 0, NAO_CONFIRMADO: 0 };
        }
        schedules.forEach(s => {
            const key = new Date(s.dataHora).toLocaleDateString('pt-BR');
            if (days[key] && days[key][s.statusConfirmacao] !== undefined) days[key][s.statusConfirmacao]++;
        });
        return Object.values(days);
    }, [schedules]);

    useEffect(() => {
        setIsLoading(true);
        try {
            reloadEvents();
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        }
        setIsLoading(false);
    }, []);

    return (
        <div className="p-6 lg:p-8 bg-background dark:bg-background-tertiary min-h-screen max-w-400 mx-auto">

            <header className="mb-2">
                <TitlePage title="Visão Geral da Clínica" />
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    <div className="transition-all hover:shadow-lg">
                        <HistoryConfirmationCard dataHistory={last30DaysData} />
                    </div>

                    <div className="transition-all hover:shadow-lg">
                        <NextSchedulesCard groupedSchedules={groupedSchedules} />
                    </div>
                </div>

                <div className="lg:col-span-4 sticky top-8">
                    <div className="transition-all hover:shadow-lg">
                        <StatusPizzaChart statusChartData={statusChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}