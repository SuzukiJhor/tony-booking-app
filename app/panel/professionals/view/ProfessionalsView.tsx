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
    const { onUpdate, onDelete, onAdd } = useProfessionalController();
    const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(initialData.length / itemsPerPage);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return initialData.slice(start, start + itemsPerPage);
    }, [currentPage, initialData]);

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
            <TitlePage title="Visão Geral dos Dentistas" />

            <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">Total: {initialData.length}</p>
                <button
                    onClick={() => { setSelectedProfessional(null); setIsModalOpen(true); }}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 transition cursor-pointer"
                >
                    + Novo Dentista
                </button>
            </div>

            {initialData.length === 0 ? (
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
                    <PaginationControls currentPage={currentPage} totalPages={totalPages} goToPage={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={initialData.length} isTransitioning={false} />
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