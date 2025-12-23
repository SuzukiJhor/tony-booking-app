'use client';
import { ArrowLeft, Loader2, ShieldCheck, Wifi, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function CheckConnectionPage() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [message, setMessage] = useState("Estamos verificando a sincronização com seu WhatsApp.");
    const router = useRouter();

    async function checkConnection() {
        setStatus('loading');
        setMessage("Estamos verificando a sincronização com seu WhatsApp.");
        try {
            const res = await fetch('/api/whatsapp/check-connection');
            const { data } = await res.json();

            if (res.ok && data?.connected) {
                setStatus('connected');
                setMessage("Sua instância está conectada e pronta para uso!");
                return;
            }
            setStatus('error');
            setMessage(data.message || "A instância está desconectada ou o token é inválido.");
        } catch (error) {
            console.error("Erro ao verificar a conexão:", error);
            setStatus('error');
            setMessage("Não foi possível alcançar o servidor.");
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkConnection();
    }, []);

    return (
        <div className="p-4 bg-background dark:bg-slate-950 min-h-screen flex flex-col">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition cursor-pointer dark:border-slate-700 dark:text-slate-400"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-900 dark:text-white flex items-center gap-2">
                <Wifi className={`
                    ${status === 'connected' ? 'text-green-500' : ''} 
                    ${status === 'error' ? 'text-red-500' : ''} 
                    ${status === 'loading' ? 'text-sky-400' : ''}
                `} />
                Status da Conexão
            </h1>

            <div className="flex-1 flex items-start justify-center pt-10">
                <div className="max-w-md w-full bg-card dark:bg-slate-900 border border-border rounded-2xl p-8 shadow-lg flex flex-col items-center text-center space-y-6">

                    {/* ÍCONE DINÂMICO */}
                    <div className="relative">
                        {status === 'loading' && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping"></div>
                                <div className="relative bg-sky-100/50 dark:bg-sky-500/10 p-5 rounded-full">
                                    <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                                </div>
                            </>
                        )}
                        {status === 'connected' && (
                            <div className="relative bg-green-100 dark:bg-green-500/20 p-5 rounded-full">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="relative bg-red-100 dark:bg-red-500/20 p-5 rounded-full">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* MENSAGEM DINÂMICA */}
                    <div className="space-y-2">
                        <h2 className={`text-xl font-bold ${status === 'error' ? 'text-red-500' : 'text-foreground'}`}>
                            {status === 'loading' && "Verificando..."}
                            {status === 'connected' && "Tudo pronto!"}
                            {status === 'error' && "Ops! Algo deu errado"}
                        </h2>
                        <p className="text-muted-foreground text-sm px-4">
                            {message}
                        </p>
                    </div>

                    {/* CHECKLIST OU BOTÃO DE RETENTATIVA */}
                    <div className="w-full pt-4">
                        {status === 'loading' ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-foreground/70 bg-muted/50 p-3 rounded-lg border border-border/50">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>Comunicando com Wuzapi...</span>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={checkConnection}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all font-medium"
                            >
                                <RefreshCcw size={18} />
                                Tentar novamente
                            </button>
                        )}
                    </div>

                    <div className="pt-4 border-t border-border w-full">
                        <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Conexão segura via HTTPS
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}