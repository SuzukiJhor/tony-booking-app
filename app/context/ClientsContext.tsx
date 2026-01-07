'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DataBasePacienteType } from "../panel/types/patientDBType";
import { getAllClientsAction } from "../panel/clients/actions";

interface ClientContextProps {
    clients: DataBasePacienteType[];
    selectedDentistId: string;
    setSelectedDentistId: (id: string) => void;
    reloadEvents: () => Promise<void>;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<DataBasePacienteType[]>([]);
    const [selectedDentistId, setSelectedDentistId] = useState<string>("all");

    async function reloadEvents() {
        const { data } = await getAllClientsAction();
        if (!data) return;
        setClients(
            data.map((client: any) => ({
                ...client,
                agendamentos: client.agendamentos?.map((agendamento: any) => ({
                    ...agendamento,
                    status: agendamento.status ?? '',
                    dataHora: typeof agendamento.dataHora === 'string' ? agendamento.dataHora : agendamento.dataHora?.toISOString?.() ?? '',
                    statusConfirmacao: String(agendamento.statusConfirmacao),
                    tempoAtendimento: typeof agendamento.tempoAtendimento === 'number' ? String(agendamento.tempoAtendimento) : agendamento.tempoAtendimento,
                })) ?? [],
            }))
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            await reloadEvents();
        };
        fetchData();
    }, []);


    return (
        <ClientContext.Provider value={{
            clients,
            selectedDentistId,
            setSelectedDentistId,
            reloadEvents
        }}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClient() {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error("useClient must be used within a ClientProvider");
    }
    return context;
}