"use client";
import { useState } from "react";
import ButtonCard from "@/app/components/ButtonCard";
import { useParams, useRouter } from "next/navigation";
import { useClient } from "@/app/context/ClientsContext";
import { ArrowLeft, History, User, Phone, Mail, FileText, Activity, Calendar, Clock } from "lucide-react";
import { DataBasePacienteType } from "../../types/patientDBType";
import { LoadingSpinner } from "@/app/components/LoadingProvider";
import { formatDate } from "@/util/date/date-br";
import SubTitlePage from "../../components/SubTitlePage";

export default function ClientDetailsPage() {
    const [showHistory, setShowHistory] = useState(true);
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { clients } = useClient() as {
        clients: DataBasePacienteType[];
    };

    if (!clients || clients.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background dark:bg-background-tertiary">
                <LoadingSpinner />
            </div>
        );
    }

    const client = clients.find((c) => String(c.id) === String(id));

    if (!client) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-full text-red-500">
                    <User size={64} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold dark:text-white">Paciente não encontrado</h2>
                <button onClick={() => router.back()} className="text-sky-600 font-medium">Voltar</button>
            </div>
        );
    }

    const agendamentos = client.agendamentos
        ?.filter((a) => !a.isDeleted)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()) ?? [];

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition cursor-pointer dark:border-card dark:text-card"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Voltar</h2>
            </div>

            <SubTitlePage text="Visão Detalhada do Paciente" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 bg-sky-100 dark:bg-sky-900/40 rounded-full flex items-center justify-center text-sky-700 dark:text-sky-300">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground dark:text-card">{client.nome}</h2>
                            <p className="text-sky-600 dark:text-sky-400 font-medium">ID: #{client.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 border-t dark:border-gray-700 pt-6">
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Telefone</p>
                                <p className="text-sm font-medium dark:text-card">{client.telefone || "Não informado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">E-mail</p>
                                <p className="text-sm font-medium dark:text-card">{client.email || "---"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Documento</p>
                                <p className="text-sm font-medium dark:text-card">{"---"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total de Consultas</p>
                                <p className="text-sm font-medium dark:text-card">{agendamentos.length} atendimentos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-background-secondary rounded-xl border text-white dark:border-gray-700 p-6 flex flex-col gap-4 justify-center">
                        <p className="text-sm text-muted-foreground mb-4">Relatórios e Histórico</p>
                        <ButtonCard onClick={() => setShowHistory((prev) => !prev)}>
                            <History size={16} />
                            {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
                        </ButtonCard>
                    </div>
                </div>
            </div>

            {showHistory && (
                <div className="bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2 dark:text-card">
                            <Activity size={20} className="text-sky-600" />
                            Histórico de Atendimentos
                        </h2>
                        <span className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full font-medium">
                            {agendamentos.length} Registros
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-background-tertiary">
                                <tr>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Procedimento / Tipo</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data / Hora</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Duração</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {agendamentos.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                            Nenhum agendamento registrado para este paciente.
                                        </td>
                                    </tr>
                                ) : (
                                    agendamentos.map((agendamento: any) => (
                                        <tr key={agendamento.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-sky-700 dark:text-sky-400">
                                                    {agendamento.tipoAgendamento || "Consulta"}
                                                </p>
                                            </td>
                                            <td className="p-4 text-sm dark:text-card">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {formatDate(agendamento.dataHora)}
                                                    </span>
                                                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase">
                                                        {new Date(agendamento.dataHora).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {agendamento.tempoAtendimento} min
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase
                                                    ${agendamento.statusConfirmacao === 'CONFIRMADO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        agendamento.statusConfirmacao === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {agendamento.statusConfirmacao}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}