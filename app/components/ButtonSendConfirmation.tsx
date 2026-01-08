"use client";

import { Loader2, MessageCircle } from "lucide-react";

interface ButtonSendConfirmationProps {
    agendamentoId: number;
    onSend: (id: number) => Promise<void>;
    isLoading: boolean;
}

export default function ButtonSendConfirmation({
    agendamentoId,
    onSend,
    isLoading
}: ButtonSendConfirmationProps) {

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;
        await onSend(agendamentoId);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-2 text-green-600 bg-green-50/50 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/30 rounded-xl transition-all border border-green-100 dark:border-green-800/50 font-semibold text-sm cursor-pointer group w-full sm:w-auto"

            title="Disparar confirmação oficial via Wuzapi"
        >
            {isLoading ? (
                <Loader2 size={18} className="animate-spin shrink-0" />
            ) : (
                <MessageCircle size={20} className="transition-transform group-hover:scale-110 shrink-0" />

            )}

            <span className="sm:inline whitespace-nowrap">
                {isLoading ? "Enviando..." : "Enviar Confirmação"}
            </span>
        </button>
    );
}