import { ENERGY_INTERVAL_MS, formatCompact, formatCountdown, previewRegenPool, xpToNextLevel } from './progress';

describe('progress helpers', () => {
  it('formats compact numbers', () => {
    expect(formatCompact(950)).toBe('950');
    expect(formatCompact(12540)).toBe('13k');
  });

  it('formats countdowns', () => {
    expect(formatCountdown(95_000)).toBe('01:35');
  });

  it('matches the server XP curve', () => {
    expect(xpToNextLevel(1)).toBe(100);
    expect(xpToNextLevel(4)).toBe(800);
  });

  it('previews energy regeneration from elapsed time', () => {
    const next = previewRegenPool(
      { current: 10, max: 100, lastUpdatedAt: 0 },
      ENERGY_INTERVAL_MS * 3,
      ENERGY_INTERVAL_MS,
    );
    expect(next.current).toBe(13);
  });
});
