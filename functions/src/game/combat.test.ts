import {
  applyAction,
  autoResolve,
  advanceAtb,
  ATB_DURATION_MAX_MS,
  ATB_DURATION_MIN_MS,
  ATB_MAX,
  canUseAction,
  chooseEnemyAction,
  clampAtbDuration,
  createBattleCombatant,
  createBattleSession,
  effectiveSpeed,
  nextActor,
  potionHealAmount,
  resolveUntilPlayerTurn,
  rollDamage,
  startBattle,
  submitPlayerAction,
  toCombatResult,
} from './combat';
import { createRng } from './rng';
import type { BattleSession } from '../../../shared/types';

function makeSession(
  player: { attack?: number; defense?: number; health?: number; speed: number },
  enemy: { attack?: number; defense?: number; health?: number; speed: number },
): BattleSession {
  return createBattleSession({
    id: 'battle-1',
    title: 'Test',
    opponentName: 'Boar',
    player: createBattleCombatant({
      name: 'Erik',
      attack: player.attack ?? 40,
      defense: player.defense ?? 10,
      health: player.health ?? 100,
      speed: player.speed,
    }),
    enemy: createBattleCombatant({
      name: 'Boar',
      attack: enemy.attack ?? 20,
      defense: enemy.defense ?? 5,
      health: enemy.health ?? 80,
      speed: enemy.speed,
    }),
    pending: { kind: 'pve', enemyId: 'wild_boar', enemyLevel: 1, lootTableId: 'common_hunt' },
  });
}

describe('rollDamage', () => {
  it('deals at least 1 damage', () => {
    const rng = createRng(1);
    const roll = rollDamage(
      { attack: 1, defense: 0, health: 10 },
      { attack: 0, defense: 10_000, health: 10 },
      rng,
    );
    expect(roll.damage).toBeGreaterThanOrEqual(1);
  });
});

describe('ATB', () => {
  it('lets the player act first when speeds are equal', () => {
    expect(
      nextActor(
        createBattleCombatant({ name: 'A', attack: 1, defense: 1, health: 10, speed: 10 }),
        createBattleCombatant({ name: 'B', attack: 1, defense: 1, health: 10, speed: 10 }),
      ),
    ).toBe('player');
  });

  it('lets the faster combatant act first', () => {
    const session = makeSession({ speed: 10 }, { speed: 20 });
    expect(nextActor(session.player, session.enemy)).toBe('enemy');
  });

  it('fills gauges until the next actor reaches 100 and does not advance while waiting', () => {
    const session = makeSession({ speed: 10 }, { speed: 5 });
    const event = advanceAtb(session);
    expect(event?.playerTo).toBe(ATB_MAX);
    expect(session.player.atb).toBe(ATB_MAX);
    expect(session.enemy.atb).toBe(60);
    expect(event?.durationMs).toBeGreaterThanOrEqual(ATB_DURATION_MIN_MS);
    expect(event?.durationMs).toBeLessThanOrEqual(ATB_DURATION_MAX_MS);
    expect(advanceAtb(session)).toBeNull();
  });

  it('soft-caps Speed so four times the stat is not four times the fill rate', () => {
    expect(effectiveSpeed(40) / effectiveSpeed(10)).toBeLessThan(4);
    expect(effectiveSpeed(10)).toBeCloseTo((10 * 20) / 30);
  });

  it('clamps ATB playback duration for snappy fills', () => {
    expect(clampAtbDuration(80)).toBe(ATB_DURATION_MIN_MS);
    expect(clampAtbDuration(2400)).toBe(ATB_DURATION_MAX_MS);
    expect(clampAtbDuration(800)).toBe(800);
  });

  it('resets ATB after an action', () => {
    const session = makeSession({ speed: 10 }, { speed: 10 });
    session.player.atb = ATB_MAX;
    applyAction(session, 'player', 'attack', createRng(3));
    expect(session.player.atb).toBe(0);
  });
});

