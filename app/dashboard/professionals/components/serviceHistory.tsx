import { formatDate } from "@/util/date/date-br";
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
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {agendamentos.map((ag: any) => (
                            <tr key={ag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4 font-semibold text-sky-700 dark:text-sky-400">{ag.paciente?.nome}</td>
                                <td className="p-4 text-sm dark:text-card">{formatDate(ag.dataHora)}</td>
                                <td className="p-4 text-center">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                                        {ag.statusConfirmacao}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}