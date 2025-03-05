export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string }
): string {
  const safeCount = Math.max(0, count); // Ensure non-negative count
  return `${safeCount} ${safeCount === 1 ? singular : plural}`; // Always include count
}

export function formatPrice(amount: number, { showZeroAsNumber = false } = {}) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

  if (amount === 0 && !showZeroAsNumber) return "Free";
  return formatter.format(amount);
}
