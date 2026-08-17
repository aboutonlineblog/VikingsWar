import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Title, Body } from '@/components/ui/Typography';
import { ItemSlot, ItemSlotGrid } from '@/components/ui/ItemSlot';
import { RankBadge } from '@/components/ui/RankBadge';
import { useAuth } from '@/features/auth';
import { usePlayer } from '@/features/player';
import { useBusyAction } from '@/hooks/useBusyAction';
import { useQuery } from '@tanstack/react-query';
import { catalogKeys } from '@/lib/query/keys';
import { fetchAchievements } from '@/features/quests/api/catalogApi';
import { APP_ENV, APP_VERSION, BUILD_NUMBER } from '@/lib/env';
import { images } from '@/assets';
import { colors, spacing } from '@/theme/theme';
import { EQUIP_SLOTS } from '@shared/types';
import type { RootStackParamList } from '@/app/navigation/types';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signOut } = useAuth();
  const { run, isBusy } = useBusyAction();
  const player = usePlayer();
  const achievements = useQuery({ queryKey: catalogKeys.doc('achievements'), queryFn: fetchAchievements });
  const data = player.data;

  if (!data) {
    return (
      <Screen edges={['left', 'right']}>
        <Body>Loading profile…</Body>
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right']}>
      <View style={styles.hero}>
        <Image source={images.characterFront} style={styles.character} resizeMode="contain" />
        <View style={styles.identity}>
          <Title>{data.vikingName}</Title>
          <Body muted>
            Lv {data.level} · Avatar {data.avatarId}
          </Body>
          <RankBadge prestige={data.pvp.prestige} />
          <Body>
            ATK {data.attack} · DEF {data.defense} · SPD {data.speed} · HP {data.maxHealth}
          </Body>
        </View>
      </View>
      <Body>Equipment</Body>
      <ItemSlotGrid>
        {EQUIP_SLOTS.map((slot) => (
          <ItemSlot
            key={slot}
            slot={slot}
            label={data.equipment[slot] ? 'equipped' : slot}
            selected={Boolean(data.equipment[slot])}
            onPress={() => navigation.navigate('Inventory')}
          />
        ))}
      </ItemSlotGrid>
      <Button label="Inventory" onPress={() => navigation.navigate('Inventory')} />
      <Button label="Warband" variant="secondary" onPress={() => navigation.navigate('Warband')} />
      <Button label="Collections" variant="secondary" onPress={() => navigation.navigate('Collections')} />
      <Button label="Friends" variant="secondary" onPress={() => navigation.navigate('Friends')} />
      <Button label="Leaderboards" variant="secondary" onPress={() => navigation.navigate('Leaderboards')} />
      <Body>Achievements</Body>
      {(achievements.data ?? []).map((entry) => (
        <Body key={entry.id} muted>
          {data.achievements[entry.id] ? '✓' : '○'} {entry.name} — {entry.description}
        </Body>
      ))}
      <Body muted>
        {APP_ENV} · v{APP_VERSION} ({BUILD_NUMBER})
      </Body>
      <Button
        label="Sign out"
        variant="danger"
        onPress={() => {
          void run('signOut', () => signOut());
        }}
        loading={isBusy('signOut')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  character: {
    width: 110,
    height: 160,
    backgroundColor: colors.bgElevated,
  },
  identity: {
    flex: 1,
  },
});
