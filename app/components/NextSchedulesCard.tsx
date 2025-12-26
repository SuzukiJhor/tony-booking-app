import { Clock } from "lucide-react";
import SubTitlePage from "../dashboard/components/SubTitlePage";
import { statusStyleMap } from "../dashboard/constants";

interface NextSchedulesCardProps {
    groupedSchedules: {
        hoje: {
            patientName: string;
            id: number;
            dataHora: string;
            status: string;
            isDeleted: boolean;
            statusConfirmacao: string;
        }[];
        amanha: {
            patientName: string;
            id: number;
            dataHora: string;
            status: string;
            isDeleted: boolean;
            statusConfirmacao: string;
        }[];
    };
}
const formatTime = (date: Date) =>
    date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

const StatusBadge = ({ status }: { status: string }) => {
    const config = statusStyleMap[status] || statusStyleMap.PENDENTE;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.classes}`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

const renderItem = (s: {
    patientName: string;
    id: number;
    dataHora: string;
    status: string;
    isDeleted: boolean;
    statusConfirmacao: string;
}) => {
    const date = new Date(s.dataHora);
    return (
        <div key={s.id} className="group py-3 px-2 flex justify-between items-center rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div>
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors">
                    {s.patientName}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={12} className="text-gray-400" />
                    {formatTime(date)}
                </div>
            </div>
            <div className="flex items-end">
                <StatusBadge status={s.statusConfirmacao} />
            </div>
        </div>
    );
};

export default function NextSchedulesCard({ groupedSchedules }: NextSchedulesCardProps) {
    return (
        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
            <SubTitlePage text="Próximos Agendamentos" />
            <ul className="space-y-8 pt-6">
                {groupedSchedules.hoje.length === 0 && groupedSchedules.amanha.length === 0 && (
                    <li className="py-4 text-sm text-gray-500 text-center">Nenhum agendamento próximo</li>
                )}

                {groupedSchedules.hoje.length > 0 && (
                    <li>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">Hoje</h4>
                            <div className="grow border-t border-sky-100 dark:border-sky-900/30"></div>
                        </div>
                        <div className="space-y-1">{groupedSchedules.hoje.map((s: NextSchedulesCardProps['groupedSchedules']['hoje'][number]) => renderItem(s))}</div>
                    </li>
                )}

                {groupedSchedules.amanha.length > 0 && (
                    <li>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Amanhã</h4>
                            <div className="grow border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="space-y-1">{groupedSchedules.amanha.map((s: NextSchedulesCardProps['groupedSchedules']['amanha'][number]) => renderItem(s))}</div>
                    </li>
                )}
            </ul>
        </div>
    );
}