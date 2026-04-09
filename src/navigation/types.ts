import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { movieId: number };
  MovieList: {
    title: string;
    listType: 'trending' | 'topRated' | 'genre';
    genreId?: number | null;
  };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: number };
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
  Detail: { movieId: number };
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