describe('combat actions', () => {
  it('makes special deal more damage than attack with the same rng seed', () => {
    const attackSession = makeSession({ speed: 10, attack: 50 }, { speed: 10, defense: 10 });
    const specialSession = makeSession({ speed: 10, attack: 50 }, { speed: 10, defense: 10 });
    attackSession.player.atb = ATB_MAX;
    specialSession.player.atb = ATB_MAX;
    const attack = applyAction(attackSession, 'player', 'attack', createRng(9));
    const special = applyAction(specialSession, 'player', 'special', createRng(9));
    expect(special.damage).toBeGreaterThan(attack.damage);
    expect(specialSession.player.specialReadyIn).toBe(2);
    expect(canUseAction(specialSession.player, 'special')).toBe(false);
  });

  it('halves incoming damage while guarding', () => {
    const session = makeSession({ speed: 10, health: 100 }, { speed: 10, attack: 40 });
    session.player.atb = ATB_MAX;
    applyAction(session, 'player', 'defend', createRng(2));
    expect(session.player.guarding).toBe(true);
    session.enemy.atb = ATB_MAX;
    const hit = applyAction(session, 'enemy', 'attack', createRng(2));
    const unguarded = makeSession({ speed: 10, health: 100 }, { speed: 10, attack: 40 });
    unguarded.enemy.atb = ATB_MAX;
    const raw = applyAction(unguarded, 'enemy', 'attack', createRng(2));
    expect(hit.damage).toBe(Math.max(1, Math.round(raw.damage * 0.5)));
    expect(session.player.guarding).toBe(false);
  });

  it('does not consume guard or deal damage on a miss', () => {
    const session = makeSession({ speed: 10, health: 100 }, { speed: 10, attack: 40 });
    session.player.atb = ATB_MAX;
    applyAction(session, 'player', 'defend', createRng(2));
    session.player.dodge = 100;
    session.enemy.accuracy = 100;
    session.enemy.atb = ATB_MAX;
    const miss = applyAction(session, 'enemy', 'attack', { next: () => 0.5 });
    expect(miss.hit).toBe(false);
    expect(miss.damage).toBe(0);
    expect(session.player.health).toBe(100);
    expect(session.player.guarding).toBe(true);
  });

  it('heals with a potion and consumes a use', () => {
    const session = makeSession({ speed: 10, health: 100 }, { speed: 10 });
    session.player.health = 40;
    session.player.atb = ATB_MAX;
    const event = applyAction(session, 'player', 'potion', createRng(1));
    expect(event.heal).toBe(potionHealAmount(100));
    expect(session.player.health).toBe(40 + potionHealAmount(100));
    expect(session.player.potionsRemaining).toBe(1);
  });
});

describe('enemy AI', () => {
  it('drinks a potion when wounded', () => {
    const enemy = createBattleCombatant({
      name: 'Boar',
      attack: 10,
      defense: 5,
      health: 100,
      speed: 10,
    });
    enemy.health = 20;
    expect(chooseEnemyAction(enemy)).toBe('potion');
  });

  it('uses special when healthy and ready', () => {
    const enemy = createBattleCombatant({
      name: 'Boar',
      attack: 10,
      defense: 5,
      health: 100,
      speed: 10,
    });
    expect(chooseEnemyAction(enemy)).toBe('special');
  });

  it('attacks when special is on cooldown', () => {
    const enemy = createBattleCombatant({
      name: 'Boar',
      attack: 10,
      defense: 5,
      health: 100,
      speed: 10,
    });
    enemy.specialReadyIn = 1;
    expect(chooseEnemyAction(enemy)).toBe('attack');
  });
});

describe('battle flow', () => {
  it('waits for the player after filling their gauge', () => {
    const session = makeSession({ speed: 20 }, { speed: 10 });
    const events = startBattle(session, createRng(4));
    expect(session.waitingFor).toBe('player');
    expect(session.player.atb).toBe(ATB_MAX);
    expect(events.some((event) => event.type === 'atb')).toBe(true);
  });

  it('rejects actions when it is not the player turn', () => {
    const session = makeSession({ speed: 10 }, { speed: 10 });
    expect(() => submitPlayerAction(session, 'attack', createRng(1))).toThrow('NOT_PLAYER_TURN');
  });

  it('auto-resolves until a winner under the round cap', () => {
    const session = makeSession({ speed: 12, attack: 80, health: 120 }, { speed: 8, health: 60 });
    startBattle(session, createRng(11));
    autoResolve(session, createRng(11));
    const result = toCombatResult(session);
    expect(session.waitingFor).toBe('done');
    expect(result.attackerHpRemaining === 0 || result.defenderHpRemaining === 0).toBe(true);
  });

  it('lets a faster enemy act before waiting on the player', () => {
    const session = makeSession(
      { speed: 5, health: 200, defense: 40 },
      { speed: 25, attack: 15, health: 80 },
    );
    const events = resolveUntilPlayerTurn(session, createRng(6));
    expect(events.some((event) => event.type === 'action' && event.actor === 'enemy')).toBe(true);
    expect(session.waitingFor).toBe('player');
  });

  it('lets high attack and defense beat a much faster but weaker foe', () => {
    const session = makeSession(
      { attack: 60, defense: 70, health: 220, speed: 10 },
      { attack: 35, defense: 20, health: 90, speed: 40 },
    );
    autoResolve(session, createRng(21));
    expect(toCombatResult(session).attackerWon).toBe(true);
  });
});
