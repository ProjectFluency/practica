const React = require('react');
const ReactNative = require('react-native');
const OneSignal = require('react-native-onesignal');

const {
  StyleSheet,
  Navigator
} = ReactNative;

const firebase = require('./init/firebase').getConnection();

const Signin = require('./components/authentication/signin');
const Signup = require('./components/authentication/signup');
const Tweets = require('./components/tweets/tweets');

const ROUTES = {
  signin: Signin,
  signup: Signup,
  tweets: Tweets
};

module.exports = React.createClass({
  componentWillMount: function() {
    OneSignal.default.addEventListener('received', this.onReceived);
    OneSignal.default.addEventListener('opened', this.onOpened);
    OneSignal.default.addEventListener('registered', this.onRegistered);
    OneSignal.default.addEventListener('ids', this.onIds);
    console.log(OneSignal);
    //debugger;
  },
  componentWillUnmount() {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('registered', this.onRegistered);
      OneSignal.removeEventListener('ids', this.onIds);
  },

  onReceived(notification) {
      console.log("Notification received: ", notification);
  },

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  },

  onRegistered(notifData) {
      console.log("Device had been registered for push notifications!", notifData);
  },

  onIds(device) {
  console.log('Device info: ', device);
  },

  renderScene: function(route, navigator) {
    const Component = ROUTES[route.name];

    return <Component route={route} navigator={navigator} firebase={firebase}/>;
  },
  render: function() {
    return (
      <Navigator
      style={[styles.container]}
      initialRoute={{ name: 'tweets' }}
      renderScene={this.renderScene}
      configureScene={() => { return Navigator.SceneConfigs.FloatFromRight; }}
      />
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
