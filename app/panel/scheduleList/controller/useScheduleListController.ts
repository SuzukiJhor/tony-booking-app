'use client';
import { useState, useMemo } from "react";

export function useScheduleListController(initialData: any[]) {
    const [filtro, setFiltro] = useState<'hoje' | 'semana'>('hoje');
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

    const filteredAppointments = useMemo(() => {
        if (!initialData || !Array.isArray(initialData)) return [];

        const agora = new Date();
        const inicioHoje = new Date(agora);
        inicioHoje.setHours(0, 0, 0, 0);

        const fimHoje = new Date(agora);
        fimHoje.setHours(23, 59, 59, 999);

        const fimSemana = new Date(inicioHoje);
        fimSemana.setDate(fimSemana.getDate() + 7);

        return initialData
            .filter(s => {
                if (!s.dataHora || s.isDeleted) return false;
                const dataAgendamento = new Date(s.dataHora);

                if (filtro === 'hoje') {
                    return dataAgendamento >= inicioHoje && dataAgendamento <= fimHoje;
                } else {
                    return dataAgendamento >= inicioHoje && dataAgendamento <= fimSemana;
                }
            })
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [filtro, initialData]);

    return {
        filtro,
        setFiltro,
        selectedSchedule,
        setSelectedSchedule,
        filteredAppointments
    };
}