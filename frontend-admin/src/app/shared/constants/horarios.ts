export const horarios15em15 = () => {
  const horarios = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      horarios.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
    }
  }
  return horarios;
}

export const horarios30em30 = () => {
  const horarios = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      horarios.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
    }
  }
  return horarios;
}

export const horarios60em60 = () => {
  const horarios = [];
  for (let i = 0; i < 24; i++) {
    horarios.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return horarios;
}

export type HorarioIntervalType = 15 | 30 | 60;

export const getHorariosByInterval = (intervalMinutes: 15 | 30 | 60): string[] => {
  if (intervalMinutes === 15) return horarios15em15();
  if (intervalMinutes === 30) return horarios30em30();
  return horarios60em60();
}

export const getNextHorario = (value: string, type: HorarioIntervalType = 15): { start: string, end: string } | null => {
  const [h, m] = value.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;

  const interval = type === 15 ? 15 : type === 30 ? 30 : 60;
  const nextSlot = Math.ceil((m + 1) / interval) * interval;  

  const startTotal = h * 60 + nextSlot;
  const endTotal = startTotal + interval;

  if (endTotal > 24 * 60) return null;

  const fmt = (totalMin: number) => {
    const hh = Math.floor(totalMin / 60) % 24;
    const mm = totalMin % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  };

  return { start: fmt(startTotal), end: fmt(endTotal) };
}