export const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));

export const getDayOfWeek = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
    }).format(d);
};