import { Image, StyleSheet, Text, View } from 'react-native';
import { prestigeRank, rankArt } from '@/assets';
import { colors, spacing } from '@/theme/theme';

interface RankBadgeProps {
  prestige: number;
}

export function RankBadge({ prestige }: RankBadgeProps) {
  const rank = prestigeRank(prestige);
  return (
    <View style={styles.wrap} accessibilityLabel={`${rank} rank, prestige ${prestige}`}>
      <Image source={rankArt(rank)} style={styles.art} />
      <Text style={styles.label}>{rank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  art: {
    width: 40,
    height: 48,
  },
  label: {
    color: colors.gold,
    fontSize: 10,
    textTransform: 'capitalize',
    marginTop: 2,
  },
});
