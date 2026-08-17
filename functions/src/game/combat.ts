import type {
  ActionBattleEvent,
  AtbBattleEvent,
  BattleCombatant,
  BattleEvent,
  BattlePending,
  BattleSession,
  CombatAction,
  CombatResult,
  PlayerCombatAction,
} from '../../../shared/types';
import type { Rng } from './rng';
import {
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_DAMAGE,
  resolveStrike,
  VARIANCE_MAX,
  VARIANCE_MIN,
} from './strike';

export const CRIT_CHANCE = DEFAULT_CRIT_CHANCE;
export const CRIT_MULTIPLIER = DEFAULT_CRIT_DAMAGE;
export { VARIANCE_MIN, VARIANCE_MAX };
export const ATB_MAX = 100;
export const ATB_MS_PER_POINT = 45;
export const ATB_DURATION_MIN_MS = 400;
export const ATB_DURATION_MAX_MS = 1400;
export const SPEED_SOFT_CAP = 20;
export const MAX_ACTIONS = 40;
export const SPECIAL_MULTIPLIER = 1.6;
export const SPECIAL_COOLDOWN = 2;
export const POTION_USES = 2;
export const POTION_HEAL_RATIO = 0.3;
export const POTION_HEAL_MIN = 20;
export const GUARD_DAMAGE_FACTOR = 0.5;
export const POTION_HP_THRESHOLD = 0.35;

export interface Combatant {
  attack: number;
  defense: number;
  health: number;
  accuracy?: number;
  dodge?: number;
  critChance?: number;
  critDamage?: number;
}

export function rollDamage(
  attacker: Combatant,
  defender: Combatant,
  rng: Rng,
  weaponBonus = 0,
  warriorBonus = 0,
): { hit: boolean; damage: number; critical: boolean } {
  return resolveStrike(
    { ...attacker, attack: attacker.attack + weaponBonus + warriorBonus },
    defender,
    rng,
    1,
  );
}

export function effectiveSpeed(speed: number): number {
  const raw = Math.max(1, speed);
  return (raw * SPEED_SOFT_CAP) / (raw + SPEED_SOFT_CAP);
}

export function clampAtbDuration(durationMs: number): number {
  return Math.min(ATB_DURATION_MAX_MS, Math.max(ATB_DURATION_MIN_MS, durationMs));
}

export function potionHealAmount(maxHealth: number): number {
  return Math.max(POTION_HEAL_MIN, Math.round(maxHealth * POTION_HEAL_RATIO));
}

export function createBattleCombatant(input: {
  name: string;
  attack: number;
  defense: number;
  health: number;
  speed: number;
}): BattleCombatant {
  return {
    name: input.name,
    attack: input.attack,
    defense: input.defense,
    health: input.health,
    maxHealth: input.health,
    speed: Math.max(1, Number.isFinite(input.speed) ? input.speed : 10),
    atb: 0,
    guarding: false,
    specialReadyIn: 0,
    potionsRemaining: POTION_USES,
  };
}

export function createBattleSession(input: {
  id: string;
  title: string;
  opponentName: string;
  player: BattleCombatant;
  enemy: BattleCombatant;
  pending: BattlePending;
}): BattleSession {
  return {
    id: input.id,
    kind: input.pending.kind,
    title: input.title,
    opponentName: input.opponentName,
    player: input.player,
    enemy: input.enemy,
    waitingFor: 'player',
    actionCount: 0,
    attackerDamage: 0,
    defenderDamage: 0,
    critical: false,
    pending: input.pending,
  };
}

export function timeToFill(atb: number, speed: number): number {
  return (ATB_MAX - atb) / effectiveSpeed(speed);
}

export function nextActor(player: BattleCombatant, enemy: BattleCombatant): 'player' | 'enemy' {
  const playerTime = timeToFill(player.atb, player.speed);
  const enemyTime = timeToFill(enemy.atb, enemy.speed);
  return playerTime <= enemyTime ? 'player' : 'enemy';
}

export function isBattleOver(session: BattleSession): boolean {
  return (
    session.player.health <= 0 ||
    session.enemy.health <= 0 ||
    session.actionCount >= MAX_ACTIONS
  );
}

export function battleWinner(session: BattleSession): boolean {
  if (session.enemy.health <= 0 && session.player.health > 0) {
    return true;
  }
  if (session.player.health <= 0) {
    return false;
  }
  return session.player.health > session.enemy.health;
}

export function toCombatResult(session: BattleSession): CombatResult {
  return {
    attackerDamage: session.attackerDamage,
    defenderDamage: session.defenderDamage,
    critical: session.critical,
    attackerWon: battleWinner(session),
    attackerHpRemaining: session.player.health,
    defenderHpRemaining: session.enemy.health,
  };
}

export function canUseAction(
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

export function chooseEnemyAction(enemy: BattleCombatant): PlayerCombatAction {
  if (
    enemy.health <= enemy.maxHealth * POTION_HP_THRESHOLD &&
    enemy.potionsRemaining > 0 &&
    enemy.health < enemy.maxHealth
  ) {
    return 'potion';
  }
  if (enemy.specialReadyIn <= 0) {
    return 'special';
  }
  return 'attack';
}

function applyIncomingDamage(
  target: BattleCombatant,
  rawDamage: number,
): number {
  let damage = rawDamage;
  if (target.guarding) {
    damage = Math.max(1, Math.round(rawDamage * GUARD_DAMAGE_FACTOR));
    target.guarding = false;
  }
  target.health = Math.max(0, target.health - damage);
  return damage;
}

function beginTurn(combatant: BattleCombatant): void {
  if (combatant.specialReadyIn > 0) {
    combatant.specialReadyIn -= 1;
  }
}

export function advanceAtb(session: BattleSession): AtbBattleEvent | null {
  if (session.player.atb >= ATB_MAX || session.enemy.atb >= ATB_MAX) {
    return null;
  }
  const actor = nextActor(session.player, session.enemy);
  const playerRate = effectiveSpeed(session.player.speed);
  const enemyRate = effectiveSpeed(session.enemy.speed);
  const elapsed =
    actor === 'player'
      ? timeToFill(session.player.atb, session.player.speed)
      : timeToFill(session.enemy.atb, session.enemy.speed);
  const playerFrom = session.player.atb;
  const enemyFrom = session.enemy.atb;
  session.player.atb = Math.min(ATB_MAX, playerFrom + elapsed * playerRate);
  session.enemy.atb = Math.min(ATB_MAX, enemyFrom + elapsed * enemyRate);
  const playerDelta = session.player.atb - playerFrom;
  const enemyDelta = session.enemy.atb - enemyFrom;
  const durationMs = clampAtbDuration(
    Math.round(Math.max(playerDelta, enemyDelta) * ATB_MS_PER_POINT),
  );
  if (playerDelta <= 0 && enemyDelta <= 0) {
    return null;
  }
  return {
    type: 'atb',
    playerFrom,
    playerTo: session.player.atb,
    enemyFrom,
    enemyTo: session.enemy.atb,
    durationMs,
  };
}

export function applyAction(
  session: BattleSession,
  actor: 'player' | 'enemy',
  action: PlayerCombatAction,
  rng: Rng,
): ActionBattleEvent {
  const self = actor === 'player' ? session.player : session.enemy;
  const foe = actor === 'player' ? session.enemy : session.player;
  beginTurn(self);

  let damage = 0;
  let heal = 0;
  let critical = false;
  let hit = true;

  if (action === 'attack' || action === 'special') {
    const actionPower = action === 'special' ? SPECIAL_MULTIPLIER : 1;
    const strike = resolveStrike(self, foe, rng, actionPower);
    hit = strike.hit;
    critical = strike.critical;
    if (action === 'special') {
      self.specialReadyIn = SPECIAL_COOLDOWN;
    }
    if (strike.hit) {
      damage = applyIncomingDamage(foe, strike.damage);
      if (actor === 'player') {
        session.attackerDamage += damage;
      } else {
        session.defenderDamage += damage;
      }
      if (critical) {
        session.critical = true;
      }
    }
  } else if (action === 'defend') {
    self.guarding = true;
  } else if (action === 'potion') {
    const amount = potionHealAmount(self.maxHealth);
    const before = self.health;
    self.health = Math.min(self.maxHealth, self.health + amount);
    heal = self.health - before;
    self.potionsRemaining = Math.max(0, self.potionsRemaining - 1);
  }

  self.atb = 0;
  session.actionCount += 1;

  return {
    type: 'action',
    actor,
    action,
    damage,
    heal,
    critical,
    hit,
    playerHp: session.player.health,
    enemyHp: session.enemy.health,
    playerAtb: session.player.atb,
    enemyAtb: session.enemy.atb,
  };
}

export function resolveUntilPlayerTurn(session: BattleSession, rng: Rng): BattleEvent[] {
  const events: BattleEvent[] = [];
  while (!isBattleOver(session)) {
    if (session.player.atb >= ATB_MAX) {
      session.waitingFor = 'player';
      return events;
    }
    if (session.enemy.atb >= ATB_MAX) {
      events.push(applyAction(session, 'enemy', chooseEnemyAction(session.enemy), rng));
      continue;
    }
    const atbEvent = advanceAtb(session);
    if (atbEvent) {
      events.push(atbEvent);
    }
  }
  session.waitingFor = 'done';
  return events;
}

export function autoResolve(session: BattleSession, rng: Rng): BattleEvent[] {
  const events: BattleEvent[] = [];
  while (!isBattleOver(session)) {
    if (session.player.atb >= ATB_MAX) {
      events.push(applyAction(session, 'player', 'attack', rng));
      continue;
    }
    if (session.enemy.atb >= ATB_MAX) {
      events.push(applyAction(session, 'enemy', chooseEnemyAction(session.enemy), rng));
      continue;
    }
    const atbEvent = advanceAtb(session);
    if (atbEvent) {
      events.push(atbEvent);
    }
  }
  session.waitingFor = 'done';
  return events;
}

export function submitPlayerAction(
  session: BattleSession,
  action: CombatAction,
  rng: Rng,
): BattleEvent[] {
  if (session.waitingFor !== 'player' || session.player.atb < ATB_MAX) {
    throw new Error('NOT_PLAYER_TURN');
  }
  if (action === 'auto') {
    return autoResolve(session, rng);
  }
  if (!canUseAction(session.player, action)) {
    throw new Error('ACTION_UNAVAILABLE');
  }
  const events: BattleEvent[] = [applyAction(session, 'player', action, rng)];
  events.push(...resolveUntilPlayerTurn(session, rng));
  return events;
}

export function startBattle(session: BattleSession, rng: Rng): BattleEvent[] {
  return resolveUntilPlayerTurn(session, rng);
}
