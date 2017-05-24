import React, { Component } from 'react';
import { StyleSheet, Navigator } from 'react-native';
const codePush = require('react-native-code-push');

const firebase = require('./init/firebase').getConnection();

const Signin = require('./components/authentication/signin');
const Signup = require('./components/authentication/signup');
const Tweets = require('./components/tweets/tweets');

const ROUTES = {
  signin: Signin,
  signup: Signup,
  tweets: Tweets
};

class Practica extends Component {
  renderScene = (route, navigator) => {
    const Component = ROUTES[route.name];

    return <Component route={route} navigator={navigator} firebase={firebase}/>;
  }

  render() {
    return (
      <Navigator
        style={[styles.container]}
        initialRoute={{ name: 'tweets' }}
        renderScene={this.renderScene}
        configureScene={() => Navigator.SceneConfigs.FloatFromRight}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

module.exports = codePush(Practica);
