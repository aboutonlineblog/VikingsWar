export const playerKeys = {
  all: ['player'] as const,
  me: (uid: string) => ['player', uid] as const,
};

export const catalogKeys = {
  all: ['catalogs'] as const,
  doc: (id: string) => ['catalogs', id] as const,
};

export const clanKeys = {
  all: ['clans'] as const,
  detail: (id: string) => ['clans', id] as const,
  chat: (id: string) => ['clans', id, 'chat'] as const,
  list: ['clans', 'list'] as const,
};

export const socialKeys = {
  battles: (uid: string) => ['battles', uid] as const,
  leaderboards: ['leaderboards'] as const,
  liveOps: ['liveOps'] as const,
  pvpTargets: ['pvpTargets'] as const,
  raid: (clanId: string) => ['raid', clanId] as const,
};
