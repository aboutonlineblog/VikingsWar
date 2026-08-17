import React from 'react';
import { render } from '@testing-library/react-native';
import { GameAlertProvider } from '@/components/ui/GameAlert';
import { ShopScreen } from './ShopScreen';

jest.mock('@/features/player', () => ({
  usePlayer: () => ({
    data: { currencies: { runes: 40 } },
  }),
}));

jest.mock('@/features/auth', () => ({
  useAuth: () => ({ user: { uid: 'jarl-1' } }),
}));

jest.mock('@/lib/iap/IapAdapter', () => ({
  getIapAdapter: () => ({ purchase: jest.fn() }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueryClient: () => ({ setQueryData: jest.fn() }),
}));

const { useQuery } = jest.requireMock('@tanstack/react-query') as { useQuery: jest.Mock };

describe('ShopScreen', () => {
  it('renders products in a three-column grid with large item art', async () => {
    useQuery.mockReturnValue({
      data: [
        {
          id: 'runes_small',
          name: 'Pouch of Runes',
          description: '80 Runes',
          productType: 'runes',
          powerAffecting: false,
        },
        {
          id: 'speedup_building',
          name: 'Builder’s Horn',
          description: 'Finish the current building upgrade.',
          productType: 'speedup',
          runeCost: 15,
          powerAffecting: false,
        },
        {
          id: 'avatar_wolfcloak',
          name: 'Wolfcloak',
          description: 'Cosmetic Viking outfit.',
          productType: 'cosmetic',
          runeCost: 40,
          powerAffecting: false,
        },
      ],
    });

    const { getByText, getByLabelText } = await render(
      <GameAlertProvider>
        <ShopScreen />
      </GameAlertProvider>,
    );

    expect(getByText('Pouch of Runes')).toBeTruthy();
    expect(getByText('Builder’s Horn')).toBeTruthy();
    expect(getByText('Wolfcloak')).toBeTruthy();
    expect(getByLabelText('Pouch of Runes image')).toBeTruthy();
  });
});
