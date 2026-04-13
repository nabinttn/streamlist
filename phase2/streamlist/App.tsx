/**
 * StreamList — root app entry.
 */
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useWatchlistStore } from './src/store/watchlistStore';
import { colors } from './src/theme/colors';

function App() {
  useEffect(() => {
    const unsub = useWatchlistStore.persist.onFinishHydration(() => {
      useWatchlistStore.setState({ hydrated: true });
    });
    return unsub;
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default App;
