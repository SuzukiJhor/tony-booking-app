import { formatDate } from "@/util/date/date-br";
import { selectColorByStatus } from "@/util/selectColorByStatus";
import { Activity } from "lucide-react";

export default function ServiceHistory({ title, agendamentos }: any) {
    return (
        <div className="bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2 dark:text-card">
                    <Activity size={20} className="text-sky-600" />
                    {title}
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-background-tertiary">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Paciente</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data e Horário</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {agendamentos.map((ag: any) => {
                            const dateObj = new Date(ag.dataHora);
                            const diaSemana = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                            const status = selectColorByStatus(ag.statusConfirmacao);

                            return (
                                <tr key={ag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-sky-700 dark:text-sky-400">
                                            {ag.paciente?.nome}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-500 bg-sky-50 dark:bg-sky-900/20 px-2 py-0.5 rounded w-fit">
                                                {diaSemana}
                                            </span>
                                            <span className="text-sm font-medium dark:text-card">
                                                {formatDate(ag.dataHora)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${status.classes}`}>
                                            {status.icon && <span className="mr-1.5">{status.icon}</span>}
                                            {status.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}