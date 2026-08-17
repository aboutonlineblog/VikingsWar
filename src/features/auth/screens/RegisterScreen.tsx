import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useAuth } from '@/features/auth';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { AuthStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const { showAlert } = useGameAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    try {
      setBusy(true);
      await register(email.trim(), password);
      track(AnalyticsEvents.signUp);
    } catch (error) {
      showAlert({
        title: 'Register failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen backgroundSource={images.bgAuthRegister}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Title>Raise your banner</Title>
      <Body muted>Create an account to command a settlement.</Body>
      <Field placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label={busy ? 'Forging…' : 'Create account'} onPress={onSubmit} disabled={busy} loading={busy} />
      <Button label="Back to sign in" variant="secondary" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 120,
    marginBottom: spacing.md,
  },
});
