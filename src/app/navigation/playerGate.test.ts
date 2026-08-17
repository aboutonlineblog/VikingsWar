import { resolvePlayerGate } from './playerGate';

describe('resolvePlayerGate', () => {
  it('shows create viking only when the player doc is missing', () => {
    expect(
      resolvePlayerGate({
        initializing: false,
        hasUser: true,
        playerPending: false,
        playerError: false,
        player: null,
      }),
    ).toBe('create');
  });

  it('does not send an existing account to create viking after a fetch error', () => {
    expect(
      resolvePlayerGate({
        initializing: false,
        hasUser: true,
        playerPending: false,
        playerError: true,
        player: undefined,
      }),
    ).toBe('error');
  });

  it('waits while the player query is pending', () => {
    expect(
      resolvePlayerGate({
        initializing: false,
        hasUser: true,
        playerPending: true,
        playerError: false,
        player: undefined,
      }),
    ).toBe('loading');
  });
});
