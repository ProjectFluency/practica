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
  value: function() {
    return this._input._lastNativeText;
  },
  submit: function(event) {
    var value = this.value();
    if (value !== "" && value !== PLACEHOLDER)
      this.props.onSubmit({text: value, sayer: this.props.sayer});
  },
  submitAndThen: function(after) {
    var value = this.value();
    if (value !== "" && value !== PLACEHOLDER)
      this.props.onSubmit({text: value, sayer: this.props.sayer}, after);
    else
      after();
  },
  styleForSayer: function(sayer) {
    return (sayer === "Me" || sayer === "I" || sayer==="You") ?
      styles.bubbleRight : styles.bubbleLeft;
  },
  render: function() {
    var bubbleStyle = this.styleForSayer(this.props.sayer);
    // No "Then" for the first bubble
    var then = (this.props.idx) ? "Then" : "";
    if (this.props.text) {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said: </Text>
          <Text> {this.props.text} </Text>
        </View>);
    } else  {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said: </Text>
          <View style={[styles.dashedBox]}>
            <TextInput
              ref={(i) => { this._input = i}}
              style={{minHeight: 30}}
              returnKeyType={"next"}
              blurOnSubmit={false}
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
      nextSayer: "I",
      convo: [],
    }
  },
  theOtherSayer: function() {
    var sayerFlip = {"I": "They", "They": "I"};
    return sayerFlip[this.state.nextSayer];
  },
  flipSayer: function() {
    this.setState({nextSayer: this.theOtherSayer()});
  },
  addToConvo: function(turn, afterSettingState) {
    var cb = () => { if(afterSettingState) {afterSettingState();} };
    this.setState({convo: this.state.convo.concat([turn]),
                   convoStarted: true,
                   nextSayer: this.theOtherSayer()},
                   cb);
  },
  actionButton: function() {
    var submit = () => {
      // Submit text if there is any in the text input
      this.refs[this.state.convo.length].submitAndThen(() => {
        this.props.submitTranscript(this.state.convo);
      });
    };
    return (this.state.convoStarted) ?
      <Button style={styles.button} title={"Submit"} onPress={submit}  /> :
      <Button style={styles.button} title={this.theOtherSayer() + " started"} onPress={this.flipSayer} />;
  },
  render: function() {
    var that = this;
    var turnToBubble =  function(turn, index) {
      return (
          <Bubble key={index}
                  idx={index}
                  ref={index}
                  text={turn.text}
                  sayer={turn.sayer}
                  onSubmit={that.addToConvo} />);
    };
    var convo = this.state.convo.concat([{text: "", sayer: this.state.nextSayer}]);
    return(
      <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
         <View style={styles.colLayout}>
            {convo.map(turnToBubble)}
         </View>
         <View style={[styles.rowLayout, {alignSelf: 'center'}]}>
           {this.actionButton()}
           <Text style={styles.buttonSeparator}> | </Text>
           <Button style={styles.button} title={"Cancel"} onPress={this.props.close} />
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
  container: {
    flex: 1,
    marginTop: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },
  translucent: {
    opacity: 0.8,
  },
  secondary: {
    color: '#787878',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 20
  },
  buttonSeparator: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    alignSelf: 'center',
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
    margin: 10,
    padding: 10,
  },
});

module.exports = {
  ConversationRecorder: ConversationRecorder,
  ConversationDisplay: ConversationDisplay
};

