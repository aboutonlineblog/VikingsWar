import { clampVolume, effectiveVolume } from './effectiveVolume';

describe('effectiveVolume', () => {
  it('returns 0 when muted regardless of slider volume', () => {
    expect(effectiveVolume(1, true)).toBe(0);
    expect(effectiveVolume(0.7, true)).toBe(0);
  });

  it('returns the clamped volume when unmuted', () => {
    expect(effectiveVolume(0.7, false)).toBe(0.7);
    expect(effectiveVolume(1.4, false)).toBe(1);
    expect(effectiveVolume(-0.2, false)).toBe(0);
  });

  it('treats non-finite values as 0', () => {
    expect(clampVolume(Number.NaN)).toBe(0);
    expect(clampVolume(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
