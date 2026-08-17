import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Title, Body } from '@/components/ui/Typography';
import { StatBar } from '@/components/ui/StatBar';
import { useGameAlert } from '@/components/ui/GameAlert';
import { usePlayer } from '@/features/player';
import { useAuth } from '@/features/auth';
import { useBusyAction } from '@/hooks/useBusyAction';
import {
  postClanChat,
  useClan,
  useClanChat,
  useClanRaid,
  useClans,
  useCreateClan,
  useDonateTreasury,
  useJoinClan,
  useLeaveClan,
} from '@/features/clans/hooks/useClans';
import { useAttackClanRaid } from '@/features/combat/hooks/useCombat';
import { useQueryClient } from '@tanstack/react-query';
import { clanKeys } from '@/lib/query/keys';
import { clanBannerArt } from '@/assets';
import { colors, spacing } from '@/theme/theme';

export function ClanScreen() {
  const { user } = useAuth();
  const { showAlert } = useGameAlert();
  const { run, isBusy } = useBusyAction();
  const player = usePlayer();
  const clans = useClans();
  const clan = useClan(player.data?.clanId ?? null);
  const chat = useClanChat(player.data?.clanId ?? null);
  const raid = useClanRaid(player.data?.clanId ?? null);
  const create = useCreateClan();
  const join = useJoinClan();
  const leave = useLeaveClan();
  const donate = useDonateTreasury();
  const raidStrike = useAttackClanRaid();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const clanId = player.data?.clanId;

  async function sendChat() {
    if (!clanId || !user || !player.data) {
      return;
    }
    const text = message.trim();
    if (!text) {
      return;
    }
    try {
      await postClanChat(clanId, {
        id: Date.now().toString(),
        uid: user.uid,
        vikingName: player.data.vikingName,
        text,
        createdAt: Date.now(),
      });
      setMessage('');
      queryClient.invalidateQueries({ queryKey: clanKeys.chat(clanId) });
    } catch (error) {
      showAlert({ title: 'Chat failed', message: String(error) });
    }
  }

  if (!clanId) {
    return (
      <Screen edges={['left', 'right']}>
        <Title>Clans</Title>
        <Field placeholder="Clan name" value={name} onChangeText={setName} autoCapitalize="words" />
        <Button
          label="Found a clan"
          onPress={() => create.mutate(name.trim())}
          loading={create.isPending}
        />
        {(clans.data ?? []).map((entry) => (
          <Card key={entry.id}>
            <View style={styles.row}>
              <Image source={clanBannerArt(entry.bannerId || entry.id)} style={styles.banner} />
              <Body>
                {entry.name} · {entry.memberUids.length} members
              </Body>
            </View>
            <Button
              label="Join"
              variant="secondary"
              loading={join.isPending && join.variables === entry.id}
              onPress={() => join.mutate(entry.id)}
            />
          </Card>
        ))}
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right']}>
      <View style={styles.row}>
        <Image source={clanBannerArt(clan.data?.bannerId || clanId)} style={styles.bannerLarge} />
        <View style={styles.grow}>
          <Title>{clan.data?.name ?? 'Clan'}</Title>
          <Body muted>
            Lv {clan.data?.level ?? 1} · {clan.data?.memberUids.length ?? 0} members
          </Body>
        </View>
      </View>
      <Body muted>Treasury {clan.data?.treasury.silver ?? 0} silver</Body>
      {raid.data ? (
        <Card>
          <Body>Clan raid {raid.data.bossId}</Body>
          <StatBar
            label="Raid HP"
            current={raid.data.hp}
            max={raid.data.maxHp}
            color={colors.danger}
          />
          <Button
            label="Strike the raid boss"
            loading={raidStrike.isPending && raidStrike.variables === raid.data?.bossId}
            onPress={() =>
              raidStrike.mutate(raid.data?.bossId, {
                onError: (error) => showAlert({ title: 'Raid failed', message: String(error) }),
              })
            }
          />
        </Card>
      ) : (
        <Button
          label="Open clan raid"
          variant="secondary"
          loading={raidStrike.isPending && raidStrike.variables === undefined}
          onPress={() =>
            raidStrike.mutate(undefined, {
              onError: (error) => showAlert({ title: 'Raid failed', message: String(error) }),
            })
          }
        />
      )}
      <Button
        label="Donate 50 silver"
        variant="secondary"
        onPress={() => donate.mutate(50)}
        loading={donate.isPending}
      />
      <Field placeholder="Clan chat" value={message} onChangeText={setMessage} />
      <Button
        label="Send"
        onPress={() => {
          void run('chat', sendChat);
        }}
        loading={isBusy('chat')}
      />
      {(chat.data ?? []).map((entry) => (
        <Body key={`${entry.uid}-${entry.createdAt}`} muted>
          {entry.vikingName}: {entry.text}
        </Body>
      ))}
      <Button
        label="Leave clan"
        variant="danger"
        onPress={() => leave.mutate()}
        loading={leave.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  grow: {
    flex: 1,
  },
  banner: {
    width: 28,
    height: 48,
  },
  bannerLarge: {
    width: 40,
    height: 72,
  },
});
