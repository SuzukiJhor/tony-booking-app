import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import SubTitlePage from "../dashboard/components/SubTitlePage";

interface StatusData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

interface StatusPizzaChartProps {
    statusChartData: StatusData[];
}

export default function StatusPizzaChart({ statusChartData }: StatusPizzaChartProps) {
    if (!statusChartData || statusChartData.length === 0) {
        return null;
    }

    return (
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-md border dark:border-gray-700">
                <SubTitlePage text="Status Atual" />

                <div className="flex flex-col items-center">
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie 
                                    data={statusChartData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    innerRadius={50} 
                                    outerRadius={70} 
                                    paddingAngle={5}
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                    <ul className="w-full mt-4 space-y-2 text-xs">
                        {statusChartData.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="font-bold dark:text-card">{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}