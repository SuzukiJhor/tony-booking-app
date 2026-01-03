import { Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart } from "recharts";
import SubTitlePage from "../panel/components/SubTitlePage";

interface HistoryDataPoint {
    date: string;
    CONFIRMADO: number;
    PENDENTE: number;
    NAO_CONFIRMADO: number;
}

interface HistoryConfirmationCardProps {
    dataHistory: HistoryDataPoint[];
}
export default function HistoryConfirmationCard({ dataHistory }: HistoryConfirmationCardProps) {
    return (
        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
            <SubTitlePage text="Histórico de Confirmações (30 Dias)" />
            <div className="h-64 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataHistory}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="CONFIRMADO" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="PENDENTE" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="NAO_CONFIRMADO" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}