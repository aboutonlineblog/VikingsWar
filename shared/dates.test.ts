import { utcDateString } from './dates';

describe('utcDateString', () => {
  it('returns the UTC calendar date', () => {
    expect(utcDateString(Date.UTC(2026, 7, 16, 23, 30))).toBe('2026-08-16');
    expect(utcDateString(Date.UTC(2026, 7, 17, 0, 1))).toBe('2026-08-17');
  });
});
