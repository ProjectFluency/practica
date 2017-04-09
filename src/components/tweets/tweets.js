const React = require('react');
const ReactNative = require('react-native');

const {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} = ReactNative;

const Button = require('../common/button');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      username: null
    };
  },
  componentWillMount: function(){
    AsyncStorage.getItem('@MySuperStoreAuthentication:username', (err, username) => {
      if(err || !username) {
        this.props.navigator.immediatelyResetRouteStack([
          {name: 'signin'}
        ]);
      } else {
        this.setState({
          username: username
        });
      }
    });
  },
  render: function() {
    if (!this.state.username) {

      return (
        <View style={[styles.container]}>
          <Text>Loading...</Text>
        </View>
      );

    } else {

      return (
        <View style={[styles.container]}>
          <Text>Welcome {this.state.username}!!!</Text>
          <Button text={'Log Out'} onPress={this.onPressLogOut} />
        </View>
      );

    }
  },
  onPressLogOut: function() {
    AsyncStorage.removeItem('@MySuperStoreAuthentication:username');

    this.props.navigator.immediatelyResetRouteStack([
      {name: 'signin'}
    ]);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
