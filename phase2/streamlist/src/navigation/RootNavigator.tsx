import { BlurView } from '@react-native-community/blur';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  NavigationContainer,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  IconBookmarkOutline,
  IconHome,
  IconPersonOutline,
  IconSearch,
} from '../components/icons/StreamlistIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { MovieListScreen } from '../screens/MovieListScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { TrailerScreen } from '../screens/TrailerScreen';
import {
  selectWatchlistCount,
  useWatchlistStore,
} from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
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

/** Native stack / tab surfaces (react-native-screens) default to light until set explicitly. */
const nativeStackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
} as const;

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={nativeStackScreenOptions}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MovieList" component={MovieListScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackNav() {
  return (
    <SearchStack.Navigator screenOptions={nativeStackScreenOptions}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    </SearchStack.Navigator>
  );
}

function WatchlistStackNav() {
  return (
    <WatchlistStack.Navigator screenOptions={nativeStackScreenOptions}>
      <WatchlistStack.Screen name="WatchlistMain" component={WatchlistScreen} />
    </WatchlistStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={nativeStackScreenOptions}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
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
      style={[
        tabBarStyles.glyph,
        focused ? tabBarStyles.glyphFocused : tabBarStyles.glyphIdle,
      ]}>
      {children}
    </View>
  );
}

type TabBarIconProps = { color: string; focused: boolean; size: number };

function HomeTabIcon({ color, focused }: TabBarIconProps) {
  return (
    <TabBarGlyph focused={focused}>
      <IconHome size={iconSize.tab} color={color} filled={focused} />
    </TabBarGlyph>
  );
}

function SearchTabIcon({ color, focused }: TabBarIconProps) {
  return (
    <TabBarGlyph focused={focused}>
      <IconSearch size={iconSize.tab} color={color} />
    </TabBarGlyph>
  );
}

function WatchlistTabIcon({ color, focused }: TabBarIconProps) {
  return (
    <TabBarGlyph focused={focused}>
      <IconBookmarkOutline size={iconSize.tab} color={color} />
    </TabBarGlyph>
  );
}

function ProfileTabIcon({ color, focused }: TabBarIconProps) {
  return (
    <TabBarGlyph focused={focused}>
      <IconPersonOutline size={iconSize.tab} color={color} />
    </TabBarGlyph>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const hydrated = useWatchlistStore(s => s.hydrated);
  const count = useWatchlistStore(selectWatchlistCount);

  return (
    <View style={styles.tabSceneRoot}>
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
            tabBarIcon: HomeTabIcon,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNav}
          options={{
            title: 'Search',
            tabBarIcon: SearchTabIcon,
          }}
        />
        <Tab.Screen
          name="WatchlistTab"
          component={WatchlistStackNav}
          options={{
            title: 'Watchlist',
            tabBarIcon: WatchlistTabIcon,
            tabBarBadge: hydrated && count > 0 ? count : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.primary_container },
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNav}
          options={{
            title: 'Profile',
            tabBarIcon: ProfileTabIcon,
          }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ProfileTab',
                  params: {
                    screen: 'ProfileMain',
                  },
                }),
              );
            },
          })}
        />
      </Tab.Navigator>
    </View>
  );
}

export function RootNavigator() {
  return (
    <View style={styles.navigationRoot}>
      <NavigationContainer theme={navTheme}>
        <RootStack.Navigator screenOptions={nativeStackScreenOptions}>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="Detail" component={DetailScreen} />
          <RootStack.Screen
            name="Trailer"
            component={TrailerScreen}
            options={Platform.select({
              ios: { presentation: 'fullScreenModal' },
              default: {},
            })}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Fills the tree under NavigationContainer so the theme background paints immediately. */
  navigationRoot: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  tabSceneRoot: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});

const tabBarStyles = StyleSheet.create({
  glyph: {
    marginBottom: spacing.xxs,
  },
  glyphFocused: {
    transform: [{ scale: 1.1 }],
  },
  glyphIdle: {
    transform: [{ scale: 1 }],
  },
});

