export function utcDateString(nowMs: number): string {
  return new Date(nowMs).toISOString().slice(0, 10);
}
