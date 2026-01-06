'use client';

import SideNav from "./SideNav";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { ModeToggle } from "@/app/components/ThemeToggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";

export function Header() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-10 bg-background dark:bg-background-secondary border-b dark:border-gray-800 p-4 flex justify-between items-center h-15">
            <div className="flex items-center gap-3">
                <div className="lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-amber-100 rounded-lg transition cursor-pointer">
                                <Menu size={24} />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-none">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription>Navegação lateral</SheetDescription>
                            </SheetHeader>
                            <SideNav isMobile onClose={() => setIsSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>

                <h1 className="text-lg md:text-xl font-semibold dark:text-primary truncate max-w-50 md:max-w-none">
                    {session?.user.nomeEmpresa}
                </h1>
            </div>

            <div className="flex items-center">
                <ModeToggle />
            </div>
        </header>
    );
}