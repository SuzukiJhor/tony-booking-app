import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoToBack({ SubTitlePage }: { SubTitlePage: string }) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
                onClick={() => router.back()}
                className="p-2 shrink-0 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition dark:border-card dark:text-card cursor-pointer active:scale-95"
            >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            <h2 className="text-base sm:text-xl font-bold text-gray-800 dark:text-white/70 truncate">
                {SubTitlePage}
            </h2>
        </div>
    );
}