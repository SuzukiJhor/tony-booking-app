import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, LogOut, QrCode, RefreshCcw, ShieldCheck, Smartphone, UserX, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConnectionStatus = 'loading' | 'connected' | 'error' | 'disconnected' | 'logged-out' | 'awaiting-qr' | 'pending' | 'unauthorized';

const statusMessages: Record<string, string> = {
    'logged-out': "Sua instância está ativa, mas você precisa escanear o QR Code para continuar.",
    'awaiting-qr': "Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código que aparece abaixo.",
    'connected': "Conexão estabelecida com sucesso! Você já pode enviar mensagens.",
    'loading': "Estamos preparando sua conexão, aguarde um momento...",
    'error': "Não foi possível conectar. Verifique sua internet ou tente novamente.",
    'disconnected': "A instância está offline. Clique no botão para iniciar.",
    'unauthorized': "Nenhuma conexão encontrada. Por favor, entre em contato com o suporte para criar uma nova instância."
};

export default function StatusConnectionCard({ statusConnection, statusMessage, handleCheckConnection, setShowQRCode }: { statusConnection: ConnectionStatus, statusMessage: string, handleCheckConnection: () => void, setShowQRCode: (value: boolean) => void }) {
    const router = useRouter();
    const displayMessage = statusMessages[statusConnection] || statusMessage;

    return (
        <div className="flex-1 flex items-start justify-center pt-10">
            <div className="max-w-md w-full bg-card dark:bg-slate-900 border border-border rounded-2xl p-8 shadow-lg flex flex-col items-center text-center space-y-6">

                <div className="relative">
                    {statusConnection === 'loading' && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping"></div>
                            <div className="relative bg-sky-100/50 dark:bg-sky-500/10 p-5 rounded-full">
                                <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                            </div>
                        </>
                    )}
                    {statusConnection === 'connected' && (
                        <div className="relative bg-green-100 dark:bg-green-500/20 p-5 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    )}
                    {statusConnection === 'unauthorized' && (
                        <div className="relative bg-orange-100 dark:bg-orange-500/20 p-5 rounded-full">
                            <UserX className="w-12 h-12 text-orange-500" />
                        </div>
                    )}
                    {statusConnection === 'awaiting-qr' && (
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
                            <div className="relative bg-blue-100 dark:bg-blue-500/20 p-5 rounded-full">
                                <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    )}
                    {statusConnection === 'logged-out' && (
                        <div className="relative bg-amber-100 dark:bg-amber-500/20 p-5 rounded-full">
                            <QrCode className="w-12 h-12 text-amber-500" />
                            <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                                <LogOut size={16} className="text-amber-600" />
                            </div>
                        </div>
                    )}
                    {statusConnection === 'error' && (
                        <div className="relative bg-red-100 dark:bg-red-500/20 p-5 rounded-full">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                    )}
                    {statusConnection === 'disconnected' && (
                        <div className="relative bg-red-100 dark:bg-red-500/20 p-5 rounded-full">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className={`text-xl font-bold ${statusConnection === 'error' ? 'text-red-500' : 'text-foreground'} dark:text-card`}>
                        {statusConnection === 'loading' && "Verificando..."}
                        {statusConnection === 'connected' && "Tudo pronto!"}
                        {statusConnection === 'error' && "Ops! Algo deu errado"}
                        {statusConnection === 'disconnected' && "desconectada!"}
                        {statusConnection === 'logged-out' && "Sessão expirada"}
                        {statusConnection === 'awaiting-qr' && "QR Code Gerado!"}
                        {statusConnection === 'unauthorized' && "Instância não encontrada"}
                    </h2>
                    <p className="text-muted-foreground text-sm px-4">
                        {displayMessage}
                    </p>
                </div>

                <div className="w-full pt-4">
                    {statusConnection === 'loading' && (
                        <div className="space-y-3 animate-pulse">
                            <div className="flex items-center gap-3 text-sm text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800">
                                <div className="h-2 w-2 rounded-full bg-sky-500 animate-bounce"></div>
                                <span>Comunicando com Wuzapi...</span>
                            </div>
                        </div>
                    )}

                    {statusConnection === 'awaiting-qr' && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="font-medium text-left">Aguardando leitura do código...</span>
                            </div>
                        </div>
                    )}

                    {statusConnection === 'disconnected' && (
                        <Button
                            onClick={() => setShowQRCode(true)}
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-50 dark:bg-red-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-red-900 hover:bg-green-100 transition-all font-medium"
                        >
                            <span className="text-lg">📱</span>
                            Conectar instância
                        </Button>
                    )}

                    {statusConnection === 'error' && (
                        <>
                            <div className="space-y-3 animate-pulse">
                                <button
                                    onClick={handleCheckConnection}
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 transition-all font-medium cursor-pointer"
                                >
                                    <RefreshCcw size={18} />
                                    Tentar novamente
                                </button>
                                <Button
                                    onClick={() => setShowQRCode(true)}
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 hover:bg-green-100 transition-all font-medium"
                                >
                                    <span className="text-lg">📱</span>
                                    Conectar instância
                                </Button>
                            </div>

                        </>
                    )}

                    {statusConnection === 'logged-out' && (
                        <div className="space-y-3">
                            <Button
                                onClick={() => setShowQRCode(true)}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all font-semibold shadow-lg shadow-amber-500/20"
                            >
                                <QrCode size={20} />
                                Escanear QR Code
                            </Button>
                            <button
                                onClick={handleCheckConnection}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 w-full"
                            >
                                <RefreshCcw size={14} /> Atualizar status
                            </button>
                        </div>
                    )}

                    {statusConnection === 'connected' && (
                        <button
                            onClick={() => router.push('/panel')}
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
    )
}