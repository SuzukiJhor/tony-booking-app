'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useLoading } from '@/app/components/LoadingProvider';
import { Loader2 } from 'lucide-react';

type WhatsAppIntegrationPageProps = {
    stopPolling: () => void;
    connectionWpp: () => void;
    connectionStatus: string;
    qrCode: string | null;
};

export default function WhatsAppIntegrationPage({
    stopPolling,
    connectionWpp,
    connectionStatus,
    qrCode
}: WhatsAppIntegrationPageProps) {
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const isProcessing = ['loading', 'pending'].includes(connectionStatus);
        setIsLoading(isProcessing);
    }, [connectionStatus, setIsLoading]);

    useEffect(() => {
        connectionWpp();
        return () => stopPolling();
    }, [connectionWpp, stopPolling])

    const qrSrc =
        qrCode && qrCode.startsWith('http')
            ? qrCode
            : qrCode && qrCode.startsWith('data:image')
                ? qrCode
                : qrCode
                    ? `data:image/png;base64,${qrCode}`
                    : null;

    const isLoadingQr = connectionStatus === 'loading' || connectionStatus === 'pending' || !qrSrc;

    return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 mt-20">
            <div className="relative group">
                <div className="relative p-4 bg-white rounded-3xl shadow-2xl border-4 border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-[1.02]">
                    <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">

                        {isLoadingQr ? (
                            <div className="flex flex-col items-center space-y-3">
                                <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                                <span className="text-xs text-slate-400 font-medium">Gerando código...</span>
                            </div>
                        ) : (
                            <div className="relative animate-in zoom-in-75 duration-300">
                                <Image
                                    src={qrSrc!}
                                    alt="QR Code do WhatsApp"
                                    width={256}
                                    height={256}
                                    className="rounded-lg mix-blend-multiply" // Melhora contraste em fundos claros
                                    unoptimized
                                />
                                <div className="absolute inset-0 border-2 border-sky-500/20 rounded-lg pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-sky-500 rounded-tl-xl" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-sky-500 rounded-tr-xl" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-sky-500 rounded-bl-xl" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-sky-500 rounded-br-xl" />
            </div>

            <div className="max-w-xs text-center space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                    Passo a Passo
                </div>
                <ol className="text-sm text-slate-600 dark:text-slate-400 text-left space-y-3">
                    <li className="flex gap-3">
                        <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold">1</span>
                        Abra o <strong>WhatsApp</strong> no seu celular
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold">2</span>
                        Toque em <strong>Aparelhos conectados</strong>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold">3</span>
                        Aponte seu celular para esta tela
                    </li>
                </ol>
            </div>
        </div>
    );
}
