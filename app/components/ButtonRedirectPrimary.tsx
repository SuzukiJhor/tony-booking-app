import Link from "next/link";

type ButtonRedirectPrimaryProps = {
    children: React.ReactNode;
    onClick: (id?: string) => void;
    href: string;
    id?: string;
};

export default function ButtonRedirectPrimary({
    children,
    onClick,
    href,
    id,
}: ButtonRedirectPrimaryProps) {
    return (
        <Link
            href={href}
            onClick={() => onClick(id)}
            className="px-4 py-2 rounded bg-sky-500 text-card hover:opacity-90 cursor-pointer"
        >
            {children}
        </Link>
    );
}