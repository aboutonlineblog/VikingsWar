import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Field } from './Field';

describe('Field', () => {
  it('toggles password visibility from hidden to shown', async () => {
    const { getByLabelText, queryByLabelText } = await render(
      <Field placeholder="Password" value="secret" onChangeText={() => undefined} secureTextEntry />,
    );

    expect(getByLabelText('Show password')).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByLabelText('Show password'));
    });
    expect(getByLabelText('Hide password')).toBeTruthy();
    expect(queryByLabelText('Show password')).toBeNull();
  });

  it('does not show a password toggle for regular fields', async () => {
    const { queryByLabelText } = await render(
      <Field placeholder="Email" value="jarl@example.com" onChangeText={() => undefined} />,
    );
    expect(queryByLabelText('Show password')).toBeNull();
  });
});
