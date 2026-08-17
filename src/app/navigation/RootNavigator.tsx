import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/features/auth';
import { usePlayer } from '@/features/player';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { CreateVikingScreen } from '@/features/player/screens/CreateVikingScreen';
import { CombatStageScreen } from '@/features/combat/screens/CombatStageScreen';
import { CombatResultScreen } from '@/features/combat/screens/CombatResultScreen';
import { QuestsScreen } from '@/features/quests/screens/QuestsScreen';
import { InventoryScreen } from '@/features/inventory/screens/InventoryScreen';
import { WarbandScreen } from '@/features/warband/screens/WarbandScreen';
import { EventsScreen } from '@/features/events/screens/EventsScreen';
import { ShopScreen } from '@/features/shop/screens/ShopScreen';
import { FriendsScreen } from '@/features/social/screens/FriendsScreen';
import { LeaderboardsScreen } from '@/features/leaderboards/screens/LeaderboardsScreen';
import { CollectionsScreen } from '@/features/collections/screens/CollectionsScreen';
import { VisitVillageScreen } from '@/features/social/screens/VisitVillageScreen';
import { BossRaidScreen } from '@/features/raids/screens/BossRaidScreen';
import { images } from '@/assets';
import { colors } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { Body } from '@/components/ui/Typography';
import { resolvePlayerGate } from './playerGate';
import { SettingsButton } from '@/features/settings';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootSwitch() {
  const { user, initializing } = useAuth();
  const player = usePlayer();
  const gate = resolvePlayerGate({
    initializing,
    hasUser: Boolean(user),
    playerPending: player.isPending,
    playerError: player.isError,
    player: player.data,
  });

  if (gate === 'loading') {
    return (
      <View style={styles.splash}>
        <Image source={images.splash} style={styles.splashImage} resizeMode="cover" accessibilityLabel="Vikings War" />
        <View style={styles.splashScrim}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </View>
    );
  }

  if (gate === 'unauthenticated') {
    return <AuthNavigator />;
  }

  if (gate === 'error') {
    return (
      <View style={styles.splash}>
        <View style={styles.splashScrim}>
          <Body>Could not load your Viking.</Body>
          <Button
            label="Try again"
            onPress={() => {
              void player.refetch();
            }}
            loading={player.isFetching}
          />
        </View>
      </View>
    );
  }

  if (gate === 'create') {
    return <CreateVikingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.gold,
        contentStyle: { backgroundColor: colors.bg },
        headerRight: () => <SettingsButton />,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CombatStage" component={CombatStageScreen} options={{ title: 'Battle' }} />
      <Stack.Screen name="CombatResult" component={CombatResultScreen} options={{ title: 'Result' }} />
      <Stack.Screen name="Quests" component={QuestsScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="Warband" component={WarbandScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
      <Stack.Screen name="Collections" component={CollectionsScreen} />
      <Stack.Screen name="VisitVillage" component={VisitVillageScreen} options={{ title: 'Visit' }} />
      <Stack.Screen name="BossRaid" component={BossRaidScreen} options={{ title: 'Raids' }} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootSwitch />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  splashImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  splashScrim: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(18,16,14,0.45)',
  },
});
