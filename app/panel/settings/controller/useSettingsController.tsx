'use client';
import toast from "react-hot-toast";
import { formatPhone } from "@/util/mask/mask-phone-br";
import { useState, useEffect, useCallback, useRef } from "react";
import { checkConnectionWppAction, connectionAndPollStatusAction, getMainPhoneAction, setMainPhoneAction } from "../actions";

type ConnectionStatusType = 'loading' | 'connected' | 'error' | 'disconnected' | 'logged-out' | 'awaiting-qr' | 'pending' | 'unauthorized';

export function useSettingsController() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('loading');
    const [connectionMessage, setConnectionMessage] = useState("Estamos verificando a sincronização com seu WhatsApp.");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessing = useRef(false);

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(formatPhone(value));
    };

    const handleCheckConnection = useCallback(async () => {
        setConnectionStatus('loading');
        setConnectionMessage("Estamos verificando a sincronização com seu WhatsApp.");

        try {
            const response = await checkConnectionWppAction() as any;
            console.log('resposta', response);

            if (response.data?.status === 'unauthorized') {
                setConnectionStatus('unauthorized');
                setConnectionMessage("Nenhuma conexão encontrada. Por favor, crie uma nova instância para essa conta."); return;
            }

            if (!response || !response.success) {
                setConnectionStatus('error');
                setConnectionMessage(response?.error || "A instância está desconectada ou o token é inválido.");
                return;
            }

            if (!response.data?.connected) {
                setConnectionStatus('disconnected');
                setConnectionMessage("A instância está desconectada!");
                return;
            }

            if (response.data?.connected && !response.data?.loggedIn) {
                setConnectionStatus('logged-out');
                setConnectionMessage("A instância está conectada, mas o WhatsApp não está logado. Para realizar o Login scaneie o QR Code na tela de conexão.");
                return;
            }


            setConnectionStatus('connected');
            setConnectionMessage("Sua instância está conectada e pronta para uso!");
        } catch (error) {
            console.error("Erro ao verificar a conexão:", error);
            setConnectionStatus('error');
            setConnectionMessage("Não foi possível alcançar o servidor.");
        }
    }, []);

    const connectionWpp = useCallback(async () => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        try {
            const result = await connectionAndPollStatusAction();

            if (!result || !result.success || !result.data) return;

            const { status, qrCode } = result.data;
            const statusMap: Record<string, { status: ConnectionStatusType, msg: string }> = {
                'awaiting-qr': {
                    status: 'awaiting-qr',
                    msg: '📸 Escaneie o QR Code no seu aplicativo WhatsApp.'
                },
                'connected': {
                    status: 'connected',
                    msg: '✅ WhatsApp conectado com sucesso!'
                },
                'pending': {
                    status: 'pending',
                    msg: '⏳ Inicializando sessão, aguardando resposta...'
                },
            };

            const current = statusMap[status] || { status: 'pending', msg: 'Verificando...' };

            setConnectionStatus(current.status);
            setConnectionMessage(current.msg);
            setQrCode(qrCode || null);

            if (status === 'connected' || status === 'awaiting-qr') stopPolling();

        } catch (error) {
            console.error("Erro no polling:", error);
        } finally {
            isProcessing.current = false;
        }
    }, []);


    const startPolling = useCallback(() => {
        stopPolling();
        pollingRef.current = setInterval(() => {
            connectionWpp();
        }, 5000);
    }, [connectionWpp]);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    const currentPhone = useCallback(async () => {
        try {
            const { data } = await getMainPhoneAction();
            if (data?.mainPhone) {
                setPhoneNumber(formatPhone(data.mainPhone));
                setIsEditing(false);
                return;
            }
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("Erro ao carregar configurações.");
        }
    }, []);

    const handleSavePhone = async () => {
        setIsLoading(true);
        try {
            const { success, data } = await setMainPhoneAction(phoneNumber.replace(/\D/g, ""));
            if (success === false) throw new Error("Erro ao salvar o telefone.");
            if (data?.telefone) toast.success(`Telefone atualizado para ${data.telefone}`);
            setIsEditing(false);
        } catch (error) {
            toast.error("Erro ao salvar o telefone.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        currentPhone();
    };

    useEffect(() => {
        currentPhone();
    }, [currentPhone]);

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return {
        phoneNumber,
        isLoading,
        isEditing,
        setIsEditing,
        handlePhoneChange,
        handleSavePhone,
        cancelEditing,
        connectionStatus,
        connectionMessage,
        handleCheckConnection,
        connectionWpp,
        stopPolling,
        startPolling,
        qrCode,
    };
}