import ButtonSendConfirmation from "@/app/components/ButtonSendConfirmation";
import ButtonWhatsApp from "@/app/components/ButtonWhatsApp";
import { Eye, MoreHorizontal, Trash2, X } from "lucide-react";

export default function GroupActionsBtn({ setOpenMenuId, openMenuId, isFirstOfTwoItemsMenuOpen, isLastItem, setSelectedSchedule, loading, handleMessage, handleDelete, s }: any) {

    const classNameOpenMenu = `fixed bottom-0 left-0 right-0 z-70 w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 
            md:absolute md:right-0 md:left-auto md:w-64 md:rounded-2xl md:p-2 md:shadow-xl md:border md:border-gray-100 md:dark:border-gray-800
            ${isFirstOfTwoItemsMenuOpen ? 'md:top-[110%] md:bottom-auto md:animate-in md:fade-in md:slide-in-from-top-2' : isLastItem
            ? 'md:bottom-[110%] md:top-auto md:animate-in md:fade-in md:slide-in-from-bottom-2'
            : 'md:top-[110%] md:bottom-auto md:animate-in md:fade-in md:slide-in-from-top-2'} 
                duration-200
            `;

    return (
        <div className="relative shrink-0 flex justify-end">
            <button
                onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                className="group flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-sky-600 dark:bg-gray-800 dark:hover:bg-sky-600 rounded-md transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors">Ações</span>
                <MoreHorizontal size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-white" />
            </button>

            {openMenuId === s.id && (
                <>
                    <div className="fixed inset-0 z-60 bg-black/20 backdrop-blur-[2px] md:bg-transparent" onClick={() => setOpenMenuId(null)} />

                    <div className={classNameOpenMenu}>

                        <div className="flex items-center justify-between mb-4 md:hidden">
                            <h3 className="font-bold text-gray-900 dark:text-white">Opções do Agendamento</h3>
                            <button onClick={() => setOpenMenuId(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 md:space-y-1">
                            <button
                                onClick={() => { setSelectedSchedule(s); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-3 py-3 md:py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200 group cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-9 h-9 md:w-8 md:h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sky-600 group-hover:scale-110 transition-transform">
                                    <Eye size={18} />
                                </div>
                                <span className="font-semibold md:font-medium text-base md:text-sm">Ver Detalhes</span>
                            </button>

                            <button
                                onClick={() => { handleDelete(s.id); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-3 py-3 md:py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 group cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-9 h-9 md:w-8 md:h-8 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                                    <Trash2 size={18} />
                                </div>
                                <span className="font-semibold md:font-medium text-base md:text-sm">Excluir</span>
                            </button>

                            {s.statusConfirmacao === 'PENDENTE' && (
                                <div className="pt-1 mt-1 border-t dark:border-gray-800 md:border-none md:pt-0 md:mt-0">
                                    <ButtonSendConfirmation
                                        agendamentoId={s.id}
                                        onSend={async () => { handleMessage(s.id); setOpenMenuId(null); }}
                                        isLoading={loading}
                                    />
                                </div>
                            )}

                            <div className="w-full">
                                <ButtonWhatsApp schedule={s} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}