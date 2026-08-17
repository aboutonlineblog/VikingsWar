import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { QuestCard } from '@/components/ui/QuestCard';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { usePlayer } from '@/features/player';
import { useCompleteQuest, useQuests } from '@/features/quests/hooks/useQuests';
import { combatPayloadFromResult, presentCombat } from '@/features/combat/presentCombat';
import type { RootStackParamList } from '@/app/navigation/types';

export function QuestsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showAlert } = useGameAlert();
  const quests = useQuests();
  const player = usePlayer();
  const complete = useCompleteQuest();

  if (quests.isPending) {
    return (
      <Screen>
        <Body>Unrolling the saga…</Body>
      </Screen>
    );
  }

  if (quests.isError) {
    return (
      <Screen>
        <Title>Quests</Title>
        <Body>Could not load quests. Is the emulator running and seeded?</Body>
      </Screen>
    );
  }

  const chapter = player.data?.currentChapter ?? 1;

  return (
    <Screen>
      <Title>Quests</Title>
      <Body muted>Chapter {chapter}</Body>
      {(quests.data ?? [])
        .filter((quest) => quest.chapter <= chapter)
        .map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            loading={complete.isPending && complete.variables === quest.id}
            progressLabel={
              player.data?.questProgress?.[quest.id]
                  ? `Completed ${player.data.questProgress?.[quest.id]?.completions ?? 0}x`
                : undefined
            }
            onGo={() => {
              complete.mutate(quest.id, {
                onSuccess: (result) => {
                  presentCombat(
                    navigation,
                    combatPayloadFromResult(quest.name, quest.name, result),
                  );
                },
                onError: (error) => showAlert({ title: 'Quest failed', message: String(error) }),
              });
            }}
          />
        ))}
    </Screen>
  );
}
