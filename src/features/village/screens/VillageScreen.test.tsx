import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { utcDateString } from '@shared/dates';
import { VillageScreen } from './VillageScreen';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  function MockModal({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) {
    return visible ? children : null;
  }
  MockModal.displayName = 'Modal';
  return { __esModule: true, default: MockModal };
});

jest.mock('@/features/player', () => ({
  usePlayer: jest.fn(),
}));

jest.mock('@/features/village/hooks/useVillage', () => ({
  useBuildingsCatalog: jest.fn(),
  useClaimDailyLogin: jest.fn(),
  useCollectResources: jest.fn(),
  useSpeedUpBuilding: jest.fn(),
  useUpgradeBuilding: jest.fn(),
}));

jest.mock('@/features/quests/hooks/useQuests', () => ({
  useCompleteQuest: jest.fn(),
  useQuests: jest.fn(),
}));

jest.mock('@/components/ui/GameAlert', () => ({
  useGameAlert: () => ({ showAlert: jest.fn() }),
}));

const { usePlayer } = jest.requireMock('@/features/player') as { usePlayer: jest.Mock };
const {
  useBuildingsCatalog,
  useClaimDailyLogin,
  useCollectResources,
  useSpeedUpBuilding,
  useUpgradeBuilding,
} = jest.requireMock('@/features/village/hooks/useVillage') as {
  useBuildingsCatalog: jest.Mock;
  useClaimDailyLogin: jest.Mock;
  useCollectResources: jest.Mock;
  useSpeedUpBuilding: jest.Mock;
  useUpgradeBuilding: jest.Mock;
};
const { useCompleteQuest, useQuests } = jest.requireMock('@/features/quests/hooks/useQuests') as {
  useCompleteQuest: jest.Mock;
  useQuests: jest.Mock;
};

const farmDef = {
  id: 'farm',
  name: 'Farm',
  description: 'Produces Food.',
  maxLevel: 10,
  produces: { food: 10 },
  perLevelRate: 1,
};

const mockCollect = jest.fn();
const mockDaily = jest.fn();

function villagePlayer(overrides: Record<string, unknown> = {}) {
  return {
    vikingName: 'Ragnar',
    attack: 10,
    defense: 8,
    speed: 6,
    currentChapter: 1,
    buildings: {
      farm: { id: 'farm', level: 2, upgradeCompletesAt: null },
    },
    resourcesLastCollectedAt: Date.now(),
    dailyLogin: { lastClaimDate: '', streak: 0 },
    ...overrides,
  };
}

describe('VillageScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockCollect.mockClear();
    mockDaily.mockClear();
    usePlayer.mockReturnValue({
      data: villagePlayer(),
      isPending: false,
      isError: false,
    });
    useBuildingsCatalog.mockReturnValue({ data: [farmDef] });
    useCollectResources.mockReturnValue({
      mutate: mockCollect,
      isPending: false,
    });
    useClaimDailyLogin.mockReturnValue({
      mutate: mockDaily,
      isPending: false,
    });
    useUpgradeBuilding.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      variables: undefined,
    });
    useSpeedUpBuilding.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      variables: undefined,
    });
    useQuests.mockReturnValue({ data: [] });
    useCompleteQuest.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      variables: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('disables daily login after it has been claimed this UTC day', async () => {
    usePlayer.mockReturnValue({
      data: villagePlayer({
        dailyLogin: { lastClaimDate: utcDateString(Date.now()), streak: 1 },
      }),
      isPending: false,
      isError: false,
    });

    const { getByLabelText } = await render(<VillageScreen />);
    const claimed = getByLabelText('Claimed today');
    expect(claimed.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );

    fireEvent.press(claimed);
    expect(mockDaily).not.toHaveBeenCalled();
  });

  it('disables daily login while the claim is in flight', async () => {
    useClaimDailyLogin.mockReturnValue({
      mutate: mockDaily,
      isPending: true,
    });

    const { getByLabelText } = await render(<VillageScreen />);
    fireEvent.press(getByLabelText('Loading'));
    expect(mockDaily).not.toHaveBeenCalled();
  });

  it('lets the player claim daily login on a new UTC day', async () => {
    usePlayer.mockReturnValue({
      data: villagePlayer({
        dailyLogin: {
          lastClaimDate: utcDateString(Date.now() - 24 * 60 * 60 * 1000),
          streak: 1,
        },
      }),
      isPending: false,
      isError: false,
    });

    const { getByLabelText } = await render(<VillageScreen />);
    fireEvent.press(getByLabelText('Claim daily login'));
    expect(mockDaily).toHaveBeenCalledTimes(1);
  });

  it('disables Collect resources when nothing is pending', async () => {
    const { getByLabelText, queryByTestId } = await render(<VillageScreen />);
    const collectButton = getByLabelText('Collect resources');
    expect(collectButton.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
    expect(queryByTestId('collect-resources-badge')).toBeNull();

    fireEvent.press(collectButton);
    expect(mockCollect).not.toHaveBeenCalled();
  });

  it('shows a badge and opens the collect modal without claiming', async () => {
    usePlayer.mockReturnValue({
      data: villagePlayer({
        resourcesLastCollectedAt: Date.now() - 2 * 60 * 60 * 1000,
      }),
      isPending: false,
      isError: false,
    });

    const { getByLabelText, getByTestId, getByText, queryByText } = await render(
      <VillageScreen />,
    );
    expect(getByTestId('collect-resources-badge')).toBeTruthy();

    fireEvent.press(getByLabelText('Collect resources'));
    expect(mockCollect).not.toHaveBeenCalled();
    expect(getByLabelText('40 food')).toBeTruthy();
    expect(getByText('40')).toBeTruthy();

    fireEvent.press(getByLabelText('Close'));
    expect(queryByText('40')).toBeNull();
    expect(mockCollect).not.toHaveBeenCalled();
  });

  it('claims pending resources, closes the modal, and drops the badge', async () => {
    usePlayer.mockReturnValue({
      data: villagePlayer({
        resourcesLastCollectedAt: Date.now() - 2 * 60 * 60 * 1000,
      }),
      isPending: false,
      isError: false,
    });
    mockCollect.mockImplementation((_variables, options) => {
      options?.onSuccess?.({
        player: villagePlayer({ resourcesLastCollectedAt: Date.now() }),
        gained: { food: 40 },
      });
    });

    const view = await render(<VillageScreen />);
    fireEvent.press(view.getByLabelText('Collect resources'));
    fireEvent.press(view.getByText('Collect'));
    expect(mockCollect).toHaveBeenCalledTimes(1);
    expect(view.queryByLabelText('40 food')).toBeNull();

    usePlayer.mockReturnValue({
      data: villagePlayer({ resourcesLastCollectedAt: Date.now() }),
      isPending: false,
      isError: false,
    });
    view.rerender(<VillageScreen />);
    expect(view.queryByTestId('collect-resources-badge')).toBeNull();
    expect(view.getByLabelText('Collect resources').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
