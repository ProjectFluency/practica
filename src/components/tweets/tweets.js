const React = require('react');
const ReactNative = require('react-native');
import { GiftedChat } from 'react-native-gifted-chat';

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
      chat: [],
      sent: [],
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
    if (!this.state.username || this.state.chat.length === 0) {
      return (
        <View style={[styles.container]}>
        <Text>Loading...</Text>
        </View>
      );
    } else {
      return (<View style={styles.container}>
                {this.chatHistory()}
              </View>);
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
          sent: [],
        });
      }
    });
  },
  chatHistory: function() {
    var user_ids = {"sbc@gmail.com": 0,
                    "prashish@gmail.com": 1,
                    "prabhasp@stanford.edu": 2};
    var massageMessage = (content, index) => {
        return {_id: index,
            text: content.message,
            createdAt: new Date(Date.UTC(2016, 7, 30, 17, index, 0)),
            user: {
                _id: user_ids[content.username] || 99,
                name: content.username,
                avatar: ''
            },
        };
    };
    var messages = this.state.chat.map(massageMessage);
    var allMessages = messages.concat(this.state.sent.map(massageMessage));
    allMessages.reverse();
    return(<GiftedChat messages={allMessages}
                       user={{ _id: user_ids[this.state.username] || 99,
                       name: this.state.username}}
      onSend={this.onPressSend} />);
  },
  processMessage: function(messageObj){
    const path = "/public_chat";
    var messageObj = {username: this.state.username,
                      message: messageObj.text};
    this.setState({sent: this.state.sent.push(messageObj)});

    this.props.firebase.database().ref(path).push(messageObj)
    .then((response) => {
      this.setState({
        message: ''
      })
    })
    .catch((err) => {
      console.log(err);
    });
  },
  onPressSend: function(messages = []) {
    messages.map(this.processMessage);
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
