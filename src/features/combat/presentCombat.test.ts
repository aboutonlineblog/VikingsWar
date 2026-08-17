import type { CombatPayload } from '@/app/navigation/types';
import type { CombatCallableResult } from '@shared/types';
import {
  combatPayloadFromResult,
  presentCombat,
  shouldPresentCombatStage,
} from './presentCombat';
import type { BattleSession } from '@shared/types';

function waitingBattle(): BattleSession {
  return {
    id: 'b1',
    kind: 'pve',
    title: 'Wild Boar',
    opponentName: 'Wild Boar',
    player: {
      name: 'Erik',
      attack: 20,
      defense: 10,
      health: 100,
      maxHealth: 100,
      speed: 10,
      atb: 100,
      guarding: false,
      specialReadyIn: 0,
      potionsRemaining: 2,
    },
    enemy: {
      name: 'Boar',
      attack: 12,
      defense: 6,
      health: 40,
      maxHealth: 40,
      speed: 8,
      atb: 40,
      guarding: false,
      specialReadyIn: 0,
      potionsRemaining: 2,
    },
    waitingFor: 'player',
    actionCount: 0,
    attackerDamage: 0,
    defenderDamage: 0,
    critical: false,
    pending: { kind: 'pve', enemyId: 'wild_boar', enemyLevel: 1, lootTableId: 'common_hunt' },
  };
}

function finishedBattle(): BattleSession {
  return { ...waitingBattle(), waitingFor: 'done' };
}

function combatResult(): NonNullable<CombatCallableResult['combat']> {
  return {
    attackerDamage: 40,
    defenderDamage: 0,
    critical: false,
    attackerWon: true,
    attackerHpRemaining: 100,
    defenderHpRemaining: 0,
  };
}

describe('presentCombat', () => {
  const navigation = { navigate: jest.fn() };

  beforeEach(() => {
    navigation.navigate.mockClear();
  });

  it('routes ongoing fights to CombatStage', () => {
    const payload = combatPayloadFromResult('Wild Boar', 'Wild Boar', {
      player: {} as CombatCallableResult['player'],
      battle: waitingBattle(),
      events: [],
      combat: null,
      loot: null,
      rewards: null,
    });

    expect(shouldPresentCombatStage(payload)).toBe(true);
    presentCombat(navigation as never, payload);
    expect(navigation.navigate).toHaveBeenCalledWith('CombatStage', payload);
  });

  it('routes finished fights with events to CombatStage', () => {
    const payload = combatPayloadFromResult('Wild Boar', 'Wild Boar', {
      player: {} as CombatCallableResult['player'],
      battle: finishedBattle(),
      events: [
        {
          type: 'action',
          actor: 'player',
          action: 'attack',
          damage: 40,
          heal: 0,
          critical: false,
          hit: true,
          playerHp: 100,
          enemyHp: 0,
          playerAtb: 0,
          enemyAtb: 40,
        },
      ],
      combat: combatResult(),
      loot: null,
      rewards: { xp: 20, silver: 30 },
    });

    expect(shouldPresentCombatStage(payload)).toBe(true);
    presentCombat(navigation as never, payload);
    expect(navigation.navigate).toHaveBeenCalledWith('CombatStage', payload);
  });

  it('routes legacy instant results directly to CombatResult', () => {
    const payload = combatPayloadFromResult('Wild Boar', 'Wild Boar', {
      player: {} as CombatCallableResult['player'],
      battle: null,
      events: [],
      combat: combatResult(),
      loot: null,
      rewards: { xp: 20, silver: 30 },
    });

    expect(shouldPresentCombatStage(payload)).toBe(false);
    presentCombat(navigation as never, payload);
    expect(navigation.navigate).toHaveBeenCalledWith('CombatResult', payload);
  });
});
