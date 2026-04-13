export function imageObjectPosition(
  focusX: number | null | undefined,
  focusY: number | null | undefined,
): string {
  const x = Number.isFinite(focusX) ? Number(focusX) : 50;
  const y = Number.isFinite(focusY) ? Number(focusY) : 50;
  return `${x}% ${y}%`;
}
