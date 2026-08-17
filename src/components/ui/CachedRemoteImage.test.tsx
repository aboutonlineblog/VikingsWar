import React from 'react';
import { render } from '@testing-library/react-native';
import { CachedRemoteImage } from './CachedRemoteImage';
import { images } from '@/assets';

describe('CachedRemoteImage', () => {
  it('renders remote uri when provided', () => {
    const { getByTestId } = render(
      <CachedRemoteImage uri="https://example.com/creature.webp" testID="portrait" />,
    );
    expect(getByTestId('portrait').props.source).toEqual({
      uri: 'https://example.com/creature.webp',
    });
  });

  it('uses fallback when uri is missing', () => {
    const { getByTestId } = render(<CachedRemoteImage testID="portrait" />);
    expect(getByTestId('portrait').props.source).toBe(images.warriorBerserker);
  });
});
