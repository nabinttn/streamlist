import type { CompositeScreenProps } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  HomeMain: undefined;
  MovieList: {
    title: string;
    listType: 'trending' | 'topRated' | 'genre';
    /** When set, “See All” matches genre-scoped discover lists from Home. */
    genreId?: number | null;
    /** Third row: `popular` vs `latest` discover sort when `listType` is `genre` and `genreId` is set. */
    genreListSort?: 'popular' | 'latest';
  };
};

export type SearchStackParamList = {
  SearchMain: undefined;
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  WatchlistTab: NavigatorScreenParams<WatchlistStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/** Root stack — Detail sits beside the tab navigator (no tab bar on detail). */
export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  Detail: { movieId: number };
};

/** Nested screens that call `navigation.navigate('Detail', …)` — bubbles to `RootStackParamList`. */
export type HomeMainScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'HomeTab'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type MovieListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'MovieList'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'HomeTab'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type SearchMainScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'SearchTab'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type WatchlistMainScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WatchlistStackParamList, 'WatchlistMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'WatchlistTab'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type DetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Detail'
>;
