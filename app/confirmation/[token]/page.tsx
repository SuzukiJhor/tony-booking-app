import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { decrypt } from '@/util/crypto-id';
import { processConfirmation } from './actions';
import SubmitButton from '@/app/components/SubmitButton';
import { Calendar, Clock, User2, MapPin, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default async function ConfirmationClient({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const idReal: string | null = await decrypt(decodeURIComponent(token));

    if (!idReal) return notFound();

    const agenda = await prisma.agendamento.findUnique({
        where: { id: parseInt(idReal) },
        include: { paciente: true, profissional: true, empresa: true }
    });

    if (!agenda || agenda.isDeleted) return notFound();

    const jaRespondido = agenda.statusConfirmacao === 'CONFIRMADO' || agenda.statusConfirmacao === 'CANCELADO';
    const dataFormatada = agenda.dataHora.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }).replace(/^\w/, (c) => c.toUpperCase());

    return (
        <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(at_top_right,#E2E8F0_0%,transparent_50%),radial-gradient(at_top_left,#EEF2FF_0%,transparent_50%)] flex items-center justify-center p-4 sm:p-6">
            <main className="max-w-110 w-full relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl" />

                <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">

                    <div className="px-8 py-6 bg-slate-900/2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Agendamento</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                            {agenda.empresa?.nome}
                        </span>
                    </div>

                    <div className="p-8 sm:p-10">
                        {jaRespondido ? (
                            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-700">
                                <div className={`w-28 h-28 rounded-[2.5rem] rotate-12 flex items-center justify-center mx-auto mb-10 transition-transform hover:rotate-0 duration-500 shadow-xl ${agenda.statusConfirmacao === 'CONFIRMADO'
                                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                                    : 'bg-rose-500 text-white shadow-rose-200'
                                    }`}>
                                    <div className="-rotate-12">
                                        {agenda.statusConfirmacao === 'CONFIRMADO'
                                            ? <CheckCircle2 size={52} strokeWidth={1.5} />
                                            : <XCircle size={52} strokeWidth={1.5} />
                                        }
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
                                    {agenda.statusConfirmacao === 'CONFIRMADO' ? 'Confirmado!' : 'Cancelado'}
                                </h2>

                                <p className="text-slate-500 leading-relaxed mb-8 text-balance">
                                    {agenda.statusConfirmacao === 'CONFIRMADO'
                                        ? `Excelente! ${agenda.profissional?.nome ? `O Dr(a). ${agenda.profissional.nome}` : 'A equipe'} estará aguardando você.`
                                        : 'Agradecemos o aviso. Caso precise reagendar, entre em contato.'}
                                </p>
                                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                                    <div className="flex flex-col gap-1 text-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Reservada</span>
                                        <span className="text-lg font-bold text-slate-700">{dataFormatada}</span>
                                        <span className="text-indigo-600 font-bold">{agenda.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                                <header>
                                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">
                                        Olá, <span className="text-indigo-600">{agenda.paciente?.nome?.split(' ')[0]}</span>
                                    </h1>
                                    <p className="text-slate-500 font-medium">Confirme sua consulta para prosseguirmos.</p>
                                </header>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md duration-300">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <User2 size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Profissional Especialista</p>
                                            <p className="text-lg font-bold text-slate-700 leading-none mt-1">{agenda.profissional?.nome}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                                            <Calendar className="text-indigo-500" size={20} />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Data</p>
                                                <p className="text-sm font-bold text-slate-700 capitalize">{agenda.dataHora.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                                            <Clock className="text-indigo-500" size={20} />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Hora</p>
                                                <p className="text-sm font-bold text-slate-700">{agenda.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                                    <MapPin className="absolute -right-2 -bottom-2 w-24 h-24 text-white/10 -rotate-12 transition-transform group-hover:scale-110 duration-500" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-6 h-0.5 bg-indigo-300" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Localização</p>
                                        </div>
                                        <p className="font-bold text-lg mb-1 leading-tight">{agenda.empresa?.nome}</p>
                                        <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                                            Rua Cristóvão Colombo, 1433<br />
                                            Centro - Alto Paraná / PR
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-2">
                                    <form action={processConfirmation} className="w-full">
                                        <input type="hidden" name="uuid" value={token} />
                                        <input type="hidden" name="action" value="CONFIRMADO" />
                                        <SubmitButton variant="primary">
                                            Confirmar Agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </SubmitButton>
                                    </form>

                                    <form action={processConfirmation} className="w-full text-center">
                                        <input type="hidden" name="uuid" value={token} />
                                        <input type="hidden" name="action" value="CANCELADO" />
                                        <button className="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors py-2 px-4 rounded-xl hover:bg-rose-50/50">
                                            Infelizmente não poderei ir
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Tony Agenda & Confirmação &copy; 2025
                </p>
            </main>
        </div>
    );
}