"use client";
import { useParams, useRouter } from "next/navigation";
import { useClient } from "@/app/context/ClientsContext";
import { ArrowLeft } from "lucide-react";
import { DataBasePacienteType } from "../../types/patientDBType";
import { useState } from "react";
import { LoadingSpinner } from "@/app/components/LoadingProvider";
import ButtonPrimary from "@/app/components/ButtonPrimary";

export default function ClientDetailsPage() {
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { clients } = useClient() as {
        clients: DataBasePacienteType[];
        reloadEvents: () => void;
    };

    if (!clients || clients.length === 0) {
        return <>
            <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">
                <LoadingSpinner />;
            </div>
        </>
    }

    const client = clients.find((c) => String(c.id) === String(id));

    if (!client) {
        return <p className="p-6 text-muted-foreground">Cliente não encontrado</p>;
    }

    const agendamentos =
        client.agendamentos?.filter((a) => !a.isDeleted) ?? [];

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date(date));

    return (
        <div className="p-6 bg-background dark:bg-background-tertiary min-h-screen space-y-6">

            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition cursor-pointer dark:border-card dark:text-card"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 bg-white dark:bg-background-secondary rounded-xl shadow-md border dark:border-gray-700 p-6 space-y-3">
                    <h2 className="text-2xl font-bold text-sky-700 dark:text-card">
                        Dados do Paciente
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground dark:text-card">Nome:</span>{" "}
                        {client.nome}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground dark:text-card">Telefone:</span>{" "}
                        {client.telefone}
                    </p>

                    {client.email && (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground dark:text-card">Email:</span>{" "}
                            {client.email}
                        </p>
                    )}
                </div>

                {/* Ações */}
                <div className="bg-white dark:bg-background-secondary rounded-xl border text-white dark:border-gray-700 p-6 flex flex-col gap-4 justify-center">

                    <ButtonPrimary>
                        Editar paciente
                    </ButtonPrimary>

                    <ButtonPrimary
                        onClick={() => setShowHistory((prev) => !prev)}
                    >
                        {showHistory ? "Ocultar histórico" : "Histórico"}
                    </ButtonPrimary>
                </div>
            </div>


            {showHistory && (
                <div className="bg-white dark:bg-background-secondary rounded-xl shadow-md border dark:border-gray-700 p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-sky-700">
                        Histórico de Agendamentos
                    </h2>

                    {agendamentos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nenhum agendamento encontrado.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {agendamentos.map((agendamento: any) => (
                                <li
                                    key={agendamento.id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg border border-border bg-background dark:bg-background-tertiary"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground dark:text-card">
                                            {formatDate(agendamento.dataHora)}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Tipo: {agendamento.tipoAgendamento}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Duração: {agendamento.tempoAtendimento} min
                                        </p>
                                    </div>

                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full w-fit
                      ${agendamento.statusConfirmacao === "PENDENTE"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {agendamento.statusConfirmacao}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
