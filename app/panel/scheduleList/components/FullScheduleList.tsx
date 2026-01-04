import ButtonCard from "@/app/components/ButtonCard";
import ButtonWhatsApp from "@/app/components/ButtonWhatsApp";
import { selectColorByStatus } from "@/util/selectColorByStatus";
import { Calendar, Clock, Eye, Phone, Timer, UserCheck } from "lucide-react";

export default function FullScheduleList({ filteredAppointments, setSelectedSchedule }: { filteredAppointments: any[], setSelectedSchedule: (schedule: any) => void }) {
    return (
        <div className="divide-y dark:divide-gray-800">
            {filteredAppointments.length > 0 ? (
                filteredAppointments.map((s) => (
                    <div key={s.id} className="p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="flex gap-5 items-center flex-1 min-w-0">
                            <div className="text-center min-w-17.5 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                                <p className="text-[10px] uppercase font-bold text-sky-600">
                                    {new Date(s.dataHora).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                </p>
                                <p className="text-xl font-black text-gray-800 dark:text-white">
                                    {new Date(s.dataHora).getDate()}
                                </p>
                            </div>

                            <div className="space-y-1 overflow-hidden">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-62.5">
                                        {s.paciente?.nome || 'Paciente não identificado'}
                                    </p>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${selectColorByStatus(s.statusConfirmacao).classes}`}>
                                        {selectColorByStatus(s.statusConfirmacao).label}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5 font-medium text-sky-600 dark:text-sky-400">
                                        <Clock size={14} />
                                        {new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {s.paciente?.telefone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={14} />
                                            {s.paciente.telefone}
                                        </span>
                                    )}

                                    <span className="flex items-center gap-1.5 shrink-0">
                                        <Timer size={14} /> {s.tempoAtendimento || 0} min
                                    </span>

                                    {s.profissional && (
                                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                                            <UserCheck size={14} /> {s.profissional.nome}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 shrink-0 md:ml-4">
                            <div className="flex-none">
                                <ButtonWhatsApp schedule={s} />
                            </div>
                            <div className="flex-none">
                                <ButtonCard onClick={() => setSelectedSchedule(s)}>
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} />
                                        <span>Detalhes</span>
                                    </div>
                                </ButtonCard>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-gray-400 opacity-50" />
                    </div>
                    <h4 className="text-gray-900 dark:text-white font-bold">Nenhum agendamento</h4>
                    <p className="text-gray-500 text-sm">Não encontramos registros para o filtro selecionado.</p>
                </div>
            )}
        </div>
    );
}