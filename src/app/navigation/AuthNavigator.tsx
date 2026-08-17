import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@/features/auth/screens/SignInScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { colors } from '@/theme/theme';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.gold,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Vikings War' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
    </Stack.Navigator>
  );
}
