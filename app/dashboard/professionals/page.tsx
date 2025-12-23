'use client';
import React, { useState, useMemo, useEffect } from 'react';
import TitlePage from "@/app/dashboard/components/TitlePage";
import ButtonCreateNewEmpty from '../components/ButtonCreateNewEmpty';
import DialogNewProfessional from '../components/DialogNewProfessional';
import ProfessionalListItem from './components/ProfessionalListItem';
import PaginationControls from '../components/PaginationControls';
import { deleteProfessional, fetchProfessionals, registerProfessional, updateProfessional } from '@/util/api/api-professionals';
import { ProfissionalPayload } from '@/app/DTO/ProfessionalDTO';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useLoading } from '@/app/components/LoadingProvider';
interface ProfessionalFromDB extends ProfissionalPayload {
    id: number;
    createdAt: string;
    updatedAt: string;
    agendamentos: any[];
}

const styleConfigureToast = {
    style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    }
};

export default function Professionals() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalFromDB | null>(null);
    const { setIsLoading } = useLoading();
    const [professionals, setProfessionals] = useState<ProfessionalFromDB[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const itemsPerPage = 5;

    const totalItems = professionals.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentItems = useMemo(() => {
        if (!professionals || professionals.length === 0) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return professionals.slice(startIndex, endIndex);
    }, [currentPage, itemsPerPage, professionals]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchProfessionals();
            setProfessionals(data);
        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleOpenCreateModal = () => {
        setSelectedProfessional(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (id: number) => {
        const professional = professionals.find(p => p.id === id);
        if (professional) {
            setSelectedProfessional(professional);
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (data: ProfissionalPayload & { id: number }) => {

        if (!data?.id) return;
        const result = await Swal.fire({
            title: `Tem certeza que deseja Inativar o profissional - ${data.nome}?`,
            text: "Esta ação implicará na inativação do Profissional no sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, Excluir!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await toast.promise(
                deleteProfessional(Number(data?.id)),
                {
                    loading: 'Inativando profissional...',
                    success: 'Profissional Inativado com sucesso!',
                    error: (err) => err?.message || 'Erro ao inativar o profissional.',
                },
                { style: styleConfigureToast.style }
            );
            await fetchData();
        }
    };

    const handleAdd = async (data: ProfissionalPayload) => {
        setIsModalOpen(false)
        setIsLoading(true);
        await toast.promise(
            registerProfessional(data),
            {
                loading: 'Registrando profissional...',
                success: 'Profissional registrado com sucesso!',
                error: 'Erro ao registrar o profissional.',
            },
            {
                style: styleConfigureToast.style,
            }
        );
        await fetchData();
        setIsLoading(false);
    };

    const handleUpdate = async (data: ProfissionalPayload & { id: number }) => {
        setIsModalOpen(false)
        setIsLoading(true);
        if (!data?.id) {
            console.error("❌ ID do profissional não informado!");
            return;
        }

        await toast.promise(
            updateProfessional(data.id, data),
            {
                loading: 'Atualizando profissional...',
                success: 'Profissional atualizado com sucesso!',
                error: 'Erro ao atualizar o profissional.',
            },
            {
                style: styleConfigureToast.style,
            }
        );

        await fetchData();
        setIsLoading(false);
    }

    const goToPage = (page: number) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(page);
                setTimeout(() => setIsTransitioning(false), 50);
            }, 300);
        }
    };

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <Toaster
                position="top-right"
                reverseOrder={true}
            />
            <TitlePage title="Visão Geral dos Dentistas" />

            <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">Total: {totalItems} profissionais</p>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 font-medium transition cursor-pointer"
                >
                    + Novo Dentista
                </button>
            </div>

            {totalItems === 0 ? (
                <ButtonCreateNewEmpty
                    onClick={handleOpenCreateModal}
                    description="Nenhum Profissional encontrado."
                    descriptionButton="Cadastrar Novo Profissional"
                />
            ) : (
                <>
                    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        {currentItems.map((pro) => (
                            <ProfessionalListItem
                                key={pro.id}
                                professional={pro}
                                onEdit={() => handleOpenEditModal(pro.id)}
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
            )}

            <DialogNewProfessional
                open={isModalOpen}
                selectedProfessional={selectedProfessional}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
}