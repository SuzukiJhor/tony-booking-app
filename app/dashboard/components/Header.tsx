'use client';
import { useSession } from "next-auth/react";

export function Header() {
    const { data: session } = useSession();
    return (
        <header className="sticky top-0 z-10 bg-background-secondary shadow-sm p-4 flex justify-between items-center h-20">
            <h1 className="text-xl font-semibold text-primary">
                Bem-vindo {session?.user.nomeEmpresa}!
            </h1>
        </header>
    )
}