'use client';

import { useEffect, useState } from "react";
import { Menu, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { ModeToggle } from "@/app/components/ThemeToggle";
import { getAllProfessionalsAction } from "../professionals/actions";
import SideNav from "./SideNav";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { useClient } from "@/app/context/ClientsContext";

export function Header({ onFilterChange }: { onFilterChange?: (id: string) => void }) {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { setSelectedDentistId } = useClient();
    const { data: session } = useSession();

    const handleValueChange = (value: string) => {
        console.log("ID do Dentista Selecionado:", value);
        setSelectedDentistId(value);

        if (onFilterChange) {
            onFilterChange(value);
        }
    };

    useEffect(() => {
        async function loadProfessionals() {
            try {
                const { data } = await getAllProfessionalsAction();
                setProfessionals(data ?? []);
            } catch (error) {
                console.error(error);
            }
        }
        loadProfessionals();
    }, []);


    return (
        <header className="sticky top-0 z-10 bg-background dark:bg-background-secondary border-b dark:border-gray-800 p-2 md:p-4 flex justify-between items-center h-16 md:h-15">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">
                                <Menu size={20} className="md:w-6 md:h-6 dark:text-amber-100" />
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

                <h1 className="text-sm md:text-xl font-semibold dark:text-primary truncate">
                    {session?.user.nomeEmpresa}
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <Select onValueChange={handleValueChange} defaultValue="all">
                    <SelectTrigger
                        className="
                            w-30 sm:w-40 md:w-56 h-9 rounded-full transition-all duration-300
                            /* Borda e Sombra refinada */
                            border border-gray-200/50 dark:border-white/10
                            shadow-[0_2px_4px_rgba(0,0,0,0.02)]
                            
                            /* Light Mode: Gradiente sutil */
                            bg-linear-to-b from-white to-gray-50 text-gray-700
                            
                            /* Dark Mode: Acabamento profundo */
                            dark:bg-linear-to-b dark:from-zinc-800 dark:to-zinc-900 
                            dark:text-zinc-200 dark:focus:ring-primary/20
                            dark:bg-amber-50
                        "
                    >
                        <div className="flex items-center gap-2 overflow-hidden px-1">
                            <div className="p-1 rounded-full bg-primary/10 dark:bg-primary/20">
                                <UserCircle size={14} className="text-[#0ea5e9] shrink-0" />
                            </div>
                            <div className="truncate text-[11px] md:text-sm font-semibold tracking-tight">
                                <SelectValue placeholder="Dentista" />
                            </div>
                        </div>
                    </SelectTrigger>

                    <SelectContent
                        className="
                        rounded-2xl border border-gray-200/50 dark:border-white/10
                        bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl
                        dark:text-white
                        shadow-2xl shadow-black/10 dark:shadow-black/40
                        animate-in fade-in zoom-in-95 duration-200
                    "
                    >
                        <SelectItem
                            value="all"
                            className="rounded-lg mx-1 mt-1 font-medium cursor-pointer text-sm  transition-colors"
                        >
                            Todos
                        </SelectItem>


                        {professionals.map((pro) => (
                            <SelectItem
                                key={pro.id}
                                value={pro.id.toString()}
                                onClick={() => console.log(pro.id.toString())}
                                className="rounded-lg mx-1 cursor-pointer text-sm transition-colors"
                            >
                                {pro.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="h-6 w-px bg-border hidden sm:block mx-1" />

                <ModeToggle />
            </div>
        </header>
    );
}