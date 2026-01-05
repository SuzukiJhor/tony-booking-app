'use client';
import ButtonCard from "@/app/components/ButtonCard";
import { Edit2, Eye } from "lucide-react";

interface ProfessionalType {
    id: number;
    nome: string;
    documento?: string | null;
    especialidade?: string | null;
    ativo: boolean;
}

export default function ProfessionalListItem({
    professional,
    onEdit,
    onViewDetails
}: {
    professional: ProfessionalType;
    onEdit: (id: number) => void;
    onViewDetails: (id: number) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-4 bg-white dark:bg-background-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 gap-4">
            <div className="flex flex-col grow">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground dark:text-white truncate">
                        {professional.nome}
                    </h2>
                    {!professional.ativo && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full uppercase font-bold whitespace-nowrap">
                            Inativo
                        </span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Doc:</span> 
                        <span className="truncate">{professional.documento || "Não informado"}</span>
                    </p>

                    {professional.especialidade && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">Espec:</span> 
                            <span className="truncate">{professional.especialidade}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto border-t dark:border-gray-800 sm:border-t-0 pt-4 sm:pt-0">
                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full">
                    {!professional.ativo ? (
                        <ButtonCard disabled>
                            <Edit2 size={16} />
                            <span className="sm:inline">Editar</span>
                        </ButtonCard>
                    ) : (
                        <ButtonCard onClick={() => onEdit(professional.id)}>
                            <Edit2 size={16} />
                            <span className="sm:inline">Editar</span>
                        </ButtonCard>
                    )}

                    <ButtonCard href={`/panel/professionals/${professional.id}`}>
                        <Eye size={16} />
                        <span className="sm:inline">Ver Mais</span>
                    </ButtonCard>
                </div>
            </div>
        </div>
    );
}