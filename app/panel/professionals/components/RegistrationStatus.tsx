export default function RegistrationStatus({ status }: { status: string }) {
    return (
        <div className="bg-white dark:bg-background-secondary rounded-xl border dark:border-gray-700 p-6">
            <p className="text-sm text-muted-foreground mb-4">Status do Cadastro</p>
            <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-bold dark:text-white">
                    {status ? 'CONTA ATIVA' : 'INATIVO'}
                </span>
            </div>
        </div>
    );
}