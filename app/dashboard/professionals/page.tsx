'use client';
import React, { useState, useMemo, useEffect } from 'react';
import TitlePage from "@/app/dashboard/components/TitlePage";
import { DataBasePacienteType } from "../types/patientDBType";
import { useClient } from "@/app/context/ClientsContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLoading } from '@/app/components/LoadingProvider';
import ButtonRedirectPrimary from '@/app/components/ButtonRedirectPrimary';
import ButtonCreateNewEmpty from '../components/ButtonCreateNewEmpty';

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
            <ButtonRedirectPrimary
                href={`/dashboard/clients/${patient.id}`}
                onClick={() => onViewDetails(patient.id)}
            >
                Ver Mais
            </ButtonRedirectPrimary>
        </div>
    </div>
);
interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    isTransitioning: boolean;
    goToPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    isTransitioning,
    goToPage,
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 bg-chart-3 rounded-lg border border-border">

            <span className="text-sm b-4 md:mb-0 text-white">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} pacientes.
            </span>

            <div className="flex space-x-1">
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

export default function Professionals() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false)
    const itemsPerPage = 6;

    // const { clients, reloadEvents } = useClient() as { clients: DataBasePacienteType[], reloadEvents: () => void };
    // const { setIsLoading } = useLoading();
    // const handleViewDetails = (patientId: number) => {
    //     console.log(`Visualizar detalhes do paciente ID: ${patientId}`);
    //     console.log(`clients:`, clients);
    // };

    // const totalItems = clients ? clients.length : 0;
    const totalItems = 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // const currentItems = useMemo(() => {
    //     if (!clients) return [];
    //     const startIndex = (currentPage - 1) * itemsPerPage;
    //     const endIndex = startIndex + itemsPerPage;
    //     return clients.slice(startIndex, endIndex);
    // }, [clients, currentPage, itemsPerPage]);


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

    // useEffect(() => {
    //     const loadData = async () => {
    //         setIsLoading(true);
    //         try {
    //             await reloadEvents();
    //         } catch (error) {
    //             console.error('Erro ao carregar dados dos clientes:', error);
    //         }
    //         setIsLoading(false);
    //     };
    //     loadData();
    // }, []);

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <TitlePage title=" Visão Geral dos Dentistas" />
            <ButtonCreateNewEmpty
                onClick={() => console.log('Abrir modal/página para Novo Profissional')}
                description="Nenhum Profissional encontrado."
                descriptionButton="Cadastrar Novo Profissional"
            />
        </div>
    );
}