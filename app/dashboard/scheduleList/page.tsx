'use client';
import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, ListFilter } from 'lucide-react';
import { useLoading } from '@/app/components/LoadingProvider';
import { DataBasePacienteType } from '../types/patientDBType';
import { useClient } from '@/app/context/ClientsContext';
import { selectColorByStatus } from '@/util/selectColorByStatus';

export default function ScheduleList() {
    const { clients, reloadEvents } = useClient() as {
        clients: DataBasePacienteType[];
        reloadEvents: () => void;
    };
    const { setIsLoading } = useLoading();

    const schedules = useMemo(() => {
        if (!clients) return [];
        return clients.flatMap(client =>
            client.agendamentos
                .filter(a => !a.isDeleted)
                .map(a => ({
                    ...a,
                    patientName: client.nome,    // Anexa o nome do paciente
                    patientPhone: client.telefone, // Anexa o telefone
                    patientEmail: client.email,    // Anexa o email
                    empresaId: client.empresaId    // Anexa o ID da empresa
                }))
        );
    }, [clients]);
    const [filtro, setFiltro] = useState('hoje');

    const agendamentosFiltrados = useMemo(() => {
        if (!schedules || !Array.isArray(schedules)) return [];

        const agora = new Date();
        const inicioHoje = new Date(agora);
        inicioHoje.setHours(0, 0, 0, 0);

        const fimHoje = new Date(agora);
        fimHoje.setHours(23, 59, 59, 999);

        const fimSemana = new Date(inicioHoje);
        fimSemana.setDate(fimSemana.getDate() + 7);

        return schedules.filter(s => {
            if (!s.dataHora) return false;
            const dataAgendamento = new Date(s.dataHora);

            if (filtro === 'hoje') {
                return dataAgendamento >= inicioHoje && dataAgendamento <= fimHoje;
            } else {
                return dataAgendamento >= inicioHoje && dataAgendamento <= fimSemana;
            }
        }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [filtro, schedules]);
    console.log(agendamentosFiltrados);
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
            <div className="p-4 border-b dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/5">

                <div className="flex items-center gap-2">
                    <ListFilter size={18} className="text-sky-500" />
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Listagem de Agendamentos</h3>
                </div>

                <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setFiltro('hoje')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filtro === 'hoje'
                            ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Hoje
                    </button>
                    <button
                        onClick={() => setFiltro('semana')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filtro === 'semana'
                            ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Próximos 7 dias
                    </button>
                </div>
            </div>

            <div className="divide-y dark:divide-gray-800">
                {agendamentosFiltrados.length > 0 ? (
                    agendamentosFiltrados.map((s) => (
                        <div key={s.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="text-center min-w-12.5 p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800">
                                    <p className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">
                                        {new Date(s.dataHora).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                    </p>
                                    <p className="text-lg font-black text-sky-700 dark:text-sky-300">
                                        {new Date(s.dataHora).getDate()}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-bold text-background-secondary dark:text-white">{s.patientName}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border shadow-sm ${selectColorByStatus(s.statusConfirmacao).classes}`}>
                                            {selectColorByStatus(s.statusConfirmacao).icon} {selectColorByStatus(s.statusConfirmacao).label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Nenhum agendamento encontrado para este período.</p>
                    </div>
                )}
            </div>
        </div>
    );
}