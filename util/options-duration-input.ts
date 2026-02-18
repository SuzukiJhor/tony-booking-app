export const durationOptions = Array.from({ length: 24 }, (_, i) => {
  const totalMinutes = (i + 1) * 15;

  if (totalMinutes < 60) {
    return { value: totalMinutes, label: `${totalMinutes} minutos` };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let label = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (minutes > 0) label += ` ${minutes} min`;

  return { value: totalMinutes, label };
});
