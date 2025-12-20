/* eslint-disable react-hooks/static-components */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import TitlePage from "@/app/dashboard/components/TitlePage";
import { DataBasePacienteType } from "../types/patientDBType";
import { useClient } from "@/app/context/ClientsContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLoading } from '@/app/components/LoadingProvider';

interface PatientListItemProps {
    patient: DataBasePacienteType;
    onViewDetails: (patientId: number) => void;
}

const ClientListItem: React.FC<PatientListItemProps> = ({ patient, onViewDetails }) => (
    <div className="flex items-center justify-between p-4 mb-4 bg-white dark:bg-background-secondary rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col">
            <h2 className="text-xl font-bold text-foreground dark:text-card">
                {patient.nome}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-primary-dark">Telefone:</span> {patient.telefone}
            </p>
            {patient.email && (
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary-dark">Email:</span> {patient.email}
                </p>
            )}
        </div>

        <div className="flex space-x-2">
            <Link
                href={`/dashboard/clients/${patient.id}`}
                type="submit"
                className="bg-sky-700 hover:bg-amber-950 text-white font-semibold py-2 px-4 rounded transition duration-150 text-sm cursor-pointer"
                onClick={() => onViewDetails(patient.id)}
            >
                Detalhes
            </Link >
        </div>
    </div>
);

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

    const PaginationControls = () => {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 bg-chart-3 rounded-lg border border-border">

                {/* Informação da Página */}
                <span className="text-sm b-4 md:mb-0 text-white">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} pacientes.
                </span>

                {/* Botões de Navegação */}
                <div className="flex space-x-1">
                    {/* Botão Anterior */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1 || isTransitioning}
                        className={`p-2 rounded-lg transition border border-border ${currentPage === 1 || isTransitioning
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-background text-foreground hover:bg-muted cursor-pointer'
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Números das Páginas */}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            disabled={isTransitioning}
                            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${currentPage === page
                                ? 'bg-primary text-white shadow-md cursor-default'
                                : 'bg-background text-foreground hover:bg-muted border border-border cursor-pointer'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Botão Próximo */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || isTransitioning}
                        className={`p-2 rounded-lg transition border border-border ${currentPage === totalPages || isTransitioning
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-background text-foreground hover:bg-muted cursor-pointer'
                            }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
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

            <div className="space-y-8">
                {/* <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Visão Geral dos Pacientes
                </h2> */}
                {totalItems > 0 ? (
                    <>
                        {/* Lista de Pacientes Atuais com Animação */}
                        <div
                            className={`space-y-4 transition-opacity duration-100 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100' // CLASSE DE TRANSIÇÃO
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

                        {/* Controles de Paginação */}
                        {totalPages > 1 && <PaginationControls />}
                    </>
                ) : (
                    // Se a lista estiver vazia (Mantido igual)
                    <div className="text-center p-12 bg-card rounded-xl shadow-inner text-muted-foreground">
                        <p className="text-lg mb-4">Nenhum paciente cadastrado encontrado.</p>
                        <button
                            className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 font-medium transition"
                            onClick={() => console.log('Abrir modal/página para Novo Paciente')}
                        >
                            + Cadastrar Novo Paciente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}