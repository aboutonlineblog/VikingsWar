import React from 'react';
import { render } from '@testing-library/react-native';
import { GameHud } from './GameHud';
import { SettingsProvider } from '@/features/settings';

jest.mock('@/features/player', () => ({
  usePlayer: jest.fn(),
}));

const { usePlayer } = jest.requireMock('@/features/player') as { usePlayer: jest.Mock };

const basePlayer = {
  vikingName: 'Erik',
  avatarId: 'wolf',
  level: 4,
  xp: 308,
  health: 80,
  maxHealth: 100,
  attack: 42,
  defense: 28,
  speed: 15,
  energy: { current: 72, max: 100, lastUpdatedAt: Date.now() },
  stamina: { current: 18, max: 20, lastUpdatedAt: Date.now() - 60_000 },
  currencies: {
    silver: 100,
    gold: 0,
    food: 10,
    wood: 20,
    iron: 5,
    meat: 0,
    herbs: 0,
    ironPlate: 0,
    bronzePlate: 0,
    silverPlate: 0,
    goldPlate: 0,
    runes: 2,
    eventCurrency: 0,
  },
};

function renderHud() {
  return render(
    <SettingsProvider>
      <GameHud />
    </SettingsProvider>,
  );
}

describe('GameHud', () => {
  beforeEach(() => {
    usePlayer.mockReturnValue({ data: basePlayer });
  });

  it('renders identity, vitals, and resources', async () => {
    const { getByText, getByLabelText, getByTestId, queryByTestId, unmount } = await renderHud();

    expect(getByText('Erik')).toBeTruthy();
    expect(getByText('Lv 4')).toBeTruthy();
    expect(getByText('Health 80/100')).toBeTruthy();
    expect(getByText('Energy 72/100')).toBeTruthy();
    expect(getByText('Stamina 18/20')).toBeTruthy();
    expect(getByLabelText('silver 100')).toBeTruthy();
    expect(getByLabelText('runes 2')).toBeTruthy();
    expect(getByTestId('settings-button')).toBeTruthy();
    expect(getByTestId('hud-identity-header')).toBeTruthy();
    expect(queryByTestId('hud-combat-stats')).toBeNull();
    expect(queryByTestId('hud-chevron')).toBeNull();
    unmount();
  });

  it('shows regenerated energy after a tick has elapsed', async () => {
    usePlayer.mockReturnValue({
      data: {
        ...basePlayer,
        energy: { current: 10, max: 100, lastUpdatedAt: 0 },
        stamina: { current: 20, max: 20, lastUpdatedAt: Date.now() },
      },
    });
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(5 * 60 * 1000);
    const { getByText, unmount } = await renderHud();
    expect(getByText('Energy 11/100')).toBeTruthy();
    nowSpy.mockRestore();
    unmount();
  });
});
