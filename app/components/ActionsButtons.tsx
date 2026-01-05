"use client";

import { Save, X, Edit, CheckCircle, Trash2 } from "lucide-react";
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
}: ActionButtonsProps) => {
    return (
        <div className="w-full sm:w-auto">
            {isEditing ? (
                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full">
                    <ButtonCard onClick={onCancel}>
                        <X size={16} className="shrink-0" />
                        <span className="truncate">Cancelar</span>
                    </ButtonCard>

                    <ButtonCard onClick={onSave}>
                        <Save size={16} className="shrink-0" />
                        <span className="truncate text-xs sm:text-sm">Salvar</span>
                    </ButtonCard>
                </div>
            ) : (
                <div className="flex items-center justify-end gap-2 w-full">
                    {!isActive && (
                        <ButtonCard onClick={onActivate}>
                            <CheckCircle size={16} className="shrink-0" />
                            <span className="truncate">Ativar</span>
                        </ButtonCard>
                    )}

                    <ButtonCard
                        onClick={onEdit}
                        disabled={!isActive}
                    >
                        <Edit size={16} className="shrink-0" />
                        <span className="truncate">Editar</span>
                    </ButtonCard>

                    {/* Botão Deletar com destaque vermelho */}
                    <div className="grow sm:grow-0">
                        <button
                            onClick={onDelete}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 active:scale-95 cursor-pointer"
                        >
                            <Trash2 size={16} className="shrink-0" />
                            <span className="truncate">Deletar</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};