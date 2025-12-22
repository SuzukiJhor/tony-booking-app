import ButtonRedirectPrimary from "@/app/components/ButtonRedirectPrimary";
import { DataBasePacienteType } from "../../types/patientDBType";

export default function ClientListItem ({ patient, onViewDetails }: {
    patient: DataBasePacienteType;
    onViewDetails: (patientId: number) => void;
}) {
   return (
     <div className="flex items-center justify-between p-4 mb-4 bg-white dark:bg-background-secondary rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-foreground dark:text-card">
                    {patient.nome}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-primary-dark">Telefone:</span> {patient.telefone}
                </p>
                {patient.email && (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary-dark">Email:</span> {patient.email}
                    </p>
                )}
            </div>
    
            <div className="flex space-x-2">
                <ButtonRedirectPrimary
                    href={`/dashboard/clients/${patient.id}`}
                    onClick={() => onViewDetails(patient.id)}
                >
                    Ver Mais
                </ButtonRedirectPrimary>
            </div>
        </div>
   )
}