import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <Loader2 size={48} className="text-sky-500 animate-spin" />
        <div className="absolute inset-0 blur-2xl bg-sky-500/20 rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="h-20 w-full bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center px-4 space-x-4"
            >
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-gray-400 animate-pulse">
        Carregando informações...
      </p>
    </div>
  );
}