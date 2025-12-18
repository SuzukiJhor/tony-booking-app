'use client';
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingSpinner = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <svg
                className="animate-spin h-12 w-12 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </motion.div>
    );
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const contextValue = useMemo(() => ({
        isLoading,
        setIsLoading,
    }), [isLoading]);

    return (
        <LoadingContext.Provider value={contextValue}>
            {children}
            <AnimatePresence>
                {isLoading && <LoadingSpinner />}
            </AnimatePresence>
        </LoadingContext.Provider>
    );
};