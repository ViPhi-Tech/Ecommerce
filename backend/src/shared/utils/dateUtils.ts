export const parseDate = (dateString?: string | null): Date => {
	// Guard against undefined / null / non-string values
	if (!dateString || typeof dateString !== 'string') return new Date(NaN);

	const s = dateString.trim();
	if (!s) return new Date(NaN);

	// Support common formats: dd/mm/yyyy and ISO (yyyy-mm-dd or full ISO)
	if (s.includes('/')) {
		const parts = s.split('/');
		if (parts.length !== 3) return new Date(NaN);
		const [day, month, year] = parts;
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	// Fallback to Date parser (handles ISO and other browser/Node supported formats)
	const parsed = new Date(s);
	return parsed;
};