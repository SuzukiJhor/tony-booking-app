export function ProfessionalInfo({ icon, label, value, isEditing, onChange }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-muted-foreground">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase">{label}</p>
                {isEditing ? (
                    <input
                        className="text-sm font-medium border-b border-gray-300 focus:border-sky-500 focus:outline-none w-full bg-transparent dark:text-card"
                        defaultValue={value}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                ) : (
                    <p className="text-sm font-medium dark:text-card">{value || "---"}</p>
                )}
            </div>
        </div>
    );
}