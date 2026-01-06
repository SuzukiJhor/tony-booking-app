"use client";

import { Toaster } from "react-hot-toast";
import SubTitlePage from "../../components/SubTitlePage";
import { useSettingsController } from "../controller/useSettingsController";
import { Phone, MessageSquare, Loader2, Edit3, Save, X } from "lucide-react";

export default function BusinessPhoneSection() {
    const {
        phoneNumber,
        isLoading,
        isEditing,
        setIsEditing,
        handlePhoneChange,
        handleSavePhone,
        cancelEditing
    } = useSettingsController();

    return (
        <div className="bg-white dark:bg-background-secondary rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
            <Toaster position="top-right" reverseOrder={true} />
            
            <div className="p-6 border-b dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <SubTitlePage text="Configuração de Envio" />
                    <p className="text-sm text-muted-foreground pt-2">Defina o número que enviará as confirmações via WhatsApp</p>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col space-y-3">
                    <label className="text-sm font-medium dark:text-card flex items-center gap-2">
                        <Phone size={14} className="text-sky-600" /> Telefone de Disparo
                    </label>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="(00) 00000-0000"
                            value={phoneNumber}
                            onChange={e => handlePhoneChange(e.target.value)}
                            readOnly={!isEditing}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-3 sm:py-2 rounded-lg border transition-all outline-none text-base sm:text-sm
                                ${!isEditing
                                    ? "bg-gray-50 dark:bg-background-secondary border-transparent text-muted-foreground cursor-not-allowed"
                                    : "bg-secondary dark:bg-background-tertiary dark:text-card border-sky-500 ring-2 ring-sky-500/20"
                                }`}
                        />

                        <div className="flex gap-2 w-full sm:w-auto">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={cancelEditing}
                                        className="flex-1 sm:flex-none p-3 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg transition flex items-center justify-center"
                                    >
                                        <X size={20} />
                                        <span className="sm:hidden ml-2 font-medium">Cancelar</span>
                                    </button>
                                    <button
                                        onClick={handleSavePhone}
                                        disabled={isLoading || phoneNumber.length < 14}
                                        className="flex-[2] sm:flex-none px-6 py-3 sm:py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition text-sm font-medium flex items-center justify-center gap-2 disabled:bg-slate-400"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Salvar</>}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-sky-700 text-sky-700 dark:border-sky-400 dark:text-sky-400 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 transition text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={16} />
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}