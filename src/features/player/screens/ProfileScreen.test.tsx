import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { emptyEquipment } from '@shared/types';
import { ProfileScreen } from './ProfileScreen';

const mockNavigate = jest.fn();

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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@/features/auth', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));

jest.mock('@/features/player', () => ({
  usePlayer: jest.fn(),
}));

jest.mock('@/features/inventory', () => {
  const actual = jest.requireActual('@/features/inventory') as typeof import('@/features/inventory');
  return {
    ...actual,
    useItemsCatalog: jest.fn(),
  };
});

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [] }),
}));

const { usePlayer } = jest.requireMock('@/features/player') as { usePlayer: jest.Mock };
const { useItemsCatalog } = jest.requireMock('@/features/inventory') as { useItemsCatalog: jest.Mock };

describe('ProfileScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useItemsCatalog.mockReturnValue({
      data: [
        {
          id: 'iron_axe',
          name: 'Iron Axe',
          slot: 'weapon',
          rarity: 'common',
          weaponType: 'axe',
          attack: 18,
          defense: 0,
          health: 0,
          speed: 0,
          description: 'A sturdy felling axe.',
        },
      ],
    });
    usePlayer.mockReturnValue({
      data: {
        vikingName: 'Erik',
        avatarId: 'wolf',
        level: 4,
        attack: 42,
        defense: 28,
        speed: 15,
        maxHealth: 100,
        pvp: { prestige: 0 },
        equipment: { ...emptyEquipment(), weapon: 'i1' },
        inventory: [{ instanceId: 'i1', itemId: 'iron_axe', equippedSlot: 'weapon' }],
        achievements: {},
      },
    });
  });

  it('opens the equipment inspect modal when an equipped slot is pressed', async () => {
    const { getByLabelText, getByText, getByTestId } = await render(<ProfileScreen />);

    fireEvent.press(getByLabelText('Iron Axe'));

    expect(getByTestId('equipment-detail-modal')).toBeTruthy();
    expect(getByText('Weapon · Axe · Common')).toBeTruthy();
    expect(getByText('A sturdy felling axe.')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to Inventory when an empty slot is pressed', async () => {
    const { getByLabelText, queryByTestId } = await render(<ProfileScreen />);

    fireEvent.press(getByLabelText('helmet'));

    expect(queryByTestId('equipment-detail-modal')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('Inventory');
  });
});
