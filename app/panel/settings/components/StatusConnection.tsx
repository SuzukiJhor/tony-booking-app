import { Wifi } from "lucide-react";

export default function StatusConnectionIcon({ statusConnection }: { statusConnection: string }) {
    return (
        <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-900 dark:text-white flex items-center gap-2">
            <Wifi className={`
                    ${statusConnection === 'connected' ? 'text-green-500' : ''} 
                    ${statusConnection === 'error' ? 'text-red-500' : ''} 
                    ${statusConnection === 'disconnected' ? 'text-red-500' : ''} 
                    ${statusConnection === 'loading' ? 'text-sky-400' : ''}
                `} />
            Status da Conexão
        </h1>
    );
}