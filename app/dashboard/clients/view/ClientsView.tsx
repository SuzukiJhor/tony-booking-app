'use client';

import React, { useState, useMemo } from 'react';
import TitlePage from "@/app/dashboard/components/TitlePage";
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

    const controller = useClientsController();
    const itemsPerPage = 6;

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return initialData.slice(start, start + itemsPerPage);
    }, [initialData, currentPage]);

    const totalPages = Math.ceil(initialData.length / itemsPerPage);

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

            <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">Total: {initialData.length} pacientes</p>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 font-medium transition"
                >
                    + Novo Paciente
                </button>
            </div>

            {initialData.length > 0 ? (
                <div className="space-y-8">
                    <div className={`space-y-4 transition-opacity ${controller.isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                        {currentItems.map((patient) => (
                            <ClientListItem
                                key={patient.id}
                                patient={patient}
                                // onEdit={() => handleOpenModal(patient)}
                                onViewDetails={(id) => console.log("Details", id)}
                            />
                        ))}
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={initialData.length}
                        goToPage={setCurrentPage}
                        isTransitioning={controller.isTransitioning}
                    />
                </div>
            ) : (
                <ButtonCreateNewEmpty
                    onClick={() => handleOpenModal()}
                    description="Nenhum paciente cadastrado."
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