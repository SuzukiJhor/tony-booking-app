import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLoading } from '@/app/components/LoadingProvider';
import { createClientAction, deleteClientAction, updateClientAction } from '../actions';
import Swal from 'sweetalert2';

const toastStyle = {
    style: { borderRadius: '10px', background: '#333', color: '#fff' }
};

export const useClientsController = () => {
    const { setIsLoading } = useLoading();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleAction = async (
        actionPromise: Promise<{ success: boolean; error?: string }>,
        messages: { loading: string; success: string }
    ) => {
        setIsLoading(true);
        try {
            await toast.promise(
                async () => {
                    const result = await actionPromise;
                    if (!result.success) {
                        throw new Error(result.error || "Ocorreu um erro inesperado");
                    }
                    return result;
                },
                {
                    loading: messages.loading,
                    success: messages.success,
                    error: (err) => err.message,
                },
                toastStyle
            );
            return true;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const onAdd = async (data: any, callback?: () => void) => {
        const success = await handleAction(
            createClientAction(data),
            { loading: 'Cadastrando paciente...', success: 'Paciente cadastrado!' }
        );
        console.log("Add Success:", success);
        if (success && callback) callback();
    };

    const onUpdate = async (id: number, data: any, callback?: () => void) => {
        const success = await handleAction(
            updateClientAction(id, data),
            { loading: 'Atualizando dados...', success: 'Paciente atualizado!' }
        );
        if (success && callback) callback();
    };

    const onDelete = async (id: number, nome: string) => {
        const result = await Swal.fire({
            title: `Inativar ${nome}?`,
            text: "O profissional não aparecerá mais nos agendamentos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sim, Inativar!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await handleAction(
                deleteClientAction(id),
                { loading: 'Removendo paciente...', success: 'Paciente removido!' }
            );
        }
    };

    return { onAdd, onUpdate, onDelete, isTransitioning, setIsTransitioning };
};