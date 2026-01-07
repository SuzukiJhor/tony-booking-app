import { selectColorByStatus } from "@/util/selectColorByStatus";
import {
    Clock, User, Calendar as CalendarIcon, X,
    Activity, Timer, CalendarCheck,
    ShieldCheck, Info
} from "lucide-react";

interface ModalDetailsProps {
    schedule: any;
    onClose: () => void;
}


export function NextSchedulesModalDetails({ schedule, onClose }: ModalDetailsProps) {
    if (!schedule) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-background-secondary w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800">

                <div className="relative p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Info size={18} className="text-sky-500" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Agendamento</h3>
                    </div>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                    <div className="flex items-center gap-4 p-3 bg-sky-50/50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 shadow-sm">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">Paciente</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{schedule.paciente.nome}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border dark:border-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                <CalendarIcon size={14} /> Data
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-gray-200">
                                {new Date(schedule.dataHora).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border dark:border-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                <Clock size={14} /> Horário
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-gray-200">
                                {new Date(schedule.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Informações Técnicas</h4>

                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center justify-between p-2 text-sm border-b dark:border-gray-800">
                                <span className="flex items-center gap-2 text-gray-500"><Activity size={14} /> Tipo</span>
                                <span className="font-medium dark:text-gray-300">{schedule.tipoAgendamento}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 text-sm border-b dark:border-gray-800">
                                <span className="flex items-center gap-2 text-gray-500"><Activity size={14} /> Profissional</span>
                                <span className="font-medium dark:text-gray-300">{schedule.profissional.nome}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 text-sm border-b dark:border-gray-800">
                                <span className="flex items-center gap-2 text-gray-500"><Timer size={14} /> Duração</span>
                                <span className="font-medium dark:text-gray-300">{schedule.tempoAtendimento} minutos</span>
                            </div>

                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Status Atual</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black border shadow-sm ${selectColorByStatus(schedule.statusConfirmacao).classes}`}>
                                    {selectColorByStatus(schedule.statusConfirmacao).icon} {selectColorByStatus(schedule.statusConfirmacao).label}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Protocolo</p>
                                <p className="text-xs font-mono text-gray-500">#{schedule.id}</p>
                            </div>
                        </div>

                        {!schedule.mensagemEnviadaEm && (
                            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded text-[11px] text-gray-500">
                                <CalendarCheck size={14} />
                                Aguardando gatilho de disparo automático.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/5 border-t dark:border-gray-800 flex justify-between items-center">
                    <p className="text-[9px] text-gray-400">Criado em: {new Date(schedule.createdAt).toLocaleDateString()}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-900 dark:bg-sky-600 text-white rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-sky-500 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}