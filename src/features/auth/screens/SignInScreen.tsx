import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useAuth } from '@/features/auth';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { AuthStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const { showAlert } = useGameAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    try {
      setBusy(true);
      await signIn(email.trim(), password);
    } catch (error) {
      showAlert({
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen backgroundSource={images.bgAuthSignIn}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" accessibilityLabel="Vikings War" />
      <Title>Vikings War</Title>
      <Body muted>Swear the oath and return to your hall.</Body>
      <Field placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Field placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label={busy ? 'Entering…' : 'Enter the hall'} onPress={onSubmit} disabled={busy} loading={busy} />
      <Button label="Create account" variant="secondary" onPress={() => navigation.navigate('Register')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 140,
    marginBottom: spacing.md,
  },
});
