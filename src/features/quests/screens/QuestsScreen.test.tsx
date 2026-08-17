import React from 'react';
import { render } from '@testing-library/react-native';
import { GameAlertProvider } from '@/components/ui/GameAlert';
import { QuestsScreen } from './QuestsScreen';

jest.mock('@/features/player', () => ({
  usePlayer: () => ({
    data: { currentChapter: 1, energy: { current: 80, max: 100 } },
    isPending: false,
    isError: false,
  }),
}));

jest.mock('@/features/quests/hooks/useQuests', () => ({
  useQuests: jest.fn(),
  useCompleteQuest: () => ({ mutate: jest.fn(), isPending: false }),
}));

const { useQuests } = jest.requireMock('@/features/quests/hooks/useQuests') as {
  useQuests: jest.Mock;
};

describe('QuestsScreen', () => {
  it('shows a loading state', async () => {
    useQuests.mockReturnValue({ isPending: true, isError: false, data: undefined });
    const { getByText } = await render(
      <GameAlertProvider>
        <QuestsScreen />
      </GameAlertProvider>,
    );
    expect(getByText('Unrolling the saga…')).toBeTruthy();
  });

  it('shows an error state', async () => {
    useQuests.mockReturnValue({ isPending: false, isError: true, data: undefined });
    const { getByText } = await render(
      <GameAlertProvider>
        <QuestsScreen />
      </GameAlertProvider>,
    );
    expect(getByText(/Could not load quests/)).toBeTruthy();
  });

  it('renders quests when loaded', async () => {
    useQuests.mockReturnValue({
      isPending: false,
      isError: false,
      data: [
        {
          id: 'hunt_boar',
          name: 'Hunt the Boar',
          description: 'Track a wild boar',
          category: 'hunting',
          chapter: 1,
          energyCost: 5,
          requiredLevel: 1,
          rewards: { xp: 20, silver: 30 },
        },
      ],
    });
    const { getByText } = await render(
      <GameAlertProvider>
        <QuestsScreen />
      </GameAlertProvider>,
    );
    expect(getByText('Hunt the Boar')).toBeTruthy();
    expect(getByText('GO')).toBeTruthy();
  });
});
