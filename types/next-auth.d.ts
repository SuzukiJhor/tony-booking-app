import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        nomeEmpresa?: string | null;
        empresaID?: number | null;
    }

    interface Session {
        user: {
            id: string;
            nomeEmpresa?: string | null;
            empresaID?: number | null;
            email?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        nomeEmpresa?: string | null;
    }
}
