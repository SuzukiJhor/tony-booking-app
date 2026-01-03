import { selectColorByStatus } from "@/util/selectColorByStatus";

export default function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        CONFIRMADO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PENDENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        CANCELADO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
            {selectColorByStatus(status).label}
        </span>
    );
}