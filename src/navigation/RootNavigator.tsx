import { BlurView } from '@react-native-community/blur';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MovieListScreen } from '../screens/MovieListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import {
  selectWatchlistCount,
  useWatchlistStore,
} from '../store/watchlistStore';
import { colors } from '../theme/colors';
import type {
  HomeStackParamList,
  ProfileStackParamList,
  RootTabParamList,
  SearchStackParamList,
  WatchlistStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const WatchlistStack = createNativeStackNavigator<WatchlistStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.surface,
    card: colors.surface,
    text: colors.on_surface,
    border: colors.outline_variant,
    primary: colors.primary_container,
  },
};

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
      <HomeStack.Screen name="MovieList" component={MovieListScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackNav() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
      <SearchStack.Screen name="Detail" component={DetailScreen} />
    </SearchStack.Navigator>
  );
}

function WatchlistStackNav() {
  return (
    <WatchlistStack.Navigator screenOptions={{ headerShown: false }}>
      <WatchlistStack.Screen name="WatchlistMain" component={WatchlistScreen} />
      <WatchlistStack.Screen name="Detail" component={DetailScreen} />
    </WatchlistStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function tabIcon(label: string, color: string) {
  return <Text style={[styles.tabIcon, { color }]}>{label}</Text>;
}

function TabBarBackground() {
  return (
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="dark"
      blurAmount={20}
      reducedTransparencyFallbackColor={colors.surface_container}
    />
  );
}

export function RootNavigator() {
  const insets = useSafeAreaInsets();
  const hydrated = useWatchlistStore(s => s.hydrated);
  const count = useWatchlistStore(selectWatchlistCount);

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary_container,
          tabBarInactiveTintColor: colors.on_surface_variant,
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            backgroundColor: 'rgba(35, 35, 35, 0.7)',
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
          },
          tabBarBackground: TabBarBackground,
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNav}
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => tabIcon('⌂', color),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNav}
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => tabIcon('⌕', color),
          }}
        />
        <Tab.Screen
          name="WatchlistTab"
          component={WatchlistStackNav}
          options={{
            title: 'Watchlist',
            tabBarIcon: ({ color }) => tabIcon('☆', color),
            tabBarBadge: hydrated && count > 0 ? count : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.primary_container },
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNav}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => tabIcon('○', color),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
