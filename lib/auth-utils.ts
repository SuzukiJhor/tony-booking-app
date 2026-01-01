import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getValidatedCompanyId(): Promise<number> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Sessão expirada ou não encontrada.");
    const companyId = (session.user as any).empresaID;
    if (!companyId) throw new Error("Empresa não vinculada ao usuário.");
    return companyId as number;
}