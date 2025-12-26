import TitlePage from "../components/TitlePage";
import BusinessPhoneSection from "./components/BusinessPhoneSection";
import NotificationSettings from "./components/NotificationSettings";
import ScheduleSettings from "./components/ScheduleSettings"; 
import WhatsAppConnectButton from "./components/WhatsAppConnectButton";

export default function SettingsPage() {

    return (
        <div className="p-4 bg-background dark:bg-background-tertiary min-h-screen">
            <TitlePage title=" Visão Geral das Configurações" />
            <div className="space-y-8">
                <BusinessPhoneSection />
                <WhatsAppConnectButton />
                {/* <NotificationSettings />
                <ScheduleSettings /> */}
            </div>
        </div>
    );
}