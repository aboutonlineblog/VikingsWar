import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button } from './Button';
import { GameAlertProvider, useGameAlert } from './GameAlert';

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

function Probe() {
  const { showAlert } = useGameAlert();
  return (
    <Button
      label="Open"
      onPress={() => showAlert({ title: 'Sign in failed', message: 'Wrong password' })}
    />
  );
}

describe('GameAlert', () => {
  it('shows the title and message, then dismisses', async () => {
    const { getByText, queryByText } = await render(
      <GameAlertProvider>
        <Probe />
      </GameAlertProvider>,
    );

    await act(async () => {
      fireEvent.press(getByText('Open'));
    });
    expect(getByText('Sign in failed')).toBeTruthy();
    expect(getByText('Wrong password')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Understood'));
    });
    expect(queryByText('Sign in failed')).toBeNull();
  });
});
