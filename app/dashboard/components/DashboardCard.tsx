import React from 'react';

// Define as propriedades que o componente irá receber
interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType; // Tipo para ícones do lucide-react (CalendarCheck, Clock, etc.)
    description: string;
    // Limita as cores aceitas para as classes Tailwind CSS definidas abaixo
    color: 'indigo' | 'green' | 'amber' | 'blue';
}

// Mapa de classes Tailwind para aplicar as cores do ícone/fundo
const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
};

export default function DashboardCard({ title, value, icon: Icon, description, color }: DashboardCardProps) {
    // A classe 'dark:bg-background-secondary' deve ser a cor de fundo dos seus cards no tema escuro
    return (
        <div className="bg-white dark:bg-background-secondary p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">

            <div className="flex items-start justify-between">
                {/* Título e Valor */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>

                {/* Ícone */}
                {/* Usa o colorMap para aplicar as cores de fundo e texto dinamicamente */}
                <div className={`p-3 rounded-full ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* Descrição/Tendência */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                {description}
            </p>

        </div>
    );
}