import React from 'react';
import { render } from '@testing-library/react-native';
import { CombatResultScreen } from './CombatResultScreen';

const navigation = { goBack: jest.fn() } as never;

describe('CombatResultScreen', () => {
  it('shows victory damage and loot', async () => {
    const { getByText } = await render(
      <CombatResultScreen
        navigation={navigation}
        route={{
          key: 'result',
          name: 'CombatResult',
          params: {
            title: 'Wild Boar',
            combat: {
              attackerDamage: 42,
              defenderDamage: 8,
              critical: true,
              attackerWon: true,
              attackerHpRemaining: 90,
              defenderHpRemaining: 0,
            },
            rewards: { xp: 20, silver: 30 },
            lootName: 'Seax',
          },
        }}
      />,
    );
    expect(getByText('Victory')).toBeTruthy();
    expect(getByText(/Loot: Seax/)).toBeTruthy();
  });
});
