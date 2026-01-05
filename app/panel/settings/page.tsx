'use server';
import TitlePage from "../components/TitlePage";
import BusinessPhoneSection from "./components/BusinessPhoneSection";
import WhatsAppConnectButton from "./components/WhatsAppConnectButton";

export default async function Page() {
    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <TitlePage title=" Visão Geral das Configurações" />
            <div className="space-y-8">
                <BusinessPhoneSection />
                <WhatsAppConnectButton />
                {/* <NotificationSettings /> */}
                {/* <ScheduleSettings /> */}
            </div>
        </div>
    );
}