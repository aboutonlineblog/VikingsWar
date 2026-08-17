import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { fetchTerritories } from '@/features/quests/api/catalogApi';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { useAuth } from '@/features/auth';
import { usePlayer } from '@/features/player';
import { useBusyAction } from '@/hooks/useBusyAction';
import { images } from '@/assets';
import { colors, radius, spacing } from '@/theme/theme';
import type { Player, TerritoryId } from '@shared/types';

const MARKERS: Record<TerritoryId, { top: `${number}%`; left: `${number}%` }> = {
  village: { top: '68%', left: '18%' },
  coastalLands: { top: '78%', left: '62%' },
  northernForest: { top: '42%', left: '48%' },
  frozenMountains: { top: '14%', left: '22%' },
  enemyKingdom: { top: '36%', left: '70%' },
  legendaryLands: { top: '18%', left: '78%' },
};

export function WorldMapScreen() {
  const territories = useQuery({ queryKey: catalogKeys.doc('territories'), queryFn: fetchTerritories });
  const player = usePlayer();
  const { user } = useAuth();
  const { showAlert } = useGameAlert();
  const { run, isBusy } = useBusyAction();
  const queryClient = useQueryClient();

  function explore(territoryId: TerritoryId, status: string): void {
    if (status === 'conquered') {
      return;
    }
    const key = `explore:${territoryId}`;
    void run(key, async () => {
      try {
        const result = await callGameFunction<{ player: Player }>('exploreTerritory', { territoryId });
        if (user?.uid) {
          queryClient.setQueryData(playerKeys.me(user.uid), result.player);
        }
      } catch (error) {
        showAlert({ title: 'Territory locked', message: String(error) });
      }
    });
  }

  return (
    <Screen edges={['left', 'right']}>
      <Title>World Map</Title>
      <View style={styles.map}>
        <Image source={images.worldMap} style={styles.mapImage} />
        {(territories.data ?? []).map((territory) => {
          const status = player.data?.territories[territory.id] ?? 'locked';
          const marker = MARKERS[territory.id];
          const loading = isBusy(`explore:${territory.id}`);
          return (
            <Pressable
              key={territory.id}
              accessibilityRole="button"
              accessibilityLabel={`${territory.name} ${status}`}
              accessibilityState={{ busy: loading, disabled: loading }}
              disabled={loading}
              onPress={() => explore(territory.id, status)}
              style={[styles.marker, { top: marker.top, left: marker.left }]}
            >
              {loading ? (
                <ActivityIndicator color={colors.gold} size="small" />
              ) : (
                <>
                  <Text style={styles.markerLabel}>{territory.name}</Text>
                  <Text style={styles.markerStatus}>{status}</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
      {(territories.data ?? []).map((territory) => {
        const status = player.data?.territories[territory.id] ?? 'locked';
        return (
          <Card key={territory.id}>
            <View style={styles.row}>
              <View style={styles.grow}>
                <Body>{territory.name}</Body>
                <Body muted>
                  Requires Lv {territory.requiredLevel}, chapter {territory.requiredChapter}
                </Body>
              </View>
              <Badge
                label={status}
                tone={status === 'conquered' ? 'success' : status === 'explored' ? 'gold' : 'muted'}
              />
            </View>
            <Button
              label={status === 'conquered' ? 'Ruled' : 'Explore / conquer'}
              disabled={status === 'conquered'}
              loading={isBusy(`explore:${territory.id}`)}
              onPress={() => explore(territory.id, status)}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 240,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  mapImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  marker: {
    position: 'absolute',
    backgroundColor: 'rgba(18,16,14,0.82)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gold,
    maxWidth: 110,
    minWidth: 36,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  markerStatus: {
    color: colors.gold,
    fontSize: 9,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  grow: {
    flex: 1,
  },
});
