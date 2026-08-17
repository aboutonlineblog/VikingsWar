import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Title, Body } from '@/components/ui/Typography';
import { EmptyState } from '@/components/ui/EmptyState';
import { useGameAlert } from '@/components/ui/GameAlert';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { usePlayer } from '@/features/player';
import { useQueryClient } from '@tanstack/react-query';
import { playerKeys } from '@/lib/query/keys';
import { useAuth } from '@/features/auth';
import { useBusyAction } from '@/hooks/useBusyAction';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { Player } from '@shared/types';
import type { RootStackParamList } from '@/app/navigation/types';

export function FriendsScreen() {
  const player = usePlayer();
  const { user } = useAuth();
  const { showAlert } = useGameAlert();
  const { run, isBusy } = useBusyAction();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [targetUid, setTargetUid] = useState('');

  function applyPlayer(next: Player): void {
    if (user?.uid) {
      queryClient.setQueryData(playerKeys.me(user.uid), next);
    }
  }

  return (
    <Screen>
      <Title>Friends</Title>
      <Image source={images.iconFriends} style={styles.icon} />
      <Field placeholder="Friend uid" value={targetUid} onChangeText={setTargetUid} />
      <Button
        label="Send friend request"
        loading={isBusy('request')}
        onPress={() => {
          void run('request', () =>
            callGameFunction('sendFriendRequest', { targetUid: targetUid.trim() }).catch((error) => {
              showAlert({ title: 'Request failed', message: String(error) });
            }),
          );
        }}
      />
      <Body>Requests</Body>
      {(player.data?.friendRequests ?? []).map((uid) => (
        <Card key={uid}>
          <Body>{uid}</Body>
          <Button
            label="Accept"
            loading={isBusy(`accept:${uid}`)}
            onPress={() => {
              void run(`accept:${uid}`, async () => {
                const result = await callGameFunction<{ player: Player }>('acceptFriend', {
                  fromUid: uid,
                });
                applyPlayer(result.player);
              });
            }}
          />
        </Card>
      ))}
      <Body>Friends</Body>
      {(player.data?.friends ?? []).map((uid) => (
        <Card key={uid}>
          <Body>{uid}</Body>
          <Button
            label="Visit village"
            variant="secondary"
            onPress={() => navigation.navigate('VisitVillage', { uid })}
          />
          <Button
            label="Send food gift"
            variant="secondary"
            loading={isBusy(`gift:${uid}`)}
            onPress={() => {
              void run(`gift:${uid}`, async () => {
                const result = await callGameFunction<{ player: Player }>('sendGift', {
                  targetUid: uid,
                });
                applyPlayer(result.player);
              });
            }}
          />
          {player.data?.clanId ? (
            <Button
              label="Help clan member"
              variant="secondary"
              loading={isBusy(`help:${uid}`)}
              onPress={() => {
                void run(`help:${uid}`, async () => {
                  try {
                    const result = await callGameFunction<{ player: Player }>('helpClanMember', {
                      targetUid: uid,
                    });
                    applyPlayer(result.player);
                  } catch (error) {
                    showAlert({ title: 'Help failed', message: String(error) });
                  }
                });
              }}
            />
          ) : null}
        </Card>
      ))}
      {player.data?.friends.length === 0 ? (
        <EmptyState title="No friends yet" message="Ask another player for their uid, then send a request." />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    marginBottom: spacing.md,
  },
});
