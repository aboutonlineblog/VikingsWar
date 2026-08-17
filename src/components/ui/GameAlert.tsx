import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import { Button } from './Button';
import { Card } from './Card';
import { Body, Title } from './Typography';

export interface GameAlertAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  onPress?: () => void;
}

export interface GameAlertOptions {
  title: string;
  message?: string;
  actions?: GameAlertAction[];
}

interface GameAlertContextValue {
  showAlert: (options: GameAlertOptions) => void;
}

const GameAlertContext = createContext<GameAlertContextValue | undefined>(undefined);

export function GameAlertProvider({ children }: PropsWithChildren) {
  const [alert, setAlert] = useState<GameAlertOptions | null>(null);

  const showAlert = useCallback((options: GameAlertOptions) => {
    setAlert(options);
  }, []);

  const dismiss = useCallback(() => {
    setAlert(null);
  }, []);

  const value = useMemo<GameAlertContextValue>(() => ({ showAlert }), [showAlert]);
  const actions = alert?.actions?.length ? alert.actions : [{ label: 'Understood' }];

  return (
    <GameAlertContext.Provider value={value}>
      {children}
      <Modal
        visible={Boolean(alert)}
        transparent
        animationType="fade"
        onRequestClose={dismiss}
      >
        <View style={styles.scrim}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
            style={StyleSheet.absoluteFill}
            onPress={dismiss}
          />
          <Card style={styles.panel}>
            <Image source={images.iconAlert} style={styles.icon} accessibilityIgnoresInvertColors />
            <Title>{alert?.title}</Title>
            {alert?.message ? <Body>{alert.message}</Body> : null}
            <View style={styles.actions}>
              {actions.map((action) => (
                <Button
                  key={action.label}
                  label={action.label}
                  variant={action.variant ?? 'primary'}
                  onPress={() => {
                    dismiss();
                    action.onPress?.();
                  }}
                />
              ))}
            </View>
          </Card>
        </View>
      </Modal>
    </GameAlertContext.Provider>
  );
}

export function useGameAlert(): GameAlertContextValue {
  const value = useContext(GameAlertContext);
  if (!value) {
    throw new Error('useGameAlert must be used within GameAlertProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(18, 16, 14, 0.86)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  panel: {
    marginBottom: 0,
    zIndex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  actions: {
    marginTop: spacing.md,
  },
});
