import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { CombatStageScreen } from './CombatStageScreen';
import type { BattleSession } from '@shared/types';

const mockMutate = jest.fn();

jest.mock('@/features/player', () => ({
  usePlayer: () => ({
    data: { vikingName: 'Erik' },
  }),
}));

jest.mock('@/features/combat/hooks/useCombat', () => ({
  useSubmitCombatAction: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

function waitingBattle(): BattleSession {
  return {
    id: 'b1',
    kind: 'pve',
    title: 'Wild Boar',
    opponentName: 'Wild Boar',
    player: {
      name: 'Erik',
      attack: 20,
      defense: 10,
      health: 100,
      maxHealth: 100,
      speed: 10,
      atb: 100,
      guarding: false,
      specialReadyIn: 0,
      potionsRemaining: 2,
    },
    enemy: {
      name: 'Boar',
      attack: 12,
      defense: 6,
      health: 40,
      maxHealth: 40,
      speed: 8,
      atb: 40,
      guarding: false,
      specialReadyIn: 0,
      potionsRemaining: 2,
    },
    waitingFor: 'player',
    actionCount: 0,
    attackerDamage: 0,
    defenderDamage: 0,
    critical: false,
    pending: { kind: 'pve', enemyId: 'wild_boar', enemyLevel: 1, lootTableId: 'common_hunt' },
  };
}

describe('CombatStageScreen', () => {
  const navigation = { replace: jest.fn(), goBack: jest.fn() };

  const route = {
    key: 'stage',
    name: 'CombatStage' as const,
    params: {
      title: 'Wild Boar',
      opponentName: 'Wild Boar',
      battle: waitingBattle(),
      events: [],
      combat: null,
      rewards: { xp: 20, silver: 30 },
      lootName: 'Seax',
    },
  };

  beforeEach(() => {
    mockMutate.mockClear();
    navigation.replace.mockClear();
  });

  it('submits attack when the player turn is ready', async () => {
    const { getByTestId } = await render(
      <CombatStageScreen navigation={navigation as never} route={route as never} />,
    );
    fireEvent.press(getByTestId('combat-action-attack'));
    expect(mockMutate).toHaveBeenCalledWith('attack', expect.any(Object));
  });

  it('shows attack-speed turn message when the player can act', async () => {
    const { getByText, unmount } = await render(
      <CombatStageScreen navigation={navigation as never} route={route as never} />,
    );
    expect(getByText('Your attack speed bar is full. Choose an action.')).toBeTruthy();
    unmount();
  });

  it('sends auto when Auto Battle is pressed', async () => {
    const { getByTestId } = await render(
      <CombatStageScreen navigation={navigation as never} route={route as never} />,
    );
    fireEvent.press(getByTestId('combat-skip'));
    expect(mockMutate).toHaveBeenCalledWith('auto', expect.any(Object));
  });

  it('shows attack FX and a blood overlay when the player is hit', async () => {
    const hitRoute = {
      ...route,
      params: {
        ...route.params,
        events: [
          {
            type: 'action' as const,
            actor: 'enemy' as const,
            action: 'attack' as const,
            damage: 10,
            heal: 0,
            critical: false,
            hit: true,
            playerHp: 90,
            enemyHp: 40,
            playerAtb: 50,
            enemyAtb: 0,
          },
        ],
      },
    };
    const { getByTestId } = await render(
      <CombatStageScreen navigation={navigation as never} route={hitRoute as never} />,
    );
    expect(getByTestId('combat-fx-attack')).toBeTruthy();
    expect(getByTestId('combat-blood-overlay')).toBeTruthy();
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('shows defend and potion FX for player actions', async () => {
    const potionRoute = {
      ...route,
      params: {
        ...route.params,
        events: [
          {
            type: 'action' as const,
            actor: 'player' as const,
            action: 'potion' as const,
            damage: 0,
            heal: 20,
            critical: false,
            hit: false,
            playerHp: 100,
            enemyHp: 40,
            playerAtb: 0,
            enemyAtb: 40,
          },
        ],
      },
    };
    const { getByTestId } = await render(
      <CombatStageScreen navigation={navigation as never} route={potionRoute as never} />,
    );
    expect(getByTestId('combat-fx-potion')).toBeTruthy();
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('disables actions for a finished fight snapshot', async () => {
    const finishedRoute = {
      ...route,
      params: {
        ...route.params,
        battle: { ...waitingBattle(), waitingFor: 'done' as const },
        events: [
          {
            type: 'action' as const,
            actor: 'player' as const,
            action: 'attack' as const,
            damage: 40,
            heal: 0,
            critical: false,
            hit: true,
            playerHp: 100,
            enemyHp: 0,
            playerAtb: 0,
            enemyAtb: 40,
          },
        ],
        combat: {
          attackerDamage: 40,
          defenderDamage: 0,
          critical: false,
          attackerWon: true,
          attackerHpRemaining: 100,
          defenderHpRemaining: 0,
        },
      },
    };

    const { getByTestId, unmount } = await render(
      <CombatStageScreen navigation={navigation as never} route={finishedRoute as never} />,
    );

    expect(getByTestId('player-health-bar')).toBeTruthy();
    expect(getByTestId('combat-action-attack').props.accessibilityState?.disabled).toBe(true);
    unmount();
  });
});
