'use client';
import { useEffect, useState } from "react";
import GoToBack from "@/app/components/GoToBack";
import StatusConnectionIcon from "../../components/StatusConnection";
import StatusConnectionCard from "../../components/StatusConnectionCard";
import { useSettingsController } from "../../controller/useSettingsController";
import WhatsAppIntegrationPage from "../../components/WhatsAppIntegration";

export default function CheckConnectionView() {
    const [showQRCodeArea, setShowQRCodeArea] = useState<boolean>(false);

    const {
        connectionStatus: status,
        connectionMessage: message,
        handleCheckConnection,
        stopPolling,
        connectionWpp,
        connectionStatus,
        qrCode
    } = useSettingsController();

    useEffect(() => {
        handleCheckConnection();
    }, [handleCheckConnection]);

    return (
        <div className="p-4 bg-background dark:bg-slate-950 min-h-screen flex flex-col">
            <GoToBack SubTitlePage="Voltar" />
            <StatusConnectionIcon statusConnection={status} />
            <StatusConnectionCard
                statusConnection={status}
                statusMessage={message}
                handleCheckConnection={handleCheckConnection}
                setShowQRCode={() => setShowQRCodeArea(true)}
            />
            {showQRCodeArea && (
                <WhatsAppIntegrationPage
                    stopPolling={stopPolling}
                    connectionWpp={connectionWpp}
                    connectionStatus={connectionStatus}
                    qrCode={qrCode}
                />
            )}

        </div>
    );
}