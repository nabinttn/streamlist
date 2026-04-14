/* eslint-env jest */

jest.mock('react-native-youtube-iframe', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: function MockYoutubePlayer() {
      return React.createElement(View, { testID: 'youtube-player' });
    },
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Mock = props => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: Mock,
    Svg: Mock,
    Path: Mock,
    G: Mock,
    Defs: Mock,
    LinearGradient: Mock,
    Stop: Mock,
    Rect: Mock,
    Circle: Mock,
  };
});
