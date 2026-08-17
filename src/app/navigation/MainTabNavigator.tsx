import { Image, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { VillageScreen } from '@/features/village/screens/VillageScreen';
import { BattleScreen } from '@/features/combat/screens/BattleScreen';
import { WorldMapScreen } from '@/features/world/screens/WorldMapScreen';
import { ClanScreen } from '@/features/clans/screens/ClanScreen';
import { ProfileScreen } from '@/features/player/screens/ProfileScreen';
import { GameHud } from '@/components/game/GameHud';
import { navIcon, type NavIconName } from '@/assets';
import { colors } from '@/theme/theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, NavIconName> = {
  Home: 'home',
  Battle: 'battle',
  World: 'world',
  Clan: 'clan',
  Viking: 'viking',
};

export function MainTabNavigator() {
  return (
    <View style={styles.root}>
      <GameHud />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.bgElevated,
            borderTopColor: colors.gold,
          },
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused }) => (
            <Image
              source={navIcon(TAB_ICONS[route.name])}
              style={[styles.icon, focused && styles.iconActive]}
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={VillageScreen} />
        <Tab.Screen name="Battle" component={BattleScreen} />
        <Tab.Screen name="World" component={WorldMapScreen} />
        <Tab.Screen name="Clan" component={ClanScreen} />
        <Tab.Screen name="Viking" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  icon: {
    width: 26,
    height: 26,
    opacity: 0.65,
  },
  iconActive: {
    opacity: 1,
  },
});
