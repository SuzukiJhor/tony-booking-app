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
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <Toaster position="top-right" reverseOrder={true} containerStyle={{
                zIndex: 99999,
            }} />
            <TitlePage title="Visão Geral dos Pacientes" />

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
                <p className="text-muted-foreground">Total: {initialData.length} pacientes</p>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 font-medium transition"
                >
                    + Novo Paciente
                </button>
            </div>

            {filteredData.length > 0 ? (
                <div className="space-y-8">
                    <div className={`space-y-4 transition-opacity ${controller.isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                        {currentItems.map((patient) => (
                            <ClientListItem
                                key={patient.id}
                                patient={patient}
                                onViewDetails={(id) => console.log("Details", id)}
                            />
                        ))}
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredData.length}
                        goToPage={setCurrentPage}
                        isTransitioning={controller.isTransitioning}
                    />
                </div>
            ) : (
                <ButtonCreateNewEmpty
                    onClick={() => handleOpenModal()}
                    description="Nenhum paciente encontrado."
                    descriptionButton="Cadastrar Novo Paciente"
                />
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