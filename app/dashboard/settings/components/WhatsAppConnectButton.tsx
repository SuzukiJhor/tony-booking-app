'use client';
import Link from 'next/link';

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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Integração com WhatsApp
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Conecte sua conta escaneando um QR Code
                </p>
            </div>
            <Link
                href="/dashboard/settings/connect-whatsapp"
                className="
          inline-flex items-center gap-2
          rounded-lg bg-green-600 px-5 py-3
          text-sm font-semibold text-white
          hover:bg-green-700
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          dark:focus:ring-offset-background-secondary
          transition-all
        "
            >
                <span className="text-lg">📱</span>
                Conectar
            </Link>
        </div>
    );
}
