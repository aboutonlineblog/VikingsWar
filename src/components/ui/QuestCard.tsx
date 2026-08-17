import { Image, StyleSheet, Text, View } from 'react-native';
import type { QuestDef } from '@shared/types';
import { images } from '@/assets';
import { Card } from './Card';
import { Button } from './Button';
import { Body } from './Typography';
import { colors, spacing } from '@/theme/theme';

interface QuestCardProps {
  quest: QuestDef;
  onGo: () => void;
  disabled?: boolean;
  loading?: boolean;
  progressLabel?: string;
}

export function QuestCard({ quest, onGo, disabled, loading, progressLabel }: QuestCardProps) {
  const rewards = [
    `XP ${quest.rewards?.xp ?? 0}`,
    `Silver ${quest.rewards?.silver ?? 0}`,
    quest.rewards?.wood ? `Wood ${quest.rewards.wood}` : null,
    quest.rewards?.food ? `Food ${quest.rewards.food}` : null,
    quest.rewards?.iron ? `Iron ${quest.rewards.iron}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card>
      <View style={styles.row}>
        <Image source={images.iconAlert} style={styles.icon} />
        <View style={styles.body}>
          <Body>{quest.name}</Body>
          <Body muted>
            {quest.category} · Ch {quest.chapter} · Lv {quest.requiredLevel} · {quest.energyCost} energy
          </Body>
          <Text style={styles.rewards}>{rewards}</Text>
          {progressLabel ? <Text style={styles.progress}>{progressLabel}</Text> : null}
        </View>
        <View style={styles.action}>
          <Button label="GO" onPress={onGo} disabled={disabled} loading={loading} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  body: {
    flex: 1,
  },
  rewards: {
    color: colors.gold,
    fontSize: 12,
    marginTop: 4,
  },
  progress: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  action: {
    width: 84,
  },
});
