'use client';
import { ArrowLeft, Loader2, ShieldCheck, Wifi, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function CheckConnectionPage() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'disconnected'>('loading');
    const [message, setMessage] = useState("Estamos verificando a sincronização com seu WhatsApp.");
    const router = useRouter();

    async function checkConnection() {
        setStatus('loading');
        setMessage("Estamos verificando a sincronização com seu WhatsApp.");
        try {
            const res = await fetch('/api/whatsapp/check-connection');
            const { data, error } = await res.json();
            if (error) {
                setStatus('disconnected');
                setMessage("A instância está desconectada!");
                return;
            }
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
                        {status === 'disconnected' && (
                            <div className="relative bg-red-100 dark:bg-red-500/20 p-5 rounded-full">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* MENSAGEM DINÂMICA */}
                    <div className="space-y-2">
                        <h2 className={`text-xl font-bold ${status === 'error' ? 'text-red-500' : 'text-foreground'} dark:text-card`}>
                            {status === 'loading' && "Verificando..."}
                            {status === 'connected' && "Tudo pronto!"}
                            {status === 'error' && "Ops! Algo deu errado"}
                            {status === 'disconnected' && "A instância está desconectada!"}
                        </h2>
                        <p className="text-muted-foreground text-sm px-4">
                            {message}
                        </p>
                    </div>

                    {/* SEÇÃO DE AÇÃO DINÂMICA */}
                    <div className="w-full pt-4">
                        {/* 1. ESTADO: CARREGANDO */}
                        {status === 'loading' && (
                            <div className="space-y-3 animate-pulse">
                                <div className="flex items-center gap-3 text-sm text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800">
                                    <div className="h-2 w-2 rounded-full bg-sky-500 animate-bounce"></div>
                                    <span>Comunicando com Wuzapi...</span>
                                </div>
                            </div>
                        )}

                        {/* 2. ESTADO: INSTÂNCIA DESCONECTADA (A API funciona, mas o zap não) */}
                        {status === 'disconnected' && (
                            <Link
                                href="/dashboard/settings/connect-whatsapp"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-50 dark:bg-red-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-red-900 hover:bg-green-100 transition-all font-medium"
                            >
                                <span className="text-lg">📱</span>
                                Conectar instância
                            </Link>
                        )}

                        {/* 3. ESTADO: ERRO OU FALHA (Token inválido, servidor fora) */}
                        {status === 'error' && (
                            <>
                                <div className="space-y-3 animate-pulse">
                                    <button
                                        onClick={checkConnection}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 transition-all font-medium cursor-pointer"
                                    >
                                        <RefreshCcw size={18} />
                                        Tentar novamente
                                    </button>
                                    <Link
                                        href="/dashboard/settings/connect-whatsapp"
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 hover:bg-green-100 transition-all font-medium"
                                    >
                                        <span className="text-lg">📱</span>
                                        Conectar instância
                                    </Link>
                                </div>

                            </>
                        )}

                        {/* 4. ESTADO: SUCESSO (Opcional: mostrar um botão de 'Continuar' ou 'Voltar') */}
                        {status === 'connected' && (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all font-semibold shadow-lg shadow-green-500/20 cursor-pointer"
                            >
                                Ir para o Dashboard
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