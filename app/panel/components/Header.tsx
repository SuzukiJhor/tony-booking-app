'use client';
import { ModeToggle } from "@/app/components/ThemeToggle";
import { useSession } from "next-auth/react";

export function Header() {
    const { data: session } = useSession();
    return (
        <header className="sticky top-0 z-10 dark:bg-background-secondary bg-background shadow-sm p-4 flex justify-between items-center h-15 border-b dark:border-border">
            <h1 className="text-xl font-semibold dark:text-primary">
                Bem-vindo {session?.user.nomeEmpresa}!
            </h1>
            <ModeToggle />
        </header>
    )
}