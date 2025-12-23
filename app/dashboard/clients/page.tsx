'use client';
import ClientListItem from './components/ClientListItem';
import { useClient } from "@/app/context/ClientsContext";
import React, { useState, useMemo, useEffect } from 'react';
import TitlePage from "@/app/dashboard/components/TitlePage";
import { DataBasePacienteType } from "../types/patientDBType";
import { useLoading } from '@/app/components/LoadingProvider';
import PaginationControls from '../components/PaginationControls';
import ButtonCreateNewEmpty from '../components/ButtonCreateNewEmpty';

export default function Clients() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false)
    const itemsPerPage = 6;

    const { clients, reloadEvents } = useClient() as { clients: DataBasePacienteType[], reloadEvents: () => void };
    const { setIsLoading } = useLoading();

    const handleViewDetails = (patientId: number) => {
        console.log(`Visualizar detalhes do paciente ID: ${patientId}`);
        console.log(`clients:`, clients);
    };

    const totalItems = clients ? clients.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentItems = useMemo(() => {
        if (!clients) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return clients.slice(startIndex, endIndex);
    }, [clients, currentPage, itemsPerPage]);


    const goToPage = (page: number) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(page);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, 300);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await reloadEvents();
            } catch (error) {
                console.error('Erro ao carregar dados dos clientes:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <TitlePage title=" Visão Geral dos Pacientes" />

            <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">Total: {totalItems} pacientes</p>
                <button
                    onClick={() => console.log('Abrir modal/página para Novo Paciente')}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 font-medium transition cursor-pointer"
                >
                    + Novo Paciente
                </button>
            </div>

            <div className="space-y-8">
                {totalItems > 0 ? (
                    <>
                        <div
                            className={`space-y-4 transition-opacity duration-100 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
                                }`}
                        >
                            {currentItems.map((patient) => (
                                <ClientListItem
                                    key={patient.id}
                                    patient={patient}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                isTransitioning={isTransitioning}
                                goToPage={goToPage}
                            />
                        )}
                    </>
                ) : (
                    <ButtonCreateNewEmpty
                        onClick={() => console.log('Abrir modal/página para Novo Paciente')}
                        description="Nenhum paciente cadastrado encontrado."
                        descriptionButton="Cadastrar Novo Paciente"
                    />
                )}
            </div>
        </div>
    );
}