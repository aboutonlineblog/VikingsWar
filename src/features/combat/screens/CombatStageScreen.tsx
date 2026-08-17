import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Body, Title } from '@/components/ui/Typography';
import { images } from '@/assets';
import { colors, radius, spacing } from '@/theme/theme';
import { usePlayer } from '@/features/player';
import { useSubmitCombatAction } from '@/features/combat/hooks/useCombat';
import { CombatFxLayer } from '@/features/combat/components/CombatFxLayer';
import { BloodOverlay } from '@/features/combat/components/BloodOverlay';
import { CombatFighterPanel } from '@/features/combat/components/CombatFighterPanel';
import { CombatActionButton } from '@/features/combat/components/CombatActionButton';
import {
  applyBattleEvent,
  battleIsFinished,
  canUseCombatAction,
  createBattleView,
  eventDurationMs,
  playerActionsEnabled,
} from '@/features/combat/playback';
import { shouldPresentCombatStage } from '@/features/combat/presentCombat';
import { audioService, sfxForEvent, useBattleMusic } from '@/lib/audio';
import { useCreaturePortrait } from '@/hooks/useCreaturePortrait';
import type { CombatAction } from '@shared/types';
import type { RootStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CombatStage'>;

const ACTIONS = [
  { key: 'attack', label: 'Attack', source: images.combatAttack },
  { key: 'special', label: 'Special', source: images.combatSpecial },
  { key: 'defend', label: 'Defend', source: images.combatDefend },
  { key: 'potion', label: 'Potion', source: images.combatPotion },
] as const;

export function CombatStageScreen({ route, navigation }: Props) {
  const { title, opponentName, enemy, rewards, lootName } = route.params;
  const enemyPortraitUri = useCreaturePortrait(enemy);
  const player = usePlayer();
  const submit = useSubmitCombatAction();
  useBattleMusic();
  const [battle, setBattle] = useState(route.params.battle ?? null);
  const [combat, setCombat] = useState(route.params.combat);
  const [events, setEvents] = useState(route.params.events ?? []);
  const [index, setIndex] = useState(0);
  const [resultRewards, setResultRewards] = useState(rewards);
  const [resultLoot, setResultLoot] = useState(lootName);
  const [animDuration, setAnimDuration] = useState(400);
  const [view, setView] = useState(() =>
    route.params.battle
      ? createBattleView(route.params.battle, route.params.events ?? [])
      : null,
  );
  const queueAnim = useRef(new Animated.Value(0)).current;
  const attackerName = player.data?.vikingName ?? battle?.player.name ?? 'You';
  const defenderName = opponentName ?? title;
  const queueEmpty = index >= events.length;
  const actionsOn = playerActionsEnabled(battle?.waitingFor, queueEmpty, submit.isPending);
  const playerSpeedReady = Boolean(view && view.playerAtb >= 100 && actionsOn);
  const enemySpeedReady = Boolean(view && view.enemyAtb >= 100 && !actionsOn && !view.paused);

  function goToResult(): void {
    navigation.replace('CombatResult', {
      title,
      opponentName,
      enemy,
      battle: null,
      events: [],
      combat,
      rewards: resultRewards,
      lootName: resultLoot,
    });
  }

  useEffect(() => {
    if (shouldPresentCombatStage(route.params)) {
      return;
    }
    if (route.params.combat) {
      navigation.replace('CombatResult', {
        title,
        opponentName,
        enemy,
        battle: null,
        events: [],
        combat: route.params.combat,
        rewards,
        lootName,
      });
    }
  }, [enemy, lootName, navigation, opponentName, rewards, route.params, title]);

  useEffect(() => {
    const event = events[index];
    if (!event) {
      return;
    }
    const duration = eventDurationMs(event);
    setAnimDuration(duration);
    setView((current) => (current ? applyBattleEvent(current, event) : current));
    sfxForEvent(event).forEach((id) => {
      audioService.playSfx(id);
    });
    queueAnim.setValue(0);
    const animation = Animated.timing(queueAnim, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) {
        setIndex((current) => current + 1);
      }
    });
    return () => animation.stop();
  }, [events, index, queueAnim]);

  useEffect(() => {
    if (index < events.length || !combat) {
      return;
    }
    if (battle && !battleIsFinished(battle, combat)) {
      return;
    }
    const animation = Animated.timing(queueAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) {
        goToResult();
      }
    });
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, events.length, battle, combat]);

  function sendAction(action: CombatAction): void {
    if (action !== 'auto' && !actionsOn) {
      return;
    }
    submit.mutate(action, {
      onSuccess: (result) => {
        setCombat(result.combat);
        setBattle(result.battle);
        setEvents(result.events ?? []);
        setIndex(0);
        setResultRewards(result.rewards ?? resultRewards);
        setResultLoot(result.loot?.name ?? resultLoot);
        if (result.battle) {
          setView(createBattleView(result.battle, result.events ?? []));
        }
        if (battleIsFinished(result.battle, result.combat) && (result.events ?? []).length === 0) {
          navigation.replace('CombatResult', {
            title,
            opponentName,
            enemy,
            battle: null,
            events: [],
            combat: result.combat,
            rewards: result.rewards ?? resultRewards,
            lootName: result.loot?.name ?? resultLoot,
          });
        }
      },
    });
  }

  function statusMessage(): string {
    if (actionsOn) {
      return 'Your attack speed bar is full. Choose an action.';
    }
    if (view?.paused) {
      return 'Resolving the strike…';
    }
    return 'Attack speed bars are filling…';
  }

  if (!view) {
    return (
      <Screen>
        <Body>Preparing the raid…</Body>
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <Screen scroll={false}>
        <Title style={styles.battleTitle}>{title}</Title>

        <View style={styles.hudRow}>
          <CombatFighterPanel
            name={attackerName}
            portrait={images.portraitHud}
            hp={view.playerHp}
            hpMax={view.playerMax}
            atb={view.playerAtb}
            hpColor={colors.success}
            side="left"
            durationMs={animDuration}
            hitKey={view.hitActor === 'player' ? index : 0}
            lungeDir={
              view.fx && (view.fx.action === 'attack' || view.fx.action === 'special') && view.fx.actor === 'player'
                ? 1
                : 0
            }
            freezeAtb={view.paused}
            speedReady={playerSpeedReady}
            testID="player"
          />
          <Text style={styles.vs}>VS</Text>
          <CombatFighterPanel
            name={defenderName}
            portraitUri={enemyPortraitUri}
            hp={view.enemyHp}
            hpMax={view.enemyMax}
            atb={view.enemyAtb}
            hpColor={colors.danger}
            side="right"
            durationMs={animDuration}
            hitKey={view.hitActor === 'enemy' ? index : 0}
            lungeDir={
              view.fx && (view.fx.action === 'attack' || view.fx.action === 'special') && view.fx.actor === 'enemy'
                ? -1
                : 0
            }
            freezeAtb={view.paused}
            speedReady={enemySpeedReady}
            testID="enemy"
          />
        </View>

        <View style={styles.arena}>
          <Image source={images.battleStage} style={styles.arenaImage} />
          <CombatFxLayer key={index} fx={view.fx} />
          <View style={styles.arenaOverlay}>
            {view.floatText ? (
              <CombatFloat text={view.floatText} />
            ) : (
              <Body muted style={styles.statusText}>
                {statusMessage()}
              </Body>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {ACTIONS.map((action) => {
            const available = battle ? canUseCombatAction(battle.player, action.key) : false;
            const disabled = !actionsOn || !available;
            return (
              <CombatActionButton
                key={action.key}
                action={action.key}
                label={action.label}
                source={action.source}
                disabled={disabled}
                onPress={() => sendAction(action.key)}
              />
            );
          })}
        </View>

        <Button
          label="Auto Battle"
          variant="secondary"
          testID="combat-skip"
          loading={submit.isPending}
          onPress={() => sendAction('auto')}
        />
      </Screen>
      <BloodOverlay active={view.hitActor === 'player'} triggerKey={index} />
    </View>
  );
}

function CombatFloat({ text }: { text: string }): ReactElement {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    opacity.setValue(1);
    translateY.setValue(8);
    const animation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: -12,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(320),
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]),
    ]);
    animation.start();
    return () => animation.stop();
  }, [opacity, text, translateY]);

  return (
    <Animated.Text style={[styles.float, { opacity, transform: [{ translateY }] }]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  battleTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  vs: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 20,
    paddingHorizontal: spacing.xs,
  },
  arena: {
    flex: 1,
    minHeight: 200,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  arenaImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  arenaOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  statusText: {
    textAlign: 'center',
  },
  float: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
