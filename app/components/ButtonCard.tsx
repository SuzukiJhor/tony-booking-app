import Link from "next/link";
import React from "react";

type ButtonCardProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
};

export default function ButtonCard({
    children,
    onClick,
    href,
}: ButtonCardProps) {
    const className = "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-200 dark:shadow-none transition-all active:scale-95 cursor-pointer";

    if (href) {
        return (
            <Link href={href} className={className} onClick={onClick}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}