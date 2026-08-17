import type { TerritoryStatus } from '../../../shared/types';

export function nextTerritoryStatus(current: TerritoryStatus): TerritoryStatus | null {
  if (current === 'locked') {
    return 'explored';
  }
  if (current === 'explored') {
    return 'conquered';
  }
  return null;
}
