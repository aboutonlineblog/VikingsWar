import type {
  BattleActor,
  BattleCombatant,
  BattleEvent,
  BattleSession,
  CombatResult,
  PlayerCombatAction,
} from '@shared/types';

export const ACTION_PAUSE_MS = 700;
export const ATB_DURATION_MIN_MS = 400;
export const ATB_DURATION_MAX_MS = 1400;

export interface CombatFx {
  action: PlayerCombatAction;
  actor: BattleActor;
  hit: boolean;
}

export interface BattleView {
  playerHp: number;
  playerMax: number;
  enemyHp: number;
  enemyMax: number;
  playerAtb: number;
  enemyAtb: number;
  floatText: string | null;
  paused: boolean;
  hitActor: 'player' | 'enemy' | null;
  fx: CombatFx | null;
}

export function clampPlaybackDuration(durationMs: number): number {
  return Math.min(ATB_DURATION_MAX_MS, Math.max(ATB_DURATION_MIN_MS, durationMs));
}

export function canUseCombatAction(
  combatant: BattleCombatant,
  action: PlayerCombatAction,
): boolean {
  if (action === 'special') {
    return combatant.specialReadyIn <= 0;
  }
  if (action === 'potion') {
    return combatant.potionsRemaining > 0 && combatant.health < combatant.maxHealth;
  }
  return true;
}

export function playerActionsEnabled(
  waitingFor: BattleSession['waitingFor'] | undefined,
  queueEmpty: boolean,
  submitting: boolean,
): boolean {
  return waitingFor === 'player' && queueEmpty && !submitting;
}

export function createBattleView(session: BattleSession, events: BattleEvent[]): BattleView {
  let playerHp = session.player.health;
  let enemyHp = session.enemy.health;
  let playerAtb = session.player.atb;
  let enemyAtb = session.enemy.atb;

  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (event.type === 'atb') {
      playerAtb = event.playerFrom;
      enemyAtb = event.enemyFrom;
    } else {
      if (event.action === 'potion') {
        if (event.actor === 'player') {
          playerHp -= event.heal;
        } else {
          enemyHp -= event.heal;
        }
      } else if (event.hit && event.damage > 0) {
        if (event.actor === 'player') {
          enemyHp += event.damage;
        } else {
          playerHp += event.damage;
        }
      }
      if (event.actor === 'player') {
        playerAtb = 100;
      } else {
        enemyAtb = 100;
      }
    }
  }

  return {
    playerHp: Math.max(0, playerHp),
    playerMax: session.player.maxHealth,
    enemyHp: Math.max(0, enemyHp),
    enemyMax: session.enemy.maxHealth,
    playerAtb,
    enemyAtb,
    floatText: null,
    paused: false,
    hitActor: null,
    fx: null,
  };
}

export function applyBattleEvent(view: BattleView, event: BattleEvent): BattleView {
  if (event.type === 'atb') {
    return {
      ...view,
      playerAtb: event.playerTo,
      enemyAtb: event.enemyTo,
      paused: false,
      floatText: null,
      hitActor: null,
      fx: null,
    };
  }

  let floatText: string | null = null;
  if (event.action === 'potion') {
    floatText = `+${event.heal} HP`;
  } else if (event.action === 'defend') {
    floatText = 'Guard';
  } else if (!event.hit) {
    floatText = 'Miss';
  } else if (event.damage > 0) {
    floatText = `${event.critical ? 'CRITICAL ' : ''}${event.damage} dmg`;
  }

  const hitActor =
    event.hit && (event.action === 'attack' || event.action === 'special')
      ? event.actor === 'player'
        ? 'enemy'
        : 'player'
      : null;

  return {
    ...view,
    playerHp: event.playerHp,
    enemyHp: event.enemyHp,
    playerAtb: event.playerAtb,
    enemyAtb: event.enemyAtb,
    paused: true,
    floatText,
    hitActor,
    fx: {
      action: event.action,
      actor: event.actor,
      hit: event.hit,
    },
  };
}

export function eventDurationMs(event: BattleEvent): number {
  if (event.type === 'atb') {
    return clampPlaybackDuration(event.durationMs);
  }
  return ACTION_PAUSE_MS;
}

export function battleIsFinished(
  battle: BattleSession | null | undefined,
  combat: CombatResult | null | undefined,
): boolean {
  return Boolean(combat) && (!battle || battle.waitingFor === 'done');
}
