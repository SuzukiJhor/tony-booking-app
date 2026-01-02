import { Activity, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function HistoryTable({ agendamentos }: { agendamentos: any[] }) {
    return (
        <div className="bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2 dark:text-card">
                    <Activity size={20} className="text-sky-600" />
                    Histórico de Atendimentos
                </h2>
                <span className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full font-medium">
                    {agendamentos.length} Registros
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-background-tertiary">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Procedimento</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data / Hora</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Duração</th>
                            <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {agendamentos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                    Nenhum agendamento registrado.
                                </td>
                            </tr>
                        ) : (
                            agendamentos.map((ag) => (
                                <tr key={ag.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-sky-700 dark:text-sky-400">{ag.tipoAgendamento}</p>
                                    </td>
                                    <td className="p-4 text-sm dark:text-card">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{new Date(ag.dataHora).toLocaleString('pt-BR')}</span>
                                            <span className="text-[10px] text-sky-600 uppercase font-bold">
                                                {new Date(ag.dataHora).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1"><Clock size={14} /> {ag.tempoAtendimento} min</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={ag.statusConfirmacao} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}