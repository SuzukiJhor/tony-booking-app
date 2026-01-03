export default function ButtonCreateNewEmpty({
    onClick,
    description,
    descriptionButton,
}: {
    onClick: () => void;
    description?: string;
    descriptionButton: string;
}) {
    return (
        <div className="text-center p-12 dark:bg-background-tertiary bg-card rounded-xl text-muted-foreground">
            {description && <p className="text-lg mb-4 dark:text-card">{description}</p>}
            <button
                className="bg-sky-500 text-white py-2 px-6 rounded-lg hover:bg-sky-400 font-medium transition cursor-pointer"
                onClick={onClick}
            >
                + {descriptionButton}
            </button>
        </div>
    );
} 