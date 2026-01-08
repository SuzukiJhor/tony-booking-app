'use client';

import { useState } from "react";
import { Calendar } from "lucide-react";
import ListDetails from "./ListDetails";
import GroupActionsBtn from "./GroupActionsBtn";

export default function FullScheduleList({ filteredAppointments, setSelectedSchedule, handleMessage, handleDelete, loading }: { filteredAppointments: any[], setSelectedSchedule: (schedule: any) => void, handleMessage: (id: number) => void, handleDelete: (id: number) => void, loading: boolean }) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const isSingleItemMenuOpen = filteredAppointments.length === 1 && openMenuId !== null;
    const isFirstOfTwoItemsMenuOpen = filteredAppointments.length === 2 && openMenuId === filteredAppointments[0].id;
    const isLastOfTwoItemsMenuOpen = filteredAppointments.length === 2 && openMenuId === filteredAppointments[1].id;

    const classNameOpenMenu = `divide-y dark:divide-gray-800 transition-all duration-300 ${isFirstOfTwoItemsMenuOpen
        ? 'pb-40'
        : isLastOfTwoItemsMenuOpen
            ? 'pt-20'
            : isSingleItemMenuOpen
                ? 'pb-60'
                : 'pb-0'
        }`;

    return (
        <div className={classNameOpenMenu}>
            {filteredAppointments.length > 0 ? (
                filteredAppointments.map((s, index) => {
                    const isLastItem = filteredAppointments.length > 1 && index >= filteredAppointments.length - 2;

                    return (
                        <div
                            key={s.id}
                            className={`p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${openMenuId === s.id ? 'z-50' : 'z-10'}`}
                        >
                            <ListDetails s={s} />

                            <GroupActionsBtn
                                setOpenMenuId={setOpenMenuId}
                                openMenuId={openMenuId}
                                isFirstOfTwoItemsMenuOpen={isFirstOfTwoItemsMenuOpen}
                                isLastItem={isLastItem}
                                setSelectedSchedule={setSelectedSchedule}
                                loading={loading}
                                handleDelete={handleDelete}
                                handleMessage={handleMessage}
                                s={s}
                            />
                        </div>
                    );
                })
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