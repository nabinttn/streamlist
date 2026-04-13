/* eslint-env jest */

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
