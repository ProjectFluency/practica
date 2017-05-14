const ReactNative = require('react-native');

const {
  AppRegistry
} = ReactNative;

const Main = require('./src/main');

AppRegistry.registerComponent('guff', () => Main)
