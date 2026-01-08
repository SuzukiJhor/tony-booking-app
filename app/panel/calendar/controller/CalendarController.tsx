import toast from 'react-hot-toast';
import Swal from "sweetalert2";
import { sanitizeSchedule } from "@/util/sanitizeSchedule";
import { useLoading } from "@/app/components/LoadingProvider";
import { formatDate, getDayOfWeek } from "@/util/date/date-br";
import { createScheduleAction, deleteProfessionalAction, getEventByIdAction, updateScheduleAction } from "../actions";
import { CreateScheduleSchema } from '@/lib/validations/events';

const styleConfigureToast = {
    style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
    }
};

export const useCalendarController = () => {
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
                styleConfigureToast
            );
            return true;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const onAdd = async (data: any, callback?: () => void) => {
        const sanitizedSchedule = sanitizeSchedule(data);
        const { paciente, dataHora } = sanitizedSchedule;
        const title = `Confirma a reserva para ${paciente.nome} no dia ${formatDate(dataHora)} - ${getDayOfWeek(dataHora)}?`
        const result = await Swal.fire({
            title: title,
            text: "Esta reserva sera criada e aparecerá no calendário",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: 'oklch(0.696 0.17 162.48)',
            cancelButtonColor: '#d33 ',
            confirmButtonText: 'Sim, Agendar!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            const success = await handleAction(
                createScheduleAction(sanitizedSchedule),
                { loading: 'Registrando...', success: 'Agendamento registrado!' }
            );
            if (success && callback) callback();
        }
    };

    const onUpdate = async (id: number, data: any, callback?: () => void) => {
        const sanitizedSchedule = sanitizeSchedule(data);
        const success = await handleAction(
            updateScheduleAction(id, sanitizedSchedule),
            { loading: 'Atualizando...', success: 'Atualizado com sucesso!' }
        );
        if (success && callback) callback();
    };

    const onDelete = async (id: number, title: string) => {
        const titleCondition = title ? `Tem certeza que deseja excluir a reserva para "${title}"?` : 'Tem certeza que deseja excluir esta reserva?';

        const result = await Swal.fire({
            title: titleCondition,
            text: "Esta reserva sera desativada e não aparecerá mais no calendário",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, Excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await handleAction(
                deleteProfessionalAction(id),
                { loading: 'deletando...', success: 'Deletado com sucesso!' }
            );
        }
    };

    const onValidate = async (data: any) => {
        try {
            const sanitizedSchedule = sanitizeSchedule(data);
            CreateScheduleSchema.parse(sanitizedSchedule);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.issues?.[0]?.message || "Dados inválidos",
            };
        }
    }

    const onGetById = async (id: number) => {
        return getEventByIdAction(id);
    };

    return { onAdd, onUpdate, onDelete, onValidate, onGetById };
};
