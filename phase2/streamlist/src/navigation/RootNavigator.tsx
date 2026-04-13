import { BlurView } from '@react-native-community/blur';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  IconBookmarkOutline,
  IconHome,
  IconPersonOutline,
  IconSearch,
} from '../components/icons/StreamlistIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { MovieListScreen } from '../screens/MovieListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { DetailScreen } from '../screens/DetailScreen';
import {
  selectWatchlistCount,
  useWatchlistStore,
} from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { typography } from '../theme/typography';
import type {
  HomeStackParamList,
  ProfileStackParamList,
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
  WatchlistStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
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
      <HomeStack.Screen name="MovieList" component={MovieListScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackNav() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    </SearchStack.Navigator>
  );
}

function WatchlistStackNav() {
  return (
    <WatchlistStack.Navigator screenOptions={{ headerShown: false }}>
      <WatchlistStack.Screen name="WatchlistMain" component={WatchlistScreen} />
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

/** Stitch bottom nav: active item `scale-110`, icon `mb-1` (4px). */
function TabBarGlyph({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        marginBottom: 4,
        transform: [{ scale: focused ? 1.1 : 1 }],
      }}>
      {children}
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const hydrated = useWatchlistStore(s => s.hydrated);
  const count = useWatchlistStore(selectWatchlistCount);

  return (
    <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: colors.tab_bar_inactive,
          tabBarLabelStyle: {
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontFamily: typography.titleSm.fontFamily,
          },
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            backgroundColor: 'rgba(19, 19, 19, 0.7)',
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
            tabBarIcon: ({ color, focused }) => (
              <TabBarGlyph focused={focused}>
                <IconHome
                  size={iconSize.tab}
                  color={color}
                  filled={focused}
                />
              </TabBarGlyph>
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNav}
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <TabBarGlyph focused={focused}>
                <IconSearch size={iconSize.tab} color={color} />
              </TabBarGlyph>
            ),
          }}
        />
        <Tab.Screen
          name="WatchlistTab"
          component={WatchlistStackNav}
          options={{
            title: 'Watchlist',
            tabBarIcon: ({ color, focused }) => (
              <TabBarGlyph focused={focused}>
                <IconBookmarkOutline size={iconSize.tab} color={color} />
              </TabBarGlyph>
            ),
            tabBarBadge: hydrated && count > 0 ? count : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.primary_container },
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNav}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarGlyph focused={focused}>
                <IconPersonOutline size={iconSize.tab} color={color} />
              </TabBarGlyph>
            ),
          }}
        />
      </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="Detail" component={DetailScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

