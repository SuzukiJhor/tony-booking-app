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
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
            <TitlePage title="Visão Geral dos Dentistas" />

            <div className="relative w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 pl-10 rounded-lg border dark:text-amber-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-background-secondary focus:ring-2 focus:ring-sky-500 outline-none"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                    🔍
                </span>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">Total: {initialData.length}</p>
                <button
                    onClick={() => { setSelectedProfessional(null); setIsModalOpen(true); }}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 transition cursor-pointer"
                >
                    + Novo Dentista
                </button>
            </div>

            {filteredData.length === 0 ? (
                <ButtonCreateNewEmpty onClick={() => setIsModalOpen(true)} description="Nenhum Dentista cadastrado encontrado." descriptionButton="Cadastrar Novo Dentista" />
            ) : (
                <div className="space-y-4">
                    {currentItems.map((pro) => (
                        <ProfessionalListItem
                            key={pro.id}
                            professional={pro}
                            onEdit={() => { setSelectedProfessional(pro); setIsModalOpen(true); }}
                            onViewDetails={() => (console.log("View details function can be implemented here"))}
                        />
                    ))}
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} goToPage={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={filteredData.length} isTransitioning={false} />
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