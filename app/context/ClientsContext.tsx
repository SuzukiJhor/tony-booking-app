'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DataBasePacienteType } from "../dashboard/types/patientDBType";
import { fetchClients } from "@/util/api/api-clients";

interface ClientContextProps {
    clients: DataBasePacienteType[];
    reloadEvents: () => Promise<void>;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<DataBasePacienteType[]>([]);

    async function reloadEvents() {
        const data = await fetchClients();
        setClients(data);
    }

    useEffect(() => {
        const fetchData = async () => {
            await reloadEvents();
        };
        fetchData();
    }, []);

    return (
        <ClientContext.Provider value={{ clients, reloadEvents }}>
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
