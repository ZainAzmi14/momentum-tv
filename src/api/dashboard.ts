export type DashboardItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function firstString(
  item: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export function normalizeDashboardItems(payload: unknown): DashboardItem[] {
  const values = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.items)
    ? payload.items
    : [];

  return values.map((value, index) => {
    const item = isRecord(value) ? value : {};
    const id = item.id ?? item.Id ?? index;

    return {
      id: String(id),
      title:
        firstString(item, ['title', 'name', 'Title', 'Name']) ??
        `Item ${index + 1}`,
      description: firstString(item, [
        'description',
        'summary',
        'Description',
        'Summary',
      ]),
      imageUrl: firstString(item, [
        'imageUrl',
        'image',
        'thumbnail',
        'ImageUrl',
      ]),
    };
  });
}
