export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

export function effectiveVolume(volume: number, muted: boolean): number {
  if (muted) {
    return 0;
  }
  return clampVolume(volume);
}
