'use client';

import { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import TitlePage from '../../components/TitlePage';
import PaginationControls from '../../components/PaginationControls';
import ProfessionalListItem from '../components/ProfessionalListItem';
import ButtonCreateNewEmpty from '../../components/ButtonCreateNewEmpty';
import DialogNewProfessional from '../../components/DialogNewProfessional';
import { useProfessionalController } from '../controller/useProfessionalController';

export default function ProfessionalsView({ initialData }: { initialData: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { onUpdate, onDelete, onAdd } = useProfessionalController();
    const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

    const itemsPerPage = 5;

    const filteredData = useMemo(() => {
        return initialData.filter(client =>
            client.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialData, searchQuery]);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-background-tertiary">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{ zIndex: 99999 }} />

            <div className="grow p-4 pb-32 md:pb-24">
                <TitlePage title="Visão Geral dos Dentistas" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="relative w-full md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full p-2.5 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-secondary focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-amber-100"
                        />
                        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    </div>

                    <button
                        onClick={() => { setSelectedProfessional(null); setIsModalOpen(true); }}
                        className="w-full md:w-auto bg-sky-500 text-white py-2.5 px-6 rounded-xl hover:bg-sky-400 font-semibold transition-all shadow-sm active:scale-95"
                    >
                        + Novo Dentista
                    </button>
                </div>

                {filteredData.length === 0 ? (
                    <ButtonCreateNewEmpty
                        onClick={() => setIsModalOpen(true)}
                        description="Nenhum Dentista cadastrado encontrado."
                        descriptionButton="Cadastrar Novo Dentista"
                    />
                ) : (
                    <div className="space-y-4">
                        <p className="text-muted-foreground">Total: {initialData.length}</p>

                        {currentItems.map((pro) => (
                            <ProfessionalListItem
                                key={pro.id}
                                professional={pro}
                                onEdit={() => { setSelectedProfessional(pro); setIsModalOpen(true); }}
                                onViewDetails={() => (console.log("Details"))}
                            />
                        ))}
                    </div>
                )}
            </div>

            {filteredData.length > 0 && (
                <div className="fixed bottom-0 left-0 lg:left-54 right-0 z-20 bg-background dark:bg-background-tertiary backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <div className="max-w-7xl mx-auto">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredData.length}
                            isTransitioning={false}
                        />
                    </div>
                </div>
            )}

            <DialogNewProfessional
                open={isModalOpen}
                selectedProfessional={selectedProfessional}
                onClose={() => setIsModalOpen(false)}
                onAdd={(data: any) => { onAdd(data, () => setIsModalOpen(false)) }}
                onUpdate={(data: any) => { onUpdate(selectedProfessional.id, data, () => setIsModalOpen(false)) }}
                onDelete={() => { onDelete(selectedProfessional.id, selectedProfessional.nome) }}
            />
        </div>
    );
}