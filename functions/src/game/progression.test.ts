import { createNewPlayer } from './createPlayer';
import { applyProgression, eventContributionGrant, pveEnemyRewards } from './progression';

describe('pveEnemyRewards', () => {
  it('scales XP and silver with enemy level', () => {
    expect(pveEnemyRewards(1)).toEqual({ xp: 25, silver: 28 });
    expect(pveEnemyRewards(5)).toEqual({ xp: 45, silver: 60 });
  });
});

describe('eventContributionGrant', () => {
  it('doubles event currency when a pass is owned', () => {
    expect(eventContributionGrant(false).eventCurrency).toBe(10);
    expect(eventContributionGrant(true).eventCurrency).toBe(20);
  });
});

describe('applyProgression', () => {
  it('refreshes combat stats and health after a level-up', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.xp = 90;
    applyProgression(player, 20, 1_000, {}, []);
    expect(player.level).toBe(2);
    expect(player.maxHealth).toBe(120);
    expect(player.health).toBe(120);
    expect(player.attack).toBe(18);
    expect(player.defense).toBe(14);
    expect(player.speed).toBe(12);
  });
});
