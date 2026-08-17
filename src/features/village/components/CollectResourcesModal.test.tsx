import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { CollectResourcesModal } from './CollectResourcesModal';
import { colors } from '@/theme/theme';

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

describe('CollectResourcesModal', () => {
  it('shows a grid of pending currencies with icons and amounts', async () => {
    const { getByLabelText, getByText, queryByTestId } = await render(
      <CollectResourcesModal
        visible
        pending={{ food: 4, silver: 12, wood: 0 }}
        collecting={false}
        onClose={jest.fn()}
        onCollect={jest.fn()}
      />,
    );

    expect(getByLabelText('12 silver')).toBeTruthy();
    expect(getByLabelText('4 food')).toBeTruthy();
    expect(getByLabelText('silver icon')).toBeTruthy();
    expect(getByLabelText('food icon')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(queryByTestId('collect-resource-wood')).toBeNull();
  });

  it('closes without collecting when the gold X is pressed', async () => {
    const onClose = jest.fn();
    const onCollect = jest.fn();
    const { getByLabelText, getByText } = await render(
      <CollectResourcesModal
        visible
        pending={{ food: 8 }}
        collecting={false}
        onClose={onClose}
        onCollect={onCollect}
      />,
    );

    const closeMark = getByText('X');
    expect(StyleSheet.flatten(closeMark.props.style)).toEqual(
      expect.objectContaining({ color: colors.gold }),
    );
    fireEvent.press(getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCollect).not.toHaveBeenCalled();
  });

  it('closes without collecting when the scrim is pressed', async () => {
    const onClose = jest.fn();
    const onCollect = jest.fn();
    const { getByLabelText } = await render(
      <CollectResourcesModal
        visible
        pending={{ food: 8 }}
        collecting={false}
        onClose={onClose}
        onCollect={onCollect}
      />,
    );

    fireEvent.press(getByLabelText('Dismiss collect resources'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCollect).not.toHaveBeenCalled();
  });

  it('collects when Collect is pressed', async () => {
    const onCollect = jest.fn();
    const { getByText } = await render(
      <CollectResourcesModal
        visible
        pending={{ food: 8 }}
        collecting={false}
        onClose={jest.fn()}
        onCollect={onCollect}
      />,
    );

    fireEvent.press(getByText('Collect'));
    expect(onCollect).toHaveBeenCalledTimes(1);
  });

  it('does not collect while the claim is in flight', async () => {
    const onCollect = jest.fn();
    const { getByLabelText } = await render(
      <CollectResourcesModal
        visible
        pending={{ food: 8 }}
        collecting
        onClose={jest.fn()}
        onCollect={onCollect}
      />,
    );

    fireEvent.press(getByLabelText('Loading'));
    expect(onCollect).not.toHaveBeenCalled();
  });
});
