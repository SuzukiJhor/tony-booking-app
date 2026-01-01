"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ServiceHistory from "../../components/serviceHistory";
import SubTitlePage from "@/app/dashboard/components/SubTitlePage";
import { ProfessionalInfo } from "../../components/ProfessionalInfo";
import { User, Phone, FileText, Trash2, Save, X, UserPen } from "lucide-react";
import { useProfessionalController } from "../../controller/useProfessionalController";
import RegistrationStatus from "../../components/RegistrationStatus";
import GoToBack from "@/app/components/GoToBack";
import { ActionButtons } from "@/app/components/ActionsButtons";
import { Toaster } from "react-hot-toast";
import { formatPhone } from "@/util/mask/mask-phone-br";

interface Props {
    initialProfessional: any;
}

export default function ProfessionalDetailsView({ initialProfessional }: Props) {
    const { onUpdate, onDelete } = useProfessionalController();
    const [formData, setFormData] = useState(initialProfessional);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    console.log("Initial Professional:", initialProfessional);
    const handleUpdate = async () => {
        await onUpdate(initialProfessional.id, formData, () => {
            setIsEditing(false);
        });
    };

    const handleDelete = async () => {
        await onDelete(initialProfessional.id, initialProfessional.nome);
        router.push("/dashboard/professionals");
    };

    const handlePhoneChange = (val: string) => {
        const formatted = formatPhone(val);
        setFormData((prev: any) => ({ ...prev, telefone: formatted }));
    };

    const handleActivate = async () => {
        await onUpdate(initialProfessional.id, { ...formData, ativo: true }, () => {
            router.refresh();
        });
    };

    const agendamentos = initialProfessional.agendamentos || [];

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
            <div className="flex items-center justify-between">
                <GoToBack SubTitlePage="Detalhes do Profissional" />

                <ActionButtons
                    isEditing={isEditing}
                    isActive={formData.ativo}
                    onEdit={() => setIsEditing(true)}
                    onCancel={() => {
                        setFormData(initialProfessional);
                        setIsEditing(false);
                    }}
                    onActivate={handleActivate}
                    onSave={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>

            <SubTitlePage text={`Informações de ${initialProfessional.nome}`} />

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
                                <h2 className="text-2xl font-bold text-foreground dark:text-card">{initialProfessional.nome}</h2>
                            )}
                            <p className="text-sky-600 dark:text-sky-400 font-medium">{initialProfessional.especialidade || "Clínico Geral"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 border-t dark:border-gray-700 pt-6">
                        <ProfessionalInfo
                            icon={<FileText size={18} />}
                            label="Documento / CRO"
                            value={formData.documento}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, documento: val })}
                        />
                        <ProfessionalInfo
                            icon={<Phone size={18} />}
                            label="Telefone"
                            value={formData.telefone}
                            isEditing={isEditing}
                            onChange={handlePhoneChange}
                        />
                        <ProfessionalInfo
                            icon={<UserPen size={18} />}
                            label="Especialidade"
                            value={formData.especialidade}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, especialidade: val })}
                        />
                    </div>
                </div>

                <RegistrationStatus status={initialProfessional.ativo ?? null} />
            </div>

            <ServiceHistory title="Histórico de Atendimentos" agendamentos={agendamentos} />
        </div>
    );
}