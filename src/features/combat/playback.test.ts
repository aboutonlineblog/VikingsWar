import {
  applyBattleEvent,
  ATB_DURATION_MAX_MS,
  ATB_DURATION_MIN_MS,
  battleIsFinished,
  createBattleView,
  eventDurationMs,
  playerActionsEnabled,
} from './playback';
import type { BattleSession } from '@shared/types';

function session(): BattleSession {
  return {
    id: 'b1',
    kind: 'pve',
    title: 'Wild Boar',
    opponentName: 'Wild Boar',
    player: {
      name: 'Erik',
      attack: 20,
      defense: 10,
      health: 90,
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
      atb: 50,
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

describe('battle playback', () => {
  it('rewinds ATB so the fill can play from the start', () => {
    const battle = session();
    const view = createBattleView(battle, [
      {
        type: 'atb',
        playerFrom: 0,
        playerTo: 100,
        enemyFrom: 0,
        enemyTo: 50,
        durationMs: 800,
      },
    ]);
    expect(view.playerAtb).toBe(0);
    expect(view.enemyAtb).toBe(0);
    expect(view.playerHp).toBe(90);
  });

  it('pauses bars when an attack event is applied', () => {
    const view = createBattleView(session(), []);
    const next = applyBattleEvent(view, {
      type: 'action',
      actor: 'player',
      action: 'attack',
      damage: 12,
      heal: 0,
      critical: true,
      hit: true,
      playerHp: 90,
      enemyHp: 28,
      playerAtb: 0,
      enemyAtb: 50,
    });
    expect(next.paused).toBe(true);
    expect(next.floatText).toContain('CRITICAL');
    expect(next.enemyHp).toBe(28);
    expect(next.hitActor).toBe('enemy');
    expect(next.fx).toEqual({
      action: 'attack',
      actor: 'player',
      hit: true,
    });
  });

  it('does not pause bars during an ATB fill event', () => {
    const view = createBattleView(session(), []);
    const next = applyBattleEvent(view, {
      type: 'atb',
      playerFrom: 0,
      playerTo: 100,
      enemyFrom: 0,
      enemyTo: 50,
      durationMs: 800,
    });
    expect(next.paused).toBe(false);
    expect(next.playerAtb).toBe(100);
    expect(next.hitActor).toBeNull();
    expect(next.fx).toBeNull();
  });

  it('tracks defend, potion, and player-hit FX', () => {
    const view = createBattleView(session(), []);
    expect(view.fx).toBeNull();

    const defend = applyBattleEvent(view, {
      type: 'action',
      actor: 'player',
      action: 'defend',
      damage: 0,
      heal: 0,
      critical: false,
      hit: false,
      playerHp: 90,
      enemyHp: 40,
      playerAtb: 0,
      enemyAtb: 50,
    });
    expect(defend.fx).toEqual({ action: 'defend', actor: 'player', hit: false });

    const potion = applyBattleEvent(view, {
      type: 'action',
      actor: 'player',
      action: 'potion',
      damage: 0,
      heal: 30,
      critical: false,
      hit: false,
      playerHp: 100,
      enemyHp: 40,
      playerAtb: 0,
      enemyAtb: 50,
    });
    expect(potion.fx).toEqual({ action: 'potion', actor: 'player', hit: false });

    const hit = applyBattleEvent(view, {
      type: 'action',
      actor: 'enemy',
      action: 'special',
      damage: 18,
      heal: 0,
      critical: false,
      hit: true,
      playerHp: 72,
      enemyHp: 40,
      playerAtb: 50,
      enemyAtb: 0,
    });
    expect(hit.hitActor).toBe('player');
    expect(hit.fx).toEqual({ action: 'special', actor: 'enemy', hit: true });
  });

  it('shows a miss without a portrait hit pulse', () => {
    const view = createBattleView(session(), []);
    const next = applyBattleEvent(view, {
      type: 'action',
      actor: 'enemy',
      action: 'attack',
      damage: 0,
      heal: 0,
      critical: false,
      hit: false,
      playerHp: 90,
      enemyHp: 40,
      playerAtb: 50,
      enemyAtb: 0,
    });
    expect(next.paused).toBe(true);
    expect(next.floatText).toBe('Miss');
    expect(next.hitActor).toBeNull();
  });

  it('clamps ATB event duration for Skip and auto playback', () => {
    const atb = {
      type: 'atb' as const,
      playerFrom: 0,
      playerTo: 100,
      enemyFrom: 0,
      enemyTo: 50,
      durationMs: 80,
    };
    expect(eventDurationMs(atb)).toBe(ATB_DURATION_MIN_MS);
    expect(eventDurationMs({ ...atb, durationMs: 2400 })).toBe(ATB_DURATION_MAX_MS);
  });

  it('enables player actions only while waiting with an empty queue', () => {
    expect(playerActionsEnabled('player', true, false)).toBe(true);
    expect(playerActionsEnabled('player', false, false)).toBe(false);
    expect(playerActionsEnabled('done', true, false)).toBe(false);
    expect(playerActionsEnabled('player', true, true)).toBe(false);
  });

  it('detects finished fights from combat snapshots and legacy responses', () => {
    const battle = session();
    const combat = {
      attackerDamage: 40,
      defenderDamage: 0,
      critical: false,
      attackerWon: true,
      attackerHpRemaining: 90,
      defenderHpRemaining: 0,
    };

    expect(battleIsFinished(null, combat)).toBe(true);
    expect(battleIsFinished({ ...battle, waitingFor: 'done' }, combat)).toBe(true);
    expect(battleIsFinished(battle, null)).toBe(false);
    expect(battleIsFinished(battle, combat)).toBe(false);
  });

  it('rewinds a done snapshot with events for playback', () => {
    const battle = {
      ...session(),
      waitingFor: 'done' as const,
      enemy: { ...session().enemy, health: 0 },
    };
    const view = createBattleView(battle, [
      {
        type: 'action',
        actor: 'player',
        action: 'attack',
        damage: 40,
        heal: 0,
        critical: false,
        hit: true,
        playerHp: 90,
        enemyHp: 0,
        playerAtb: 0,
        enemyAtb: 50,
      },
    ]);

    expect(view.enemyHp).toBe(40);
    expect(view.playerHp).toBe(90);
    expect(view.playerAtb).toBe(100);
  });
});
