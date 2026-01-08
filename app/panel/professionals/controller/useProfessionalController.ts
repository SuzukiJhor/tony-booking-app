'use client';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { createProfessionalAction, updateProfessionalAction, deleteProfessionalAction } from '../actions';
import { useLoading } from '@/app/components/LoadingProvider';
import { getProfessionalByIdAction } from '../[id]/actions';

const toastStyle = {
    style: { borderRadius: '10px', background: '#333', color: '#fff' }
};

export const useProfessionalController = () => {
    const { setIsLoading } = useLoading();

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
                    error: (err) => err.message || "Ocorreu um erro inesperado",
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
            createProfessionalAction(data),
            { loading: 'Registrando...', success: 'Profissional registrado!' }
        );
        if (success && callback) callback();
    };

    const onUpdate = async (id: number, data: any, callback?: () => void) => {
        const success = await handleAction(
            updateProfessionalAction(id, data),
            { loading: 'Atualizando...', success: 'Atualizado com sucesso!' }
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
                deleteProfessionalAction(id),
                { loading: 'Inativando...', success: 'Inativado com sucesso!' }
            );
        }
    };

    const onGetById = async (id: number) => {
        if (!id) return;
        const { data } = await getProfessionalByIdAction(id);
        if (!data) {
            toast.error("Ocorreu um erro inesperado", toastStyle);
            return null;
        }
        toast.success(`${data.nome} Selecionado`, toastStyle);
        return data;
    };

    return { onGetById, onAdd, onUpdate, onDelete };
};