"use client";
import { useEffect, useState } from "react";
import ButtonCard from "@/app/components/ButtonCard";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, History, User, Phone, Mail, FileText, Activity, Calendar, Search } from "lucide-react";
import { useLoading } from "@/app/components/LoadingProvider";
import { fetchProfessionalById } from "@/util/api/api-professionals";

export default function ProfessionalDetails() {
    const [showHistory, setShowHistory] = useState(true);
    const [professional, setProfessional] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const params = useParams();
    const { setIsLoading } = useLoading();

    const fetchData = async () => {
        const id = params?.id;
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchProfessionalById(Number(id));
            setProfessional(data);
        } catch (err: any) {
            setError(err.message || "Erro");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params?.id]);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center dark:bg-background-tertiary justify-center p-6 text-center space-y-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-full text-red-500 dark:text-red-400">
                    <Search size={64} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground dark:text-primary">Profissional não encontrado</h2>
                    <p className="text-black dark:text-card max-w-sm mx-auto">
                        Ocorreu um erro ao tentar localizar este registro. O profissional pode ter sido removido ou o link está incorreto.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/professionals")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl transition-all shadow-md"
                >
                    <ArrowLeft size={18} />
                    Voltar para a lista
                </button>
            </div>
        );
    }

    if (!professional) {
        return <div className="min-h-screen bg-background dark:bg-background-tertiary" />;
    }

    const agendamentos = professional?.agendamentos
        ?.filter((a: any) => !a.isDeleted)
        .sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()) ?? [];

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
                <div className="md:col-span-2 bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-sky-100 dark:bg-sky-900/40 rounded-full flex items-center justify-center text-sky-700 dark:text-sky-300">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-card">{professional.nome}</h2>
                                <p className="text-sky-600 dark:text-sky-400 font-medium">{professional.especialidade || "Clínico Geral"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-t dark:border-gray-700 pt-6">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Documento / CRO</p>
                                <p className="text-sm font-medium dark:text-card">{professional.documento || "---"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Telefone</p>
                                <p className="text-sm font-medium dark:text-card">{professional.telefone || "---"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">E-mail</p>
                                <p className="text-sm font-medium dark:text-card">{professional.email || "---"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Atendimentos</p>
                                <p className="text-sm font-medium dark:text-card">{agendamentos.length} realizados</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-background-secondary rounded-xl border text-white dark:border-gray-700 p-6 flex flex-col gap-4 justify-center">
                        <p className="text-sm text-muted-foreground mb-4">Relatórios e Histórico</p>
                        <ButtonCard onClick={() => setShowHistory((prev) => !prev)}>
                            <History size={16} />
                            {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
                        </ButtonCard>
                    </div>
                </div>
            </div>

            {showHistory && (
                <div className="bg-white dark:bg-background-secondary rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2 dark:text-card">
                            <Activity size={20} className="text-sky-600" />
                            Histórico de Atendimentos
                        </h2>
                        <span className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full font-medium">
                            {agendamentos.length} Registros
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-background-tertiary">
                                <tr>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Paciente</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Data / Hora</th>
                                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {agendamentos.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-muted-foreground italic">
                                            Nenhum agendamento registrado para este profissional até o momento.
                                        </td>
                                    </tr>
                                ) : (
                                    agendamentos.map((agendamento: any) => (
                                        <tr key={agendamento.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-sky-700 dark:text-sky-400">
                                                    {agendamento.paciente?.nome || "Paciente não identificado"}
                                                </p>
                                            </td>
                                            <td className="p-4 text-sm dark:text-card">
                                                {formatDate(agendamento.dataHora)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase
                                                    ${agendamento.statusConfirmacao === 'CONFIRMADO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        agendamento.statusConfirmacao === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {agendamento.statusConfirmacao}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}