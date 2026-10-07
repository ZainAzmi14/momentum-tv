import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, Text, Pressable, View } from 'react-native';
import { useState } from 'react';
import DashboardScreen from './src/screens/DashboardScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';

type ScreenName = 'dashboard' | 'diagnostics';

function App() {
  const [screen, setScreen] = useState<ScreenName>('dashboard');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Momentum TV</Text>
          <View style={styles.navigation}>
            <NavigationButton
              label="Dashboard"
              selected={screen === 'dashboard'}
              onPress={() => setScreen('dashboard')}
            />
            <NavigationButton
              label="Diagnostics"
              selected={screen === 'diagnostics'}
              onPress={() => setScreen('diagnostics')}
            />
          </View>
        </View>
        {screen === 'dashboard' ? <DashboardScreen /> : <DiagnosticsScreen />}
      </View>
    </SafeAreaProvider>
  );
}

function NavigationButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      focusable
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={[
        styles.navigationButton,
        selected && styles.navigationButtonSelected,
        focused && styles.focused,
      ]}
    >
      <Text style={styles.navigationLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101820',
    flex: 1,
    paddingHorizontal: 48,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  navigation: {
    flexDirection: 'row',
    gap: 16,
  },
  navigationButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navigationButtonSelected: {
    backgroundColor: '#245b78',
  },
  navigationLabel: {
    color: '#ffffff',
    fontSize: 18,
  },
  focused: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
});

export default App;
