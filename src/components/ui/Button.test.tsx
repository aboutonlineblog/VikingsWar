import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders a label and handles press', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Button label="Raid" onPress={onPress} />);
    fireEvent.press(getByText('Raid'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders a success variant', async () => {
    const { getByText } = await render(<Button label="Claim" variant="success" onPress={() => undefined} />);
    expect(getByText('Claim')).toBeTruthy();
  });

  it('shows a loading indicator instead of the label', async () => {
    const onPress = jest.fn();
    const { getByLabelText, queryByText } = await render(
      <Button label="Raid" loading onPress={onPress} />,
    );
    expect(getByLabelText('Loading')).toBeTruthy();
    expect(queryByText('Raid')).toBeNull();
    fireEvent.press(getByLabelText('Loading'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
