import { formatPhone } from "@/util/mask/mask-phone-br";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DialogNewClient({
    open,
    selectedClient,
    onAdd,
    onUpdate,
    onDelete,
    onClose,
}: any) {
    const { data: session } = useSession();
    // Extrai os detalhes se estiver editando, ou inicia vazio
    const clientDetails = selectedClient || null;
    const [phoneValue, setPhoneValue] = useState(clientDetails?.telefone ?? "");

    useEffect(() => {
        if (clientDetails?.telefone) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhoneValue(formatPhone(clientDetails.telefone));
        } else {
            setPhoneValue("");
        }
    }, [clientDetails, open]);

    if (!open) return null;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneValue(formatPhone(e.target.value));
    };

    const handleSubmit = async (formData: FormData) => {
        const data = {
            nome: formData.get("clientName"),
            telefone: phoneValue.replace(/\D/g, ""),
            email: formData.get("clientEmail"),
            empresaId: session?.user?.empresaID,
        };

        if (clientDetails?.id) {
            await onUpdate?.({ ...data, id: clientDetails.id });
        } else {
            await onAdd?.(data);
        }
        onClose();
    };

    return (
        <dialog
            open={open}
            className="fixed inset-0 z-9999 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4"
        >
            <form
                className="bg-background dark:bg-background-secondary text-foreground w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(new FormData(e.currentTarget));
                }}
            >

                <div className="p-6 border-b border-border sticky top-0 bg-background dark:bg-background-secondary z-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-primary">
                        {clientDetails?.id ? "Editar Paciente" : "Cadastrar Paciente"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <X />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex flex-col">
                        <label htmlFor="clientName" className="mb-2 font-medium  dark:text-background">Nome do(a) Dentista</label>
                        <input
                            type="text"
                            name="clientName"
                            id="clientName"
                            defaultValue={clientDetails?.nome}
                            placeholder="Ex: Dra. Ana Souza"
                            className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="mb-2 font-medium dark:text-background">Telefone (WhatsApp)</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={phoneValue}
                            placeholder="(XX) XXXXX-XXX"
                            onChange={handlePhoneChange}
                            maxLength={15}
                            className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-2 font-medium dark:text-background">Email</label>
                            <input
                                name="email"
                                id="email"
                                defaultValue={clientDetails?.email}
                                placeholder="Ex: ortodontia@example.com"
                                className="w-full p-3 rounded border border-gray-300 bg-background dark:bg-gray-700 dark:text-background"
                            />
                        </div>
                    </div>

                </div>
                <div className="p-6 border-t border-border bg-muted/30 sticky bottom-0 backdrop-blur-md flex flex-col-reverse md:flex-row justify-between gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    {clientDetails?.id && (
                        <button
                            type="button"
                            onClick={() => {
                                onDelete?.(clientDetails);
                                onClose();
                            }}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        >
                            Excluir
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-chart-2 hover:opacity-90 cursor-pointer text-card"
                    >
                        {clientDetails?.id ? "Salvar" : "Criar"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}