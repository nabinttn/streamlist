import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface Props {
  children: ReactNode;
  onRetry: () => void;
}

interface State {
  err: Error | null;
}

export class ScreenErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(error: Error): State {
    return { err: error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('ScreenErrorBoundary', error, info);
  }

  render() {
    if (this.state.err) {
      return (
        <View style={styles.box}>
          <Text style={styles.logo}>StreamList</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>{this.state.err.message}</Text>
          <Pressable
            style={styles.btn}
            onPress={() => {
              this.setState({ err: null });
              this.props.onRetry();
            }}>
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    ...typography.headlineMd,
    color: colors.primary_container,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineMd,
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  btn: {
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
  },
  btnText: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
});
