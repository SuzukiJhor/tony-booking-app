export default function ButtonPrimary({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 rounded bg-sky-500 text-card hover:opacity-90 cursor-pointer"
        >
            {children}
        </button>
    );
}