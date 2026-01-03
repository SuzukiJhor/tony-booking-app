import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    isTransitioning: boolean;
    goToPage: (page: number) => void;
}


export default function PaginationControls(
    {
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        isTransitioning,
        goToPage,
    }: PaginationControlsProps
) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 bg-chart-3 rounded-lg border border-border">

            <span className="text-sm b-4 md:mb-0 text-white">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} pacientes.
            </span>

            <div className="flex space-x-1">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || isTransitioning}
                    className={`p-2 rounded-lg transition border border-border ${currentPage === 1 || isTransitioning
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-background text-foreground hover:bg-muted cursor-pointer'
                        }`}
                >
                    <ChevronLeft size={20} />
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        disabled={isTransitioning}
                        className={`px-4 py-2 rounded-lg font-medium transition text-sm ${currentPage === page
                            ? 'bg-primary text-white shadow-md cursor-default'
                            : 'bg-background text-foreground hover:bg-muted border border-border cursor-pointer'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || isTransitioning}
                    className={`p-2 rounded-lg transition border border-border ${currentPage === totalPages || isTransitioning
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-background text-foreground hover:bg-muted cursor-pointer'
                        }`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}