import { statusStyleMap } from "@/app/panel/constants";

export function selectColorByStatus(status: string) {
    const config = statusStyleMap[status] || statusStyleMap.PENDENTE;
    return config;
}