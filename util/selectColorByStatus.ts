import { statusStyleMap } from "@/app/dashboard/constants";

export function selectColorByStatus(status: string) {
    const config = statusStyleMap[status] || statusStyleMap.PENDENTE;
    return config;
}