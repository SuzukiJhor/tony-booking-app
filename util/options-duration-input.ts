export const durationOptions = Array.from({ length: 12 }, (_, i) => {
    const totalMinutes = (i + 1) * 30; // 30, 60, 90, 120, ...
    if (totalMinutes < 60) return { value: totalMinutes, label: `${totalMinutes} minutos` };

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let label = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    if (minutes > 0) label += ` ${minutes} min`;

    return { value: totalMinutes, label };
});