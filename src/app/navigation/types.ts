import type { BattleEvent, BattleSession, CombatResult, EnemyDef, HuntingRewards, QuestDef } from '@shared/types';

export type AuthStackParamList = {
  SignIn: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Battle: undefined;
  World: undefined;
  Clan: undefined;
  Viking: undefined;
};

export type CombatPayload = {
  title: string;
  opponentName?: string;
  enemy?: Pick<EnemyDef, 'id' | 'name' | 'type' | 'portraitUrl'>;
  battle?: BattleSession | null;
  events?: BattleEvent[];
  combat: CombatResult | null;
  rewards: QuestDef['rewards'] | HuntingRewards | null;
  lootName: string | null;
};

export type RootStackParamList = {
  Auth: undefined;
  CreateViking: undefined;
  Main: undefined;
  CombatStage: CombatPayload;
  CombatResult: CombatPayload;
  Quests: undefined;
  Inventory: undefined;
  Warband: undefined;
  Events: undefined;
  Shop: undefined;
  Friends: undefined;
  Leaderboards: undefined;
  Collections: undefined;
  VisitVillage: { uid: string };
  BossRaid: undefined;
};
