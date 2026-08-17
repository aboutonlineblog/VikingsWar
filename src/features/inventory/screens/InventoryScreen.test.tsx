import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { InventoryScreen } from './InventoryScreen';

const mockMutate = jest.fn();

jest.mock('@/features/player', () => ({
  usePlayer: jest.fn(),
}));

jest.mock('@/features/inventory/hooks/useGear', () => ({
  useItemsCatalog: jest.fn(),
  useEquipItem: jest.fn(),
}));

const { usePlayer } = jest.requireMock('@/features/player') as { usePlayer: jest.Mock };
const { useItemsCatalog, useEquipItem } = jest.requireMock('@/features/inventory/hooks/useGear') as {
  useItemsCatalog: jest.Mock;
  useEquipItem: jest.Mock;
};

describe('InventoryScreen', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    useEquipItem.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      variables: undefined,
    });
    useItemsCatalog.mockReturnValue({
      data: [
        {
          id: 'iron_axe',
          name: 'Iron Axe',
          slot: 'weapon',
          rarity: 'common',
          attack: 18,
          defense: 0,
          health: 0,
          speed: 0,
        },
        {
          id: 'oak_spear',
          name: 'Oak Spear',
          slot: 'weapon',
          rarity: 'uncommon',
          attack: 22,
          defense: 2,
          health: 0,
          speed: 0,
        },
        {
          id: 'mjolnir_shard',
          name: "Thor's Hammer fragment",
          slot: 'amulet',
          rarity: 'epic',
          attack: 12,
          defense: 6,
          health: 10,
          speed: 0,
        },
      ],
    });
  });

  it('renders an empty state when the pack has no loot', async () => {
    usePlayer.mockReturnValue({ data: { inventory: [] } });
    const { getByText, getByLabelText } = await render(<InventoryScreen />);
    expect(getByLabelText('Inventory, 5 columns')).toBeTruthy();
    expect(getByText('Empty packs')).toBeTruthy();
  });

  it('renders a five-column grid and equips on press', async () => {
    usePlayer.mockReturnValue({
      data: {
        inventory: [
          { instanceId: 'i1', itemId: 'iron_axe', equippedSlot: 'weapon' },
          { instanceId: 'i2', itemId: 'oak_spear', equippedSlot: null },
          { instanceId: 'i3', itemId: 'mjolnir_shard', equippedSlot: null },
        ],
      },
    });

    const { getByText, getByTestId, getByLabelText } = await render(<InventoryScreen />);

    expect(getByLabelText('Inventory, 5 columns')).toBeTruthy();
    expect(getByText('Iron Axe')).toBeTruthy();
    expect(getByText('Oak Spear')).toBeTruthy();
    expect(getByText("Thor's Hammer fragment")).toBeTruthy();
    expect(getByTestId('inventory-tile-frame-common')).toBeTruthy();
    expect(getByTestId('inventory-tile-frame-uncommon')).toBeTruthy();
    expect(getByTestId('inventory-tile-frame-epic')).toBeTruthy();

    fireEvent.press(getByLabelText('Oak Spear'));
    expect(mockMutate).toHaveBeenCalledWith('i2');
  });
});
