import { nextTerritoryStatus } from './territory';

describe('nextTerritoryStatus', () => {
  it('advances locked to explored and explored to conquered', () => {
    expect(nextTerritoryStatus('locked')).toBe('explored');
    expect(nextTerritoryStatus('explored')).toBe('conquered');
  });

  it('does not reward an already conquered territory', () => {
    expect(nextTerritoryStatus('conquered')).toBeNull();
  });
});
