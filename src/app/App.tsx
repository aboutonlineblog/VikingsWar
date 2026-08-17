import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { initFirebase } from '@/lib/firebase/initFirebase';
import { AppProviders } from '@/app/providers/AppProviders';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';

initFirebase();

function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    track(AnalyticsEvents.sessionStart);
  }, []);

  return (
    <AppProviders>
      <StatusBar barStyle={scheme === 'light' ? 'dark-content' : 'light-content'} />
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
