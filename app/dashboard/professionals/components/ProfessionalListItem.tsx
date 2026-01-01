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
        <div className="flex items-center justify-between p-4 mb-4 bg-white dark:bg-background-secondary rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground dark:text-card">
                        {professional.nome}
                    </h2>
                    {!professional.ativo && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-bold">
                            Inativo
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary-dark">Documento:</span> {professional.documento || "Não informado"}
                    </p>

                    {professional.especialidade && (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary-dark">Especialidade:</span> {professional.especialidade}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">

                {!professional.ativo ? (
                    <ButtonCard disabled>
                        <Edit2 size={16} />
                        Editar
                    </ButtonCard>
                ) : (
                    <ButtonCard onClick={() => onEdit(professional.id)}>
                        <Edit2 size={16} />
                        Editar
                    </ButtonCard>
                )}

                <ButtonCard
                    href={`/dashboard/professionals/${professional.id}`}
                >
                    <Eye size={16} />
                    Ver Mais
                </ButtonCard>
            </div>
        </div>
    );
}