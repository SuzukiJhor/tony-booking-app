"use client";

import { Save, X, Edit, Trash2, CheckCircle } from "lucide-react";
import ButtonCard from "@/app/components/ButtonCard";

interface ActionButtonsProps {
    isEditing: boolean;
    isActive?: boolean; 
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => Promise<void> | void;
    onDelete: () => Promise<void> | void;
    onActivate?: () => Promise<void> | void;
    labelDelete?: string;
}

export const ActionButtons = ({
    isEditing,
    isActive = true,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    onActivate,
    labelDelete = "Excluir",
}: ActionButtonsProps) => {
    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <ButtonCard onClick={onCancel} >
                        <X size={16} />
                        Cancelar
                    </ButtonCard>

                    <ButtonCard onClick={onSave}>
                        <Save size={16} />
                        Salvar Alterações
                    </ButtonCard>
                </>
            ) : (
                <>
                    {!isActive && (
                        <ButtonCard
                            onClick={onActivate}
                        >
                            <CheckCircle size={16} />
                            Ativar Profissional
                        </ButtonCard>
                    )}

                    <ButtonCard
                        onClick={onEdit}
                        disabled={!isActive}
                    >
                        <Edit size={16} />
                        Editar
                    </ButtonCard>

                    {/* <ButtonCard
                        onClick={onDelete}
                    >
                        <Trash2 size={16} />
                        {labelDelete}
                    </ButtonCard> */}
                </>
            )}
        </div>
    );
};