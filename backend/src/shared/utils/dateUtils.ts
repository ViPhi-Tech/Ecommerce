const BRT_OFFSET_HOURS = 3; // Brasília = UTC-3

export function startOfDayBRT(date: Date | string): Date {
	const d = new Date(date);
	d.setUTCHours(BRT_OFFSET_HOURS, 0, 0, 0);
	return d;
}

export function endOfDayBRT(date: Date | string): Date {
	const d = new Date(date);
	d.setUTCDate(d.getUTCDate() + 1);
	d.setUTCHours(BRT_OFFSET_HOURS - 1, 59, 59, 999);
	return d;
}

export const parseDate = (dateString?: string | null): Date => {
	// Guard against undefined / null / non-string values
	if (!dateString || typeof dateString !== 'string') return new Date(NaN);

	const s = dateString.trim();
	if (!s) return new Date(NaN);

	// Support common formats: dd/mm/yyyy
	if (s.includes('/')) {
		const parts = s.split('/');
		if (parts.length !== 3) return new Date(NaN);
		const [day, month, year] = parts;
		// Interpreta dd/mm/yyyy como "data do calendário em BRT"
		// (preserva a data correta mesmo que o servidor execute em UTC)
		return startOfDayBRT(
			`${Number(year)}-${String(Number(month)).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`
		);
	}

	// Treat ISO-like strings as pure dates, ignoring timezone offsets
	// Examples:
	//   2025-03-16
	//   2025-03-16T00:00:00.000Z
	//   2025-03-16T03:00:00-03:00
	const isoDatePart = s.split('T')[0];
	if (/^\d{4}-\d{2}-\d{2}$/.test(isoDatePart)) {
		const [year, month, day] = isoDatePart.split('-').map(Number);
		// Preserva a "data do calendário" (BRT = UTC-3) mesmo que o servidor/banco
		// acabe interpretando/gravando em UTC.
		// Ex: 2026-03-15 vira 2026-03-15T03:00:00.000Z (que corresponde a 15/03 00:00 em UTC-3).
		return startOfDayBRT(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
	}

	// Fallback to Date parser (handles other browser/Node supported formats)
	return new Date(s);
};