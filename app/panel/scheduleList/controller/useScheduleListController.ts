'use client';
import { useState, useMemo } from "react";
import { sendConfirmationWhatsAppAction } from "../actions";
import toast from "react-hot-toast";

export function useScheduleListController(initialData: any[]) {
    const [filtro, setFiltro] = useState<'hoje' | 'semana'>('hoje');
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

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
                if (s.isDeleted) return false;

                const matchesSearch = searchQuery.length > 0
                    ? (s.paciente?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.profissional?.nome?.toLowerCase().includes(searchQuery.toLowerCase()))
                    : true;

                if (searchQuery.length > 0) return matchesSearch;

                const dataAgendamento = new Date(s.dataHora);
                const matchesDate = filtro === 'hoje'
                    ? (dataAgendamento >= inicioHoje && dataAgendamento <= fimHoje)
                    : (dataAgendamento >= inicioHoje && dataAgendamento <= fimSemana);

                return matchesDate;
            })
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [filtro, searchQuery, initialData]);

    const handleSendWhatsApp = async (agendamentoId: number) => {
        try {
            setIsSendingMessage(true);
            const result = await sendConfirmationWhatsAppAction(agendamentoId);
            if (result.success) return toast.success(result.message || "Confirmação enviada!");
            return toast.error(result.error || "Erro ao enviar mensagem.");
        } catch (error) {
            toast.error("Erro crítico ao processar o envio.");
            console.error(error);
        } finally {
            setIsSendingMessage(false);
        }
    };

    return {
        filtro,
        setFiltro,
        searchQuery,
        setSearchQuery,
        selectedSchedule,
        setSelectedSchedule,
        filteredAppointments,
        handleSendWhatsApp,
        isSendingMessage
    };
}