import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoToBack({ SubTitlePage }: { SubTitlePage: string }) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => router.back()}
                className="p-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition dark:border-card dark:text-card cursor-pointer"
            >
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/70">{SubTitlePage}</h2>
        </div>
    );
}