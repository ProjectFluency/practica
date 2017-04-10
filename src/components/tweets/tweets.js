const React = require('react');
const ReactNative = require('react-native');

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
      username: null,
      message: '',
      chat: []
    };
  },
  componentWillMount: function(){
    AsyncStorage.getItem('@guff:username', (err, username) => {
      if(err || !username) {
        this.props.navigator.immediatelyResetRouteStack([
          {name: 'signin'}
        ]);
      } else {
        this.setState({
          username: username
        });

        this.firebaseListen();
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
        <View>
        <Text>Welcome {this.state.username}!!!</Text>
        <Button text={'Log Out'} onPress={this.onPressLogOut} />
        </View>

        <View>
        <Text style={[styles.label]}>Chat History: </Text>
        {this.chatHistory()}
        </View>

        <View>
        <Text style={[styles.label]}>Enter a message: </Text>
        <TextInput
        style={[styles.input]}
        value={this.state.message}
        onChangeText={(text) => this.setState({message: text})}
        />
        <Button text={'Send'} onPress={this.onPressSend} />
        </View>
        </View>
      );

    }
  },
  firebaseListen: function() {
    this.props.firebase.database().ref("/public_chat").on('value', (snapshot) => {

      if (snapshot.val()) {
        console.log(snapshot.val());
        const record = snapshot.val();
        const chat = [];

        for (var key in record) {
          if (record.hasOwnProperty(key)) {
            chat = chat.concat([record[key]])
          }
        }

        this.setState({
          chat: chat,
        });
      }
    });
  },
  chatHistory: function() {
    return this.state.chat.map((content, index) => {
      return (
        <View key={index + 1}>
        <Text>
        {content.username + " : " + content.message}
        </Text>
        </View>
      );
    });
  },
  onPressSend: function(){

    const path = "/public_chat";

    this.props.firebase.database().ref(path).push({
      username: this.state.username,
      message: this.state.message
    })
    .then((response) => {
      this.setState({
        message: ''
      })
    })
    .catch((err) => {
      console.log(err);
    });
  },
  onPressLogOut: function() {
    AsyncStorage.removeItem('@guff:username');

    this.props.firebase.auth().signOut();

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
