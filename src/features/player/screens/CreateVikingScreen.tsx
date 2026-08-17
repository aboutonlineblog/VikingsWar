import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useCreateViking } from '@/features/player';
import { avatarArt, images } from '@/assets';
import { colors, spacing } from '@/theme/theme';

const AVATARS = ['wolf', 'raven', 'bear', 'serpent'];

export function CreateVikingScreen() {
  const create = useCreateViking();
  const { showAlert } = useGameAlert();
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState('wolf');

  async function onSubmit() {
    try {
      await create.mutateAsync({ name: name.trim(), avatarId });
    } catch (error) {
      showAlert({
        title: 'Could not create Viking',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return (
    <Screen backgroundSource={images.bgCreateViking}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Title>Name your Viking</Title>
      <Body muted>Your jarl’s name is known across the fjord.</Body>
      <Field placeholder="Viking name" value={name} onChangeText={setName} autoCapitalize="words" />
      <View style={styles.avatars}>
        {AVATARS.map((id) => (
          <Button
            key={id}
            label={id}
            variant={avatarId === id ? 'primary' : 'secondary'}
            onPress={() => setAvatarId(id)}
          />
        ))}
      </View>
      <Image source={avatarArt(avatarId)} style={styles.preview} />
      <Button
        label={create.isPending ? 'Carving runes…' : 'Take the oath'}
        onPress={onSubmit}
        disabled={create.isPending}
        loading={create.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 120,
    marginBottom: spacing.md,
  },
  avatars: {
    marginBottom: spacing.md,
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignSelf: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
  },
});
