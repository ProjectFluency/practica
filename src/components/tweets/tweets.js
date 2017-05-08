const React = require('react');
const ReactNative = require('react-native');
const moment = require('moment');
import { GiftedChat } from 'react-native-gifted-chat';

const {
  View,
  Text,
  StyleSheet,
  TextInput,
  AsyncStorage
} = ReactNative;

const Button = require('../common/button');
const DATE_FMT = 'MMM D YYYY HH:mm:ss';

function idFromName(fullname) {
    return fullname.split(" ")[0].toLowerCase();
}

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
    this.props.firebase.database().ref("/messages/public_chat").on('value', (snapshot) => {

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
    var massageMessage = (content, index) => {
        return {_id: index,
            text: content.message.content,
            createdAt: moment.utc(content.created_at, DATE_FMT),
            user: {
                _id: idFromName(content.user.name),
                name: content.user.name,
            },
        };
    };
    var messages = this.state.chat.map(massageMessage);
    console.log(this.state.sent);
    messages.reverse();
    return(<GiftedChat messages={messages}
                       user={{ _id: idFromName(this.state.username),
                               name: this.state.username}}
                       onSend={this.onPressSend} />);
  },
  processMessage: function(messageObj){
    const path = "/messages/public_chat";
    console.log(messageObj);
    var serverMsg = {message: {content: messageObj.text,
                               content_type: "text"},
                     created_at: moment().format(DATE_FMT),
                     user: {id: this.state.username, name: this.state.username}};
    console.log(serverMsg);
    this.props.firebase.database().ref(path).push(serverMsg)
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
