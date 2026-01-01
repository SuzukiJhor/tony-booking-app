"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, FileText, Mail, Calendar, ArrowLeft, History, Activity, Clock } from "lucide-react";
import SubTitlePage from "@/app/dashboard/components/SubTitlePage";
import { useClientsController } from "../../controller/ClientsController";
import { ActionButtons } from "../../../../components/ActionsButtons";
import { ProfessionalInfo } from "@/app/dashboard/professionals/components/ProfessionalInfo";
import GoToBack from "@/app/components/GoToBack";
import { formatPhone } from "@/util/mask/mask-phone-br";

interface Props {
    initialPatient: any;
}

export default function ClientDetailsView({ initialPatient }: Props) {
    const { onUpdate, onDelete } = useClientsController();
    const [formData, setFormData] = useState(initialPatient);
    const [isEditing, setIsEditing] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const router = useRouter();

    const handleUpdate = async () => {
        await onUpdate(initialPatient.id, formData, () => setIsEditing(false));
    };

    const handleDelete = async () => {
        await onDelete(initialPatient.id, initialPatient.nome);
        router.push("/dashboard/professionals");
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, telefone: formatPhone(e.target.value) });
    };

    const agendamentos = initialPatient.agendamentos
        ?.filter((a: any) => !a.isDeleted)
        .sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()) ?? [];

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <div className="flex items-center justify-between">
                <GoToBack SubTitlePage="Detalhes do Paciente" />

                <ActionButtons
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onCancel={() => {
                        setFormData(initialPatient);
                        setIsEditing(false);
                    }}
                    onSave={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>

            <SubTitlePage text={`Informações de ${initialPatient.nome}`} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 bg-sky-100 dark:bg-sky-900/40 rounded-full flex items-center justify-center text-sky-700 dark:text-sky-300">
                            <User size={32} />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    className="text-2xl font-bold bg-transparent border-b border-sky-500 focus:outline-none w-full dark:text-card"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-foreground dark:text-card">{initialPatient.nome}</h2>
                            )}
                            <p className="text-sky-600 dark:text-sky-400 font-medium">ID: #{initialPatient.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 border-t dark:border-gray-700 pt-6">
                        <ProfessionalInfo
                            icon={<Phone size={18} />}
                            label="Telefone"
                            value={formData.telefone}
                            isEditing={isEditing}
                            onChange={handlePhoneChange}
                        />
                        <ProfessionalInfo
                            icon={<Mail size={18} />}
                            label="E-mail"
                            value={formData.email}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, email: val })}
                        />
                        <ProfessionalInfo
                            icon={<FileText size={18} />}
                            label="Documento"
                            value={formData.documento || "---"}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, documento: val })}
                        />
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
                    <div className="bg-white dark:bg-background-secondary rounded-xl border dark:border-gray-700 p-6 flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">Relatórios e Histórico</p>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-background-tertiary dark:hover:bg-gray-800 text-gray-700 dark:text-card rounded-lg transition font-medium cursor-pointer"
                        >
                            <History size={16} />
                            {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
                        </button>
                    </div>
                </div>
            </div>

            {showHistory && <HistoryTable agendamentos={agendamentos} />}
        </div>
    );
}

function HistoryTable({ agendamentos }: { agendamentos: any[] }) {
    return (
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
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Procedimento</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data / Hora</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Duração</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {agendamentos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                    Nenhum agendamento registrado.
                                </td>
                            </tr>
                        ) : (
                            agendamentos.map((ag) => (
                                <tr key={ag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-sky-700 dark:text-sky-400">{ag.tipoAgendamento}</p>
                                    </td>
                                    <td className="p-4 text-sm dark:text-card">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{new Date(ag.dataHora).toLocaleString('pt-BR')}</span>
                                            <span className="text-[10px] text-sky-600 uppercase font-bold">
                                                {new Date(ag.dataHora).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1"><Clock size={14} /> {ag.tempoAtendimento} min</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={ag.statusConfirmacao} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        CONFIRMADO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PENDENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        CANCELADO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}