import Link from "next/link";
import React from "react";

type ButtonCardProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
};

export default function ButtonCard({
    children,
    onClick,
    href,
    disabled = false,
}: ButtonCardProps) {
    const baseClasses = "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all";

    const stateClasses = disabled
        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70"
        : "text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-200 dark:shadow-none active:scale-95 cursor-pointer";

    const className = `${baseClasses} ${stateClasses}`;

    if (href && !disabled)
        return (
            <Link href={href} className={className} onClick={onClick}>
                {children}
            </Link>
        );

    return (
        <button
            onClick={disabled ? undefined : onClick}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}