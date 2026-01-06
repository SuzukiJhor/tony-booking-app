'use client';

import { useState, useEffect, useMemo } from "react";
import ButtonCard from "./ButtonCard";
import { Clock, Eye, Loader2, User, Activity } from "lucide-react";
import { statusStyleMap } from "../panel/constants";
import SubTitlePage from "../panel/components/SubTitlePage";
import { NextSchedulesModalDetails } from "./NextSchedulesModalDetails";
import ButtonWhatsApp from "./ButtonWhatsApp";
import { getAllSchedules } from "../panel/calendar/actions";

interface DataBaseEventType {
    id: number;
    dataHora: string;
    statusConfirmacao: string;
    tipoAgendamento: string;
    tempoAtendimento: number;
    isDeleted: boolean;
    paciente: {
        nome: string;
        telefone: string;
    };
    profissional?: {
        nome: string;
        especialidade: string;
    } | null;
}

interface Schedule extends DataBaseEventType {
    patientName: string;
}

const formatTime = (date: Date) =>
    date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

const StatusBadge = ({ status }: { status: string }) => {
    const config = statusStyleMap[status] || statusStyleMap.PENDENTE;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${config.classes}`}>
            <span>{config.icon}</span>
            <span className="truncate">{config.label}</span>
        </span>
    );
};

export default function NextSchedulesCard() {
    const [events, setEvents] = useState<DataBaseEventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    async function reloadEvents() {
        try {
            setLoading(true);
            const { data } = await getAllSchedules();
            setEvents(
                (data ?? []).map((event: any) => ({
                    ...event,
                    statusConfirmacao: event.statusConfirmacao as DataBaseEventType["statusConfirmacao"],
                }))
            );
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadEvents();
    }, []);

    const groupedSchedules = useMemo(() => {
        const todayStr = new Date().toDateString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toDateString();

        const flatSchedules: Schedule[] = events
            .filter(a => !a.isDeleted)
            .map(a => ({
                ...a,
                patientName: a.paciente?.nome || "Paciente sem nome"
            }))
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

        return {
            hoje: flatSchedules.filter(s => new Date(s.dataHora).toDateString() === todayStr),
            amanha: flatSchedules.filter(s => new Date(s.dataHora).toDateString() === tomorrowStr),
        };
    }, [events]);

    const renderItem = (s: Schedule) => {
        const date = new Date(s.dataHora);
        return (
            <div key={s.id} className="group py-4 px-3 flex flex-col sm:flex-row sm:justify-between sm:items-center rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-100 dark:border-gray-800 last:border-0 gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors truncate">
                            {s.patientName}
                        </p>
                        <div className="sm:hidden">
                            <StatusBadge status={s.statusConfirmacao} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock size={14} className="text-sky-500 shrink-0" />
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {formatTime(date)}
                            </span>
                            <span className="text-gray-400">({s.tempoAtendimento}m)</span>
                        </div>

                        <div className="flex items-center gap-1 capitalize">
                            <Activity size={14} className="text-purple-500 shrink-0" />
                            <span className="truncate">{s.tipoAgendamento.toLowerCase()}</span>
                        </div>
                    </div>

                    {s.profissional && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 italic">
                            <User size={12} className="shrink-0" />
                            <span className="truncate">Dentista: {s.profissional.nome}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
                    <div className="hidden sm:block">
                        <StatusBadge status={s.statusConfirmacao} />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none">
                            <ButtonWhatsApp schedule={s} />
                        </div>
                        <div className="flex-1 sm:flex-none">
                            <ButtonCard onClick={() => setSelectedSchedule(s)}>
                                <div className="flex items-center justify-center gap-2">
                                    <Eye size={16} />
                                    <span className="sm:inline">Detalhes</span>
                                </div>
                            </ButtonCard>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-background-secondary p-4 sm:p-6 rounded-xl shadow-md border dark:border-gray-700 text-foreground min-h-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <SubTitlePage text="Próximos Agendamentos" />
                {!loading && (
                    <span className="w-fit text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500 font-mono">
                        Total: {groupedSchedules.hoje.length + groupedSchedules.amanha.length}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-sm">Sincronizando...</span>
                </div>
            ) : (
                <ul className="space-y-6">
                    {groupedSchedules.hoje.length === 0 && groupedSchedules.amanha.length === 0 && (
                        <li className="py-8 text-sm text-gray-500 text-center italic border-2 border-dashed border-gray-50 dark:border-gray-800 rounded-xl">
                            Nenhum agendamento para hoje ou amanhã.
                        </li>
                    )}

                    {groupedSchedules.hoje.length > 0 && (
                        <li>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0"></span>
                                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 whitespace-nowrap">Hoje</h4>
                                <div className="grow border-t border-sky-100 dark:border-sky-900/30"></div>
                            </div>
                            <div className="flex flex-col gap-1">
                                {groupedSchedules.hoje.map(renderItem)}
                            </div>
                        </li>
                    )}

                    {groupedSchedules.amanha.length > 0 && (
                        <li>
                            <div className="flex items-center gap-2 mt-4 mb-3">
                                <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
                                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">Amanhã</h4>
                                <div className="grow border-t border-gray-100 dark:border-gray-800"></div>
                            </div>
                            <div className="flex flex-col gap-1">
                                {groupedSchedules.amanha.map(renderItem)}
                            </div>
                        </li>
                    )}
                </ul>
            )}

            {selectedSchedule && (
                <NextSchedulesModalDetails
                    schedule={selectedSchedule}
                    onClose={() => setSelectedSchedule(null)}
                />
            )}
        </div>
    );
}