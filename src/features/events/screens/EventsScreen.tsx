import { Image, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { fetchEvents } from '@/features/quests/api/catalogApi';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { useAuth } from '@/features/auth';
import { usePlayer } from '@/features/player';
import { useBusyAction } from '@/hooks/useBusyAction';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { Player } from '@shared/types';

export function EventsScreen() {
  const events = useQuery({ queryKey: catalogKeys.doc('events'), queryFn: fetchEvents });
  const player = usePlayer();
  const { user } = useAuth();
  const { showAlert } = useGameAlert();
  const { run, isBusy } = useBusyAction();
  const queryClient = useQueryClient();
  const now = Date.now();

  return (
    <Screen>
      <Title>Events</Title>
      <Body muted>Event currency: {player.data?.currencies.eventCurrency ?? 0}</Body>
      {(events.data ?? []).map((event) => {
        const active = event.startsAt <= now && event.endsAt >= now;
        const key = `event:${event.id}`;
        return (
          <Card key={event.id}>
            <Image source={images.iconCalendar} style={styles.icon} />
            <Badge label={active ? 'LIVE' : 'Ended'} tone={active ? 'success' : 'muted'} />
            <Body>{event.name}</Body>
            <Body muted>{event.description}</Body>
            <Button
              label="Fight for the event"
              disabled={!active}
              loading={isBusy(key)}
              onPress={() => {
                void run(key, async () => {
                  try {
                    const result = await callGameFunction<{ player: Player }>('contributeEvent');
                    if (user?.uid) {
                      queryClient.setQueryData(playerKeys.me(user.uid), result.player);
                    }
                  } catch (error) {
                    showAlert({ title: 'Event', message: String(error) });
                  }
                });
              }}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    marginBottom: spacing.sm,
  },
});
