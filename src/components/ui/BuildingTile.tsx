import { Image, StyleSheet, Text, View } from 'react-native';
import type { BuildingDef, BuildingState } from '@shared/types';
import { buildingArt } from '@/assets';
import { Card } from './Card';
import { Button } from './Button';
import { Body } from './Typography';
import { Timer } from './Timer';
import { colors, spacing } from '@/theme/theme';
import { formatCountdown, upgradeCost } from '@/utils/progress';

interface BuildingTileProps {
  def: BuildingDef;
  state?: BuildingState;
  nowMs?: number;
  onUpgrade: () => void;
  onSpeedUp?: () => void;
  upgradeLoading?: boolean;
  speedUpLoading?: boolean;
}

export function BuildingTile({
  def,
  state,
  nowMs = Date.now(),
  onUpgrade,
  onSpeedUp,
  upgradeLoading,
  speedUpLoading,
}: BuildingTileProps) {
  const level = state?.level ?? 0;
  const busy = Boolean(state?.upgradeCompletesAt && state.upgradeCompletesAt > nowMs);
  const remaining = busy && state?.upgradeCompletesAt ? state.upgradeCompletesAt - nowMs : 0;
  const cost = upgradeCost(level);

  return (
    <Card style={styles.card}>
      <Image source={buildingArt(def.id)} style={styles.art} resizeMode="contain" />
      <Body>{def.name}</Body>
      <Text style={styles.level}>Lv {level}{busy ? ' · upgrading' : ''}</Text>
      <Body muted>{def.description}</Body>
      <Text style={styles.cost}>
        Wood {cost.wood} · Iron {cost.iron} · Silver {cost.silver}
      </Text>
      {busy ? <Timer value={formatCountdown(remaining)} label="Remaining" /> : null}
      <Button
        label="Upgrade"
        variant="secondary"
        onPress={onUpgrade}
        disabled={busy}
        loading={upgradeLoading}
      />
      {busy && onSpeedUp ? (
        <Button label="Speed up (15 Runes)" onPress={onSpeedUp} loading={speedUpLoading} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  art: {
    width: '100%',
    height: 88,
    marginBottom: spacing.sm,
  },
  level: {
    color: colors.gold,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  cost: {
    color: colors.textMuted,
    fontSize: 12,
    marginVertical: spacing.xs,
  },
});
