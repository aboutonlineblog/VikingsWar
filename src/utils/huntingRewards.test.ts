import { formatHuntingRewards, isHuntingRewards } from './huntingRewards';

describe('huntingRewards utils', () => {
  it('formats hunting rewards for display', () => {
    expect(
      formatHuntingRewards({
        xp: 40,
        silver: 25,
        gold: 3,
        meat: 1,
      }),
    ).toBe('XP 40 · Silver 25 · Gold 3 · Meat 1');
  });

  it('detects hunting reward payloads', () => {
    expect(isHuntingRewards({ xp: 1, silver: 2 })).toBe(true);
    expect(isHuntingRewards({ xp: 1, silver: 2, food: 3 })).toBe(true);
    expect(isHuntingRewards(null)).toBe(false);
  });
});
