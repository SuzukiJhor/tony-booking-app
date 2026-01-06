"use client";

import { Send, Loader2 } from "lucide-react";

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
            className={`
                flex items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-2 
                rounded-xl transition-all border font-semibold text-sm cursor-pointer group w-full sm:w-auto
                ${isLoading
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-600 hover:text-white dark:bg-sky-900/10 dark:text-sky-400 dark:border-sky-800/50 dark:hover:bg-sky-600 dark:hover:text-white"
                }
            `}
            title="Disparar confirmação oficial via Wuzapi"
        >
            {isLoading ? (
                <Loader2 size={18} className="animate-spin shrink-0" />
            ) : (
                <Send
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                />
            )}

            <span className="sm:inline whitespace-nowrap">
                {isLoading ? "Enviando..." : "Disparar Mensagem de Confirmação"}
            </span>
        </button>
    );
}