"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import GoToBack from "@/app/components/GoToBack";
import { formatPhone } from "@/util/mask/mask-phone-br";
import HistoryTable from "../../components/HistoryTable";
import SubTitlePage from "@/app/panel/components/SubTitlePage";
import { ActionButtons } from "../../../../components/ActionsButtons";
import { useClientsController } from "../../controller/ClientsController";
import { User, Phone, FileText, Mail, Calendar, ArrowLeft, History } from "lucide-react";
import { ProfessionalInfo } from "@/app/panel/professionals/components/ProfessionalInfo";

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
        router.push("/panel/clients");
    };

    const handlePhoneChange = (val: string) => {
        setFormData({ ...formData, telefone: formatPhone(val) });
    };

    const agendamentos = initialPatient.agendamentos
        ?.filter((a: any) => !a.isDeleted)
        .sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()) ?? [];

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
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

