import {
  completedBattleSnapshot,
  settleIfComplete,
} from './battleRewards';
import {
  createBattleCombatant,
  createBattleSession,
} from '../game/combat';
import { createNewPlayer } from '../game/createPlayer';
import type { BattleSession } from '../../../shared/types';

jest.mock('../lib/context', () => ({
  savePlayer: jest.fn(async () => undefined),
  loadGameData: jest.fn(async () => ({
    itemsById: {},
    collections: [],
    buildings: [],
    quests: [],
  })),
  loadCatalog: jest.fn(async () => []),
}));

function finishedBattle(): BattleSession {
  return createBattleSession({
    id: 'battle-1',
    title: 'Wild Boar',
    opponentName: 'Wild Boar',
    player: createBattleCombatant({
      name: 'Erik',
      attack: 40,
      defense: 10,
      health: 80,
      speed: 10,
    }),
    enemy: createBattleCombatant({
      name: 'Boar',
      attack: 12,
      defense: 6,
      health: 0,
      speed: 8,
    }),
    pending: { kind: 'pve', enemyId: 'wild_boar', enemyLevel: 1, lootTableId: 'common_hunt' },
  });
}

describe('battleRewards', () => {
  it('builds a playback snapshot for completed fights', () => {
    const battle = finishedBattle();
    battle.waitingFor = 'player';

    const snapshot = completedBattleSnapshot(battle);

    expect(snapshot.waitingFor).toBe('done');
    expect(snapshot.enemy.health).toBe(0);
  });

  it('returns a battle snapshot when settlement completes', async () => {
    const player = createNewPlayer('u1', 'Erik', 'wolf', Date.now());
    const battle = finishedBattle();
    battle.waitingFor = 'done';
    player.activeBattle = battle;

    const result = await settleIfComplete(
      player,
      [
        {
          type: 'action',
          actor: 'player',
          action: 'attack',
          damage: 40,
          heal: 0,
          critical: false,
          hit: true,
          playerHp: 80,
          enemyHp: 0,
          playerAtb: 0,
          enemyAtb: 50,
        },
      ],
      Date.now(),
    );

    expect(result.combat).not.toBeNull();
    expect(result.battle).not.toBeNull();
    expect(result.battle?.waitingFor).toBe('done');
    expect(player.activeBattle).toBeNull();
  });
});
