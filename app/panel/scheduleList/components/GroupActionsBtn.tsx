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
                className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-alltext-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-200 dark:shadow-none active:scale-95 cursor-pointer'
            >
                <span className="text-xs font-bold text-white dark:text-gray-300 group-hover:text-white transition-colors">Ações</span>
                <MoreHorizontal size={20} className="text-white dark:text-gray-400 group-hover:text-white" />
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

                        <div className="flex items-center md:space-y-1 gap-2">
                            <button
                                onClick={() => { setSelectedSchedule(s); setOpenMenuId(null); }}
                                className="flex-1 flex flex-col md:flex-row px-3 py-3 items-center justify-center gap-1 md:gap-2 p-2 md:px-3 md:py-2 bg-gray-50 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-all group cursor-pointer"
                            >
                                <Eye size={18} className="text-sky-600" />
                                <span className="text-[10px] md:text-xs font-bold md:font-medium">Ver</span>
                            </button>

                            <button
                                onClick={() => { handleDelete(s.id); setOpenMenuId(null); }}
                                className="cursor-pointer flex-1 flex flex-col md:flex-row px-3 py-3 items-center justify-center gap-1 md:gap-2 p-2 md:px-3 md:py-2 bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-all group"
                            >
                                <Trash2 size={18} />
                                <span className="text-[10px] md:text-xs font-bold md:font-medium">Excluir</span>
                            </button>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 md:hidden" />

                        <div className="space-y-2 pb-8">
                            {s.statusConfirmacao === 'PENDENTE' && (
                                <ButtonSendConfirmation
                                    agendamentoId={s.id}
                                    onSend={async () => { handleMessage(s.id); setOpenMenuId(null); }}
                                    isLoading={loading}
                                />
                            )}
                            <ButtonWhatsApp schedule={s} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}