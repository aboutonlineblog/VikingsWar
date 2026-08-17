import { sfxForEvent } from './sfxForEvent';
import type { BattleEvent } from '@shared/types';

describe('sfxForEvent', () => {
  it('returns no sounds for ATB fill events', () => {
    expect(
      sfxForEvent({
        type: 'atb',
        playerFrom: 0,
        playerTo: 100,
        enemyFrom: 0,
        enemyTo: 50,
        durationMs: 800,
      }),
    ).toEqual([]);
  });

  it('maps each combat action to its sound', () => {
    const base = {
      type: 'action' as const,
      actor: 'player' as const,
      damage: 0,
      heal: 0,
      critical: false,
      hit: false,
      playerHp: 90,
      enemyHp: 40,
      playerAtb: 0,
      enemyAtb: 50,
    };
    expect(sfxForEvent({ ...base, action: 'attack' })).toEqual(['attack']);
    expect(sfxForEvent({ ...base, action: 'special' })).toEqual(['special']);
    expect(sfxForEvent({ ...base, action: 'defend' })).toEqual(['defend']);
    expect(sfxForEvent({ ...base, action: 'potion', heal: 20 })).toEqual(['potion']);
  });

  it('also plays hit when a strike lands', () => {
    const event: BattleEvent = {
      type: 'action',
      actor: 'enemy',
      action: 'attack',
      damage: 12,
      heal: 0,
      critical: false,
      hit: true,
      playerHp: 78,
      enemyHp: 40,
      playerAtb: 50,
      enemyAtb: 0,
    };
    expect(sfxForEvent(event)).toEqual(['attack', 'hit']);
  });
});
