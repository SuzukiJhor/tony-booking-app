'use client';
import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, ListFilter, Phone, MessageCircle, Eye, UserCheck, Timer, ArrowLeft } from 'lucide-react';
import { useLoading } from '@/app/components/LoadingProvider';
import { DataBasePacienteType } from '../types/patientDBType';
import { useClient } from '@/app/context/ClientsContext';
import { selectColorByStatus } from '@/util/selectColorByStatus';
import { NextSchedulesModalDetails } from '@/app/components/NextSchedulesModalDetails';
import ButtonCard from '@/app/components/ButtonCard';
import { useRouter } from "next/navigation";

export default function ScheduleList() {
    const { clients, reloadEvents } = useClient() as {
        clients: DataBasePacienteType[];
        reloadEvents: () => void;
    };
    const { setIsLoading } = useLoading();
    const router = useRouter();
    const [filtro, setFiltro] = useState('hoje');
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

    const schedules = useMemo(() => {
        if (!clients) return [];
        return clients.flatMap(client =>
            client.agendamentos
                .filter(a => !a.isDeleted)
                .map(a => ({
                    ...a,
                    patientName: client.nome,
                    patientPhone: client.telefone,
                    patientEmail: client.email,
                    empresaId: client.empresaId,
                    tempoAtendimento: a.tempoAtendimento,
                    profissionalId: a.profissionalId
                }))
        );
    }, [clients]);

    const filteredAppointments = useMemo(() => {
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

    useEffect(() => {
        setIsLoading(true);
        reloadEvents();
        setIsLoading(false);
    }, []);

    const handleWhatsApp = (phone: string, name: string) => {
        const message = encodeURIComponent(`Olá ${name}, confirmamos seu agendamento.`);
        window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    return (

        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition cursor-pointer dark:border-card dark:text-card"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="bg-white dark:bg-background-secondary rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden mt-6">
                <div className="p-5 border-b dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sky-600">
                            <ListFilter size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Listagem de Agendamentos</h3>
                            <p className="text-xs text-gray-500">Gerencie seus compromissos</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                        {['hoje', 'semana'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFiltro(type)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filtro === type
                                    ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {type === 'hoje' ? 'Hoje' : 'Próximos 7 dias'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y dark:divide-gray-800">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((s) => (
                            <div key={s.id} className="p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex gap-5 items-center">
                                    <div className="text-center min-w-15 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <p className="text-[10px] uppercase font-bold text-sky-600">
                                            {new Date(s.dataHora).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                        </p>
                                        <p className="text-xl font-black text-gray-800 dark:text-white">
                                            {new Date(s.dataHora).getDate()}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{s.patientName}</p>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${selectColorByStatus(s.statusConfirmacao).classes}`}>
                                                {selectColorByStatus(s.statusConfirmacao).label}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5 font-medium text-sky-600 dark:text-sky-400">
                                                <Clock size={14} />
                                                {new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium text-sky-600 dark:text-sky-400">
                                                <Phone size={14} />
                                                  <p className="font-bold text-gray-900 dark:text-white text-lg">{s.patientPhone}</p>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Timer size={14} /> {s.tempoAtendimento} min
                                            </span>
                                            {s.profissionalId && (
                                                <span className="flex items-center gap-1.5">
                                                    <UserCheck size={14} /> Prof. #{s.profissionalId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-auto md:ml-0">
                                    <button
                                        onClick={() => handleWhatsApp(s.patientPhone, s.patientName)}
                                        className="p-2.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors border border-transparent hover:border-green-100 cursor-pointer"
                                        title="Enviar WhatsApp"
                                    >
                                        <MessageCircle size={20} />
                                    </button>

                                    <ButtonCard
                                        onClick={() => setSelectedSchedule(s)}
                                    >
                                        <Eye size={16} />
                                        Detalhes
                                    </ButtonCard>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar size={32} className="text-gray-400 opacity-50" />
                            </div>
                            <h4 className="text-gray-900 dark:text-white font-bold">Tudo limpo!</h4>
                            <p className="text-gray-500 text-sm">Nenhum agendamento para este período.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedSchedule && (
                <NextSchedulesModalDetails
                    schedule={selectedSchedule}
                    onClose={() => setSelectedSchedule(null)}
                />
            )}
        </div>
    );
}