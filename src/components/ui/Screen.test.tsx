import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Screen } from './Screen';
import { images } from '@/assets';

describe('Screen', () => {
  it('renders children when a background image is provided', async () => {
    const { getByText } = await render(
      <Screen backgroundSource={images.bgAuthSignIn}>
        <Text>Enter the hall</Text>
      </Screen>,
    );
    expect(getByText('Enter the hall')).toBeTruthy();
  });
});
