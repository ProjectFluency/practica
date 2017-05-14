const React = require('react');
const ReactNative = require('react-native');
import { GiftedChat } from 'react-native-gifted-chat';

const {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = ReactNative;


StaticBubble = React.createClass({
  render: function() {
    var bubbleStyle = (this.props.sayer==="Me" || this.props.sayer==="You") ?
                       styles.bubbleRight : styles.bubbleLeft;
    return(
      <View style={[styles.colLayout, bubbleStyle]}>
        <Text> {this.props.sayer} said: </Text>
        <Text> {this.props.text} </Text>
      </View>
    );
  }
})

const PLACEHOLDER = 'Tap here to start typing.';
InputBubble = React.createClass({
  getInitialState: function() {
    return {
      textInputFrozen: false,
      text: PLACEHOLDER,
    };
  },
  submit: function() {
    this.setState(this.getInitialState());
    if (this.state.text !== "" && this.state.text !== PLACEHOLDER)
      this.props.onSubmit({text: this.state.text, sayer: this.props.sayer});
  },
  render: function() {
    var bubbleStyle = (this.props.sayer==="Me" || this.props.sayer==="You") ?
                      styles.bubbleRight : styles.bubbleLeft;
    var then = (this.props.isInitial) ? "" : "Then";
    return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said, </Text>
          <View style={[styles.dashedBox]}>
            <TextInput
              style={{minHeight: 30}}
              returnKeyType={"next"}
              onFocus={() => this.setState({text: ''})}
              onChangeText={(text) => this.setState({text: text})}
              onBlur={this.submit}
              onSubmitEditing={this.submit}
              value={this.state.text} />
          </View>
          </View>
        );
  },
})


//ConversationRecorder
module.exports = React.createClass({
  getInitialState: function() {
    return {
      convo: []
    }
  },
  addToConvo: function(turn) {
    this.setState({convo: this.state.convo.concat([turn])});
  },
  render: function() {
    // Existing conversations
    var convo = this.state.convo;
    var existingConvo = convo.map(
      function(turn, index) {
        return (<StaticBubble style={styles.bubble} key={index}
                              text={turn.text} sayer={turn.sayer} />);
      });
    // Any conversation so far?
    var convoStarted = (convo.length > 0);
    // Order of You said, They said
    var sayers = ["You", "They"];
    if (convoStarted && convo[convo.length - 1].sayer === "You") {
      sayers = sayers.reverse();
    };
    return(
      <ScrollView style={styles.container}>
         <View style={styles.colLayout}>
            <Button style={styles.close} onPress={this.props.onClose} title = "×" />
            {existingConvo}
            <InputBubble style={styles.bubble}  onSubmit={this.addToConvo}
                         sayer={sayers[0]} isInitial={!convoStarted}/>
            <InputBubble style={styles.bubble} onSubmit={this.addToConvo}
                         sayer={sayers[1]} />
         </View>
      </ScrollView>
    );
  }
});

const styles = StyleSheet.create({
  rowLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  dashedBox: {
    margin: 10,
    borderStyle: 'dashed',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
    minHeight: 40,
  },
  wide: {
    width: 500,
  },
  colLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  close: {
    width: 10,
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 20
  },
  bubble: {
    width: '90%',
    margin: 10,
    height: 80,
    borderRadius: 5,
    padding: 10,
  },
  bubbleLeft: {
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    width: '80%',
    margin: 10,
    padding: 10,
  },
  bubbleRight: {
    borderRadius: 5,
    backgroundColor: '#80b4ff',
    alignSelf: 'flex-end',
    width: '80%',
    margin: 20,
    padding: 10,
  },
});

