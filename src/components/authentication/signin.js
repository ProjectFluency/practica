const React = require('react');
const ReactNative = require('react-native');
const config = require('../../config/config');
const API = require('../../config/API');
const fetcher = require('../../util/fetcher');

const {
  View,
  Text,
  StyleSheet,
  TextInput,
  AsyncStorage
} = ReactNative;

const Button = require('../common/button');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  componentWillMount: function(){
    AsyncStorage.removeItem('@guff:username');
  },
  render: function() {
    return (
      <View style={[styles.container]}>

        <Text style={[styles.label]}>Username:</Text>
        <TextInput
          style={[styles.input]}
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
        />

        <Text style={[styles.label]}>Password:</Text>
        <TextInput
          secureTextEntry={true}
          style={[styles.input]}
          value={this.state.password}
          onChangeText={(text) => this.setState({password: text})}
        />

        <Text style={[styles.label]}>{this.state.errorMessage}</Text>
        <Button text={'Sign In'} onPress={this.onPress} />
        <Button text={'I need an account...'} onPress={this.onSignupPress} />
      </View>
    );
  },
  onPress: function() {

    this.props.firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
    .then((response) => {
      this.setState({
        username: ''
      });

      AsyncStorage.setItem('@guff:username', response.email);

      this.props.navigator.immediatelyResetRouteStack([
        {name: 'tweets'}
      ]);
    })
    .catch((err) => {
      this.setState({
        errorMessage: err.message
      });
    });

      this.setState({
        password: ''
      });

  },
  onSignupPress: function() {
    this.props.navigator.push({name: 'signup'});
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    padding: 4,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    width: 200,
    alignSelf: 'center'
  },
  label:{
    fontSize: 18
  }
});
