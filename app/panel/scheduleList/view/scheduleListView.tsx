'use client';
import { ListFilter } from "lucide-react";
import GoToBack from "@/app/components/GoToBack";
import FullScheduleList from "../components/FullScheduleList";
import { useScheduleListController } from "../controller/useScheduleListController";
import { NextSchedulesModalDetails } from "@/app/components/NextSchedulesModalDetails";

export default function ScheduleListView({ initialData }: { initialData: any[] }) {
    const {
        filtro,
        setFiltro,
        selectedSchedule,
        setSelectedSchedule,
        filteredAppointments
    } = useScheduleListController(initialData);

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
            <GoToBack SubTitlePage="Voltar" />

            <div className="bg-white dark:bg-background-secondary rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden mt-6">

                <div className="p-5 border-b dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sky-600">
                            <ListFilter size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Listagem de Agendamentos</h3>
                            <p className="text-xs text-gray-500 italic">Filtrando por: {filtro === 'hoje' ? 'Hoje' : 'Próximos 7 dias'}</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                        {['hoje', 'semana'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFiltro(type)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${filtro === type
                                    ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {type === 'hoje' ? 'Hoje' : 'Próximos 7 dias'}
                            </button>
                        ))}
                    </div>
                </div>

                <FullScheduleList
                    filteredAppointments={filteredAppointments}
                    setSelectedSchedule={setSelectedSchedule}
                />
            </div>

            {selectedSchedule && (
                <NextSchedulesModalDetails
                    schedule={selectedSchedule}
                    onClose={() => setSelectedSchedule(null)}
                />
            )}
        </div>
    );
}