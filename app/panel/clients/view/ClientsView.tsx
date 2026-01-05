'use client';

import React, { useState, useMemo } from 'react';
import TitlePage from "@/app/panel/components/TitlePage";
import { useClientsController } from '../controller/ClientsController';
import ClientListItem from '../components/ClientListItem';
import PaginationControls from '../../components/PaginationControls';
import ButtonCreateNewEmpty from '../../components/ButtonCreateNewEmpty';
import DialogNewClient from '../../components/DialogNewClient';
import { Toaster } from 'react-hot-toast';

export default function ClientsView({ initialData }: { initialData: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const controller = useClientsController();
    const itemsPerPage = 6;

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

    const handleOpenModal = (client?: any) => {
        setSelectedClient(client || null);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-background-tertiary">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{ zIndex: 99999 }} />

            <div className="grow p-4 pb-32 md:pb-24">
                <TitlePage title="Visão Geral dos Pacientes" />

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
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-sky-500 text-white py-2.5 px-6 rounded-xl hover:bg-sky-400 font-semibold transition-all shadow-sm active:scale-95"
                    >
                        + Novo Paciente
                    </button>
                </div>

                {filteredData.length > 0 ? (

                    <div className={`space-y-4 transition-opacity ${controller.isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                        <p className="text-muted-foreground">Total: {initialData.length} pacientes</p>

                        {currentItems.map((patient) => (
                            <ClientListItem
                                key={patient.id}
                                patient={patient}
                                onViewDetails={(id) => console.log("Details", id)}
                            />
                        ))}
                    </div>
                ) : (
                    <ButtonCreateNewEmpty
                        onClick={() => handleOpenModal()}
                        description="Nenhum paciente encontrado."
                        descriptionButton="Cadastrar Novo Paciente"
                    />
                )}
            </div>

            {filteredData.length > 0 && (
                <div className="fixed bottom-0 left-0 lg:left-54 right-0 z-20 bg-background dark:bg-background-tertiary backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <div className="max-w-7xl mx-auto">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredData.length}
                            goToPage={setCurrentPage}
                            isTransitioning={controller.isTransitioning}
                        />
                    </div>
                </div>
            )}

            <DialogNewClient
                open={isModalOpen}
                selectedClient={selectedClient}
                onClose={() => setIsModalOpen(false)}
                onAdd={async (data: any) => {
                    await controller.onAdd(data, () => setIsModalOpen(false));
                }}
                onUpdate={async (data: any) => {
                    await controller.onUpdate(selectedClient.id, data, () => setIsModalOpen(false));
                }}
                onDelete={async () => {
                    await controller.onDelete(selectedClient.id, selectedClient.data);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}