import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ItemSlot } from './ItemSlot';

describe('ItemSlot', () => {
  it('uses catalog item art when itemId is provided', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await render(
      <ItemSlot slot="weapon" itemId="iron_axe" label="Iron Axe" onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Iron Axe'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
