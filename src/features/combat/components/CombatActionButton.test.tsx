import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { images } from '@/assets';
import { CombatActionButton } from './CombatActionButton';

describe('CombatActionButton', () => {
  it('calls onPress when enabled', async () => {
    const onPress = jest.fn();
    const { getByTestId, unmount } = await render(
      <CombatActionButton
        action="attack"
        label="Attack"
        source={images.combatAttack}
        onPress={onPress}
      />,
    );
    fireEvent.press(getByTestId('combat-action-attack'));
    expect(onPress).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByTestId, unmount } = await render(
      <CombatActionButton
        action="defend"
        label="Defend"
        source={images.combatDefend}
        disabled
        onPress={onPress}
      />,
    );
    fireEvent.press(getByTestId('combat-action-defend'));
    expect(onPress).not.toHaveBeenCalled();
    unmount();
  });

  it('exposes the action label for accessibility', async () => {
    const { getByLabelText, unmount } = await render(
      <CombatActionButton
        action="potion"
        label="Potion"
        source={images.combatPotion}
        onPress={() => undefined}
      />,
    );
    expect(getByLabelText('Potion')).toBeTruthy();
    unmount();
  });
});
