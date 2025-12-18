'use client';
import { useLoading } from '@/app/components/LoadingProvider';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Status =
  | 'IDLE'
  | 'AWAITING_QR'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'PENDING';

export default function WhatsAppIntegrationPage() {
  const { setIsLoading } = useLoading();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('IDLE');
  const [message, setMessage] = useState<string>(''); // Nova state para mensagem

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  const fetchSessionStatus = async () => {
    if (status === 'AWAITING_QR' || status === 'CONNECTED') return;
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const res = await fetch('/api/whatsapp/connect');
      const data = await res.json();

      switch (data.status) {
        case 'AWAITING_QR':
          setQrCode(data.qrCode);
          setStatus('AWAITING_QR');
          setMessage('📸 Escaneie o QR Code no seu aplicativo WhatsApp para conectar.');
          stopPolling();
          break;

        case 'CONNECTED':
          setQrCode(null);
          setStatus('CONNECTED');
          setMessage('✅ WhatsApp conectado com sucesso!');
          stopPolling();
          break;

        case 'DISCONNECTED':
        case 'PENDING':
          setQrCode(null);
          setStatus(data.status);
          setMessage('⏳ Inicializando sessão, aguardando QR Code...');
          startPolling();
          break;

        default:
          setStatus('IDLE');
          setMessage('Carregando status da sessão...');
      }
    } catch (error) {
      console.error('❌ Erro ao consultar sessão:', error);
      setMessage('❌ Ocorreu um erro ao verificar a sessão.');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchSessionStatus, 20000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSessionStatus();

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qrSrc =
    qrCode && qrCode.startsWith('http')
      ? qrCode
      : qrCode && qrCode.startsWith('data:image')
        ? qrCode
        : qrCode
          ? `data:image/png;base64,${qrCode}`
          : null;

  return (
    <div className="p-6 min-h-screen bg-background dark:bg-background-tertiary">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Integração com WhatsApp
      </h1>

      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Escaneie o QR Code abaixo para conectar sua conta do WhatsApp.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center h-64 border border-dashed rounded-lg dark:border-gray-700">
        {status === 'AWAITING_QR' && qrSrc && (
          <Image
            src={qrSrc}
            alt="QR Code do WhatsApp"
            width={224}
            height={224}
            className="h-56 w-56"
            unoptimized
          />
        )}

        <span
          className={`mt-4 text-center font-semibold ${status === 'CONNECTED'
            ? 'text-green-600'
            : status === 'DISCONNECTED' || status === 'PENDING'
              ? 'text-yellow-500'
              : 'text-gray-400'
            }`}
        >
          {message}
        </span>
      </div>
    </div>
  );
}
