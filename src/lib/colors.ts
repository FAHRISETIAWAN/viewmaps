export const PARCEL_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

export function colorForIndex(index: number): string {
  return PARCEL_COLORS[index % PARCEL_COLORS.length];
}
