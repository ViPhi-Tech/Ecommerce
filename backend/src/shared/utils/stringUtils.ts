export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function stripNonDigitsOrNull(
  value: string | null | undefined
): string | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }

  const digits = stripNonDigits(value);
  return digits === '' ? null : digits;
}
