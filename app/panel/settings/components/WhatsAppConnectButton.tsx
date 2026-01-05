'use client';
import Link from 'next/link';
import SubTitlePage from '../../components/SubTitlePage';

export default function WhatsAppConnectButton() {
    return (
        <div
            className="
            flex items-center justify-between
            p-6 rounded-xl border
            bg-white dark:bg-background-secondary
            border-gray-200 dark:border-gray-700
            shadow-sm
        "
        >
            <div>
                 <SubTitlePage text="Integração com WhatsApp" />
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Conecte sua conta escaneando um QR Code
                </p>
            </div>
            <Link
                href="/panel/settings/check-connection"
                className="px-4 py-2 rounded bg-green-600 text-card hover:opacity-90 cursor-pointer"
            >
                <span className="text-lg">📱</span>
                Conectar
            </Link>
        </div>
    );
}
