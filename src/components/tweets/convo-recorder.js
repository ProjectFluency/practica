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
  findNodeHandle,
} = ReactNative;

const PLACEHOLDER = '';

ConversationDisplay = React.createClass({
  render: function() {
    var transcript = this.props.transcript;
    var turnToBubble = function(turn, index) {
      console.log(turn, index);
      return (<StaticBubble
                style={styles.bubble}
                key={index}
                index={index}
                text={turn.text}
                sayer={turn.sayer}> </StaticBubble>);
    };
    if (transcript.length) {
      return (<View> {transcript.map(turnToBubble)} </View>);
    } else {
      return (<View/>);
    }
  },
});

Bubble = React.createClass({
  submit: function(event) {
    var value = event.nativeEvent.text;
    if (value !== "" && value !== PLACEHOLDER)
      this.props.onSubmit({text: value, sayer: this.props.sayer});
  },
  styleForSayer: function(sayer) {
    return (sayer === "Me" || sayer === "You") ?
      styles.bubbleRight : styles.bubbleLeft;
  },
  render: function() {
    var bubbleStyle = this.styleForSayer(this.props.sayer);
    var then = (this.props.convoStarted) ? "Then" : "";
    if (this.props.text) {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said, </Text>
          <Text> {this.props.text} </Text>
        </View>);
    } else  {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said, </Text>
          <View style={[styles.dashedBox]}>
            <TextInput
              style={{minHeight: 30}}
              returnKeyType={"next"}
              onSubmitEditing={this.submit}
              autoFocus={true} />
          </View>
        </View>);
    }
  }
});

ConversationRecorder = React.createClass({
  getInitialState: function() {
    return {
      convoStarted: false,
      nextSayer: "You",
      convo: []
    }
  },
  theOtherSayer: function() {
    var sayerFlip = {"You": "They", "They": "You"};
    return sayerFlip[this.state.nextSayer];
  },
  flipSayer: function() {
    this.setState({nextSayer: this.theOtherSayer()});
  },
  addToConvo: function(turn) {
    this.setState({convo: this.state.convo.concat([turn]),
                   convoStarted: true,
                   nextSayer: this.theOtherSayer()});
  },
  submitButton: function() {
    var submit = () => { this.props.submitTranscript(this.state.convo); };
    return (this.state.convoStarted) ?
      <Button style={styles.button} title={"Submit"} onPress={submit}  /> :
      <Button style={styles.button} title={"Cancel"} onPress={this.props.close} />;
  },
  render: function() {
    var that = this;
    var turnToBubble =  function(turn, index) {
      return (
          <Bubble key={index}
                  text={turn.text}
                  sayer={turn.sayer}
                  onSubmit={that.addToConvo}
                  convoStarted={that.state.convoStarted}/>);
    };
    var flipper = (this.state.convoStarted) ? <View/> :
      <Button style={styles.button}
              title={this.theOtherSayer() + " started."}
              onPress={this.flipSayer} />;
    // Add the text-input
    var convo = this.state.convo.concat([{text: "", sayer: this.state.nextSayer}]);
    return(
      <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
         <View style={styles.colLayout}>
            {convo.map(turnToBubble)}
            {flipper}
         </View>
         {this.submitButton()}
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

module.exports = {
  ConversationRecorder: ConversationRecorder,
  ConversationDisplay: ConversationDisplay
};

