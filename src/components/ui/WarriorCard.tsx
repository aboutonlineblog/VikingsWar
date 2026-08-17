import { Image, StyleSheet, Text } from 'react-native';
import type { Warrior, WarriorDef } from '@shared/types';
import { warriorArt } from '@/assets';
import { Card } from './Card';
import { Button } from './Button';
import { Body } from './Typography';
import { colors, spacing } from '@/theme/theme';

interface WarriorCardProps {
  name: string;
  warriorClass: Warrior['class'];
  level: number;
  rarity: Warrior['rarity'] | WarriorDef['rarity'];
  attack: number;
  defense: number;
  actionLabel: string;
  onAction: () => void;
  loading?: boolean;
}

export function WarriorCard({
  name,
  warriorClass,
  level,
  rarity,
  attack,
  defense,
  actionLabel,
  onAction,
  loading,
}: WarriorCardProps) {
  return (
    <Card style={styles.card}>
      <Image source={warriorArt(warriorClass)} style={styles.art} resizeMode="cover" />
      <Body>{name}</Body>
      <Text style={styles.meta}>
        {'★'.repeat(rarityStars(rarity))} · Lv {level}
      </Text>
      <Body muted>
        {warriorClass} · {rarity}
      </Body>
      <Body muted>
        ATK {attack} · DEF {defense}
      </Body>
      <Button label={actionLabel} variant="secondary" onPress={onAction} loading={loading} />
    </Card>
  );
}

function rarityStars(rarity: Warrior['rarity']): number {
  switch (rarity) {
    case 'celestial':
      return 6;
    case 'mythic':
      return 5;
    case 'legendary':
      return 4;
    case 'epic':
    case 'rare':
      return 3;
    case 'uncommon':
      return 2;
    default:
      return 1;
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  art: {
    width: '100%',
    height: 140,
    marginBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  meta: {
    color: colors.gold,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
});
