import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '@/features/player';
import { SettingsButton } from '@/features/settings';
import { avatarArt } from '@/assets';
import { HudCollapseTab } from './HudCollapseTab';
import { HudIdentityHeader } from './HudIdentityHeader';
import { HudPanel } from './HudPanel';
import { HudResourceRow } from './HudResourceRow';
import { HudStatRow } from './HudStatRow';
import { colors, spacing } from '@/theme/theme';
import {
  ENERGY_INTERVAL_MS,
  STAMINA_INTERVAL_MS,
  formatCountdown,
  msUntilNextTick,
  previewRegenPool,
  xpToNextLevel,
} from '@/utils/progress';

export function GameHud() {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(Date.now());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = player.data;
  if (!data) {
    return null;
  }

  const energy = previewRegenPool(data.energy, now, ENERGY_INTERVAL_MS);
  const stamina = previewRegenPool(data.stamina, now, STAMINA_INTERVAL_MS);
  const staminaTimer =
    stamina.current >= stamina.max
      ? undefined
      : formatCountdown(msUntilNextTick(stamina, STAMINA_INTERVAL_MS, now));
  const xpMax = xpToNextLevel(data.level);

  return (
    <View style={[styles.outer, { paddingTop: insets.top + spacing.sm }]}>
      <HudPanel style={!expanded ? styles.panelCollapsed : undefined}>
        <HudIdentityHeader
          portrait={avatarArt(data.avatarId)}
          name={data.vikingName}
          level={data.level}
          xp={data.xp}
          xpMax={xpMax}
          settingsSlot={<SettingsButton variant="hud" />}
        />

        {expanded ? (
          <>
            <HudStatRow
              label="Health"
              current={data.health}
              max={data.maxHealth}
              color={colors.hudHealth}
            />
            <HudStatRow
              label="Energy"
              current={energy.current}
              max={energy.max}
              color={colors.hudEnergyFill}
            />
            <HudStatRow
              label="Stamina"
              current={stamina.current}
              max={stamina.max}
              color={colors.stamina}
              timer={staminaTimer}
            />

            <HudResourceRow currencies={data.currencies} />
          </>
        ) : null}
      </HudPanel>
      <HudCollapseTab
        expanded={expanded}
        onPress={() => setExpanded(value => !value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  panelCollapsed: {
    paddingBottom: spacing.lg,
  },
});
