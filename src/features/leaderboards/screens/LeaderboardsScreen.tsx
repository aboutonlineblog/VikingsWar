import { Image, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { RankBadge } from '@/components/ui/RankBadge';
import { useQuery } from '@tanstack/react-query';
import { FIRESTORE_COLLECTIONS } from '@shared/ids';
import { socialKeys } from '@/lib/query/keys';
import { getCollectionData } from '@/lib/firebase/firestore';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { Player, Clan } from '@shared/types';

export function LeaderboardsScreen() {
  const players = useQuery({
    queryKey: socialKeys.leaderboards,
    queryFn: async () => {
      const list = await getCollectionData<Player>(FIRESTORE_COLLECTIONS.players);
      return list.sort((a, b) => b.level - a.level || b.pvp.prestige - a.pvp.prestige);
    },
  });
  const clans = useQuery({
    queryKey: ['leaderboards', 'clans'],
    queryFn: async () => {
      const list = await getCollectionData<Clan>(FIRESTORE_COLLECTIONS.clans);
      return list.sort((a, b) => b.xp - a.xp);
    },
  });

  return (
    <Screen>
      <Title>Leaderboards</Title>
      <View style={styles.header}>
        <Image source={images.iconCrown} style={styles.icon} />
        <Body>Jarls</Body>
      </View>
      {(players.data ?? []).map((entry, index) => (
        <Card key={entry.uid}>
          <View style={styles.row}>
            <RankBadge prestige={entry.pvp.prestige} />
            <Body>
              {index + 1}. {entry.vikingName} · Lv {entry.level}
            </Body>
          </View>
        </Card>
      ))}
      <View style={styles.header}>
        <Image source={images.iconTrophy} style={styles.icon} />
        <Body>Clans</Body>
      </View>
      {(clans.data ?? []).map((entry, index) => (
        <Card key={entry.id}>
          <Body>
            {index + 1}. {entry.name} · XP {entry.xp}
          </Body>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
