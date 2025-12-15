// ./app/dashboard/settings/page.tsx (Server Component)

import TitlePage from "../components/TitlePage";
import NotificationSettings from "./NotificationSettings"; // Client Component
import ScheduleSettings from "./ScheduleSettings"; // NOVO: Client Component

export default function SettingsPage() {

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <TitlePage title=" Visão Geral das Configurações" />

            <div className="space-y-8">
                 {/* <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Visão Geral das Configurações
                </h2> */}
                {/* 1. Configurações de Notificações */}
                <NotificationSettings />

                {/* 2. Configurações de Horário de Funcionamento */}
                <ScheduleSettings />

                {/* Aqui viriam outras seções, como Configurações Gerais */}
            </div>
        </div>
    );
}