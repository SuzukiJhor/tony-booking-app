import { ArrowRight, ListFilter } from "lucide-react";
import ButtonCard from "./ButtonCard";

export default function RedirectToDetailsSchedules() {
    return (
        <div className="bg-white dark:bg-background-secondary p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                    <ListFilter className="text-sky-600 dark:text-sky-400" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    Agenda Detalhada
                </h3>
            </div>

            <div className="grow">
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                    Visualize todos os agendamentos do dia e da semana, aplique filtros rápidos e acesse detalhes completos dos pacientes.
                </p>
            </div>

            <ButtonCard
                href="/dashboard/scheduleList"
            >
                Ver Listagem Completa
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </ButtonCard>
        </div>
    );
}