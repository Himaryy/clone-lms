export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  options: { includeCount?: boolean } = {}
): string {
  const word = count === 1 ? singular : plural;

  return options.includeCount ? `${count} ${word}` : word;
}
