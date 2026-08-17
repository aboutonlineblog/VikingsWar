import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { InventoryItemTile } from './InventoryItemTile';
import { rarityStyle } from '@/theme/rarity';

describe('InventoryItemTile', () => {
  it('shows the item name below a rarity-colored frame and fills the frame with art', async () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText, getByTestId } = await render(
      <InventoryItemTile
        name="Iron Axe"
        itemId="iron_axe"
        slot="weapon"
        rarity="common"
        onPress={onPress}
      />,
    );

    expect(getByText('Iron Axe')).toBeTruthy();
    expect(getByLabelText('Iron Axe image')).toBeTruthy();
    expect(getByTestId('inventory-tile-frame-common').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: rarityStyle('common').border,
          backgroundColor: rarityStyle('common').fill,
        }),
      ]),
    );

    fireEvent.press(getByLabelText('Iron Axe'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks equipped items and uses mythic colors', async () => {
    const { getByTestId, getByLabelText } = await render(
      <InventoryItemTile
        name="Dragon Shield"
        itemId="dragon_shield"
        slot="shield"
        rarity="mythic"
        equipped
        onPress={jest.fn()}
      />,
    );

    expect(getByTestId('inventory-tile-equipped')).toBeTruthy();
    expect(getByLabelText('Dragon Shield').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(getByTestId('inventory-tile-frame-mythic').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: rarityStyle('mythic').border,
          backgroundColor: rarityStyle('mythic').fill,
        }),
      ]),
    );
  });
});
