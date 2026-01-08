'use client';
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { sendConfirmationWhatsAppAction } from "../actions";

export function useScheduleListController(initialData: any[]) {
    const [filtro, setFiltro] = useState<'hoje' | 'semana' | 'todos'>('hoje');
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

                if (filtro === 'todos') return true;

                const dataAgendamento = new Date(s.dataHora);
                const matchesDate = filtro === 'hoje'
                    ? (dataAgendamento >= inicioHoje && dataAgendamento <= fimHoje)
                    : (dataAgendamento >= inicioHoje && dataAgendamento <= fimSemana);

                return matchesDate;
            })
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [filtro, searchQuery, initialData]);

    const handleSendWhatsApp = async (agendamentoId: number) => {
        const isConfirmed = await handleConfirmMessage(agendamentoId);
        if (!isConfirmed) return;
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

    async function handleConfirmMessage(id: number) {
        const dataResponse = initialData.filter(
            (appointment: any) => String(appointment.id) === String(id)
        );
        const dataObj = dataResponse[0]?.dataHora ? new Date(dataResponse[0]?.dataHora) : null;
        const dataFormatada = dataObj
            ? dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : '00/00';

        const horaFormatada = dataObj
            ? dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '00:00';

        const pacienteNome = dataResponse[0]?.paciente?.nome || 'Paciente não identificado';
        const pacienteTelefone = dataResponse[0]?.paciente?.telefone || '(00) 00000-0000';
        const infoPersonal = pacienteNome ? `*${pacienteNome}*` : "paciente";
        const infoProfissional = dataResponse[0]?.profissional?.nome ? ` com o(a) *${dataResponse[0]?.profissional?.nome}*` : "";
        const data = dataFormatada;
        const hora = horaFormatada;
        const mensagemCorpo = `
    Olá, ${infoPersonal}! 👋
    
    Você tem uma consulta${infoProfissional} agendada para hoje (${data}) às *${hora}h*.
    
    ✅ *Por favor, confirme sua presença clicando no link abaixo:*
    [Link de Confirmação]
    📍 *Nosso endereço:*
    Rua Cristóvão Colombo, nº 1433, Centro - Alto Paraná.
    
    Muito obrigado(a)! 😊`.trim();

        const result = await Swal.fire({
            title: "Confirmar envio?",
            icon: "question",
            html: `
            <div style="text-align: left; font-size: 0.9rem; line-height: 1.5;">
                <p><strong>Enviando para:</strong> ${pacienteNome}</p>
                <p><strong>Número de WhatsApp:</strong> ${pacienteTelefone}</p>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
                <p style="margin-bottom: 5px;"><strong>Prévia da mensagem:</strong></p>
                <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; border: 1px solid #ddd; font-style: italic; color: #555;">
                    "${mensagemCorpo}"
                </div>
            </div>
        `,
            showCancelButton: true,
            confirmButtonColor: "#0ea5e9",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sim, enviar agora",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: "Enviando!",
                text: "A mensagem foi Disparada para o WhatsApp.",
                icon: "info",
                timer: 2000,
                showConfirmButton: false
            });
            return true;
        }
        return false;
    }

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