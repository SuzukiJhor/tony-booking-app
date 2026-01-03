export const statusStyleMap: Record<string, { label: string; classes: string; icon: string }> = {
    PENDENTE: {
        label: 'PENDENTE',
        classes: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        icon: '🟡'
    },
    MENSAGEM_ENVIADA: {
        label: 'MENSAGEM ENVIADA',
        classes: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        icon: '🔵'
    },
    CONFIRMADO: {
        label: 'CONFIRMADO',
        classes: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        icon: '🟢'
    },
    NAO_CONFIRMADO: {
        label: 'NÃO CONFIRMADO',
        classes: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        icon: '🔴'
    },
    CANCELADO: {
        label: 'CANCELADO',
        classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        icon: '⚪'
    }
};
