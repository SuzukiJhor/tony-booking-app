import { MessageCircle } from "lucide-react";

const handleWhatsApp = (phone: string | undefined, name: string | undefined) => {
    if (!phone) {
        return;
    }
    const message = encodeURIComponent(`Olá ${name || ''}, confirmamos seu agendamento.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
};

export default function ButtonWhatsApp({ schedule }: { schedule: any }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                handleWhatsApp(
                    schedule?.paciente?.telefone,
                    schedule?.paciente?.nome
                );
            }}
            className="flex items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-2 text-green-600 bg-green-50/50 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/30 rounded-xl transition-all border border-green-100 dark:border-green-800/50 font-semibold text-sm cursor-pointer group w-full sm:w-auto"
            title="Enviar WhatsApp"
        >
            <MessageCircle size={20} className="transition-transform group-hover:scale-110 shrink-0" />
            <span className="sm:inline whitespace-nowrap">Enviar mensagem</span>
        </button>
    );
}