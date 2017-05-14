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
    var then = (this.props.index) ? "Then" : "";
    return(
      <View style={[styles.colLayout, bubbleStyle]}>
        <Text> {then} {this.props.sayer} said, </Text>
        <Text> {this.props.text} </Text>
      </View>
    );
  }
})

const PLACEHOLDER = 'Tap here to start typing.';
InputBubble = React.createClass({
  getInitialState: function() {
    return {
      text: PLACEHOLDER,
    };
  },
  submit: function() {
    this.setState({text: PLACEHOLDER});
    if (this.state.text !== "" && this.state.text !== PLACEHOLDER)
      this.props.onSubmit({text: this.state.text, sayer: this.props.sayer});
  },
  componentDidUpdate() {
    if (this.props.isFirst && this.props.convoStarted)
      this.refs["t"].focus();
  },
  render: function() {
    var bubbleStyle = (this.props.sayer==="Me" || this.props.sayer==="You") ?
                      styles.bubbleRight : styles.bubbleLeft;
    var then = (this.props.convoStarted) ? "Then" : "";
    return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {then} {this.props.sayer} said, </Text>
          <View style={[styles.dashedBox]}>
            <TextInput
              ref="t"
              style={{minHeight: 30}}
              returnKeyType={"next"}
              onFocus={() => this.setState({text: ""})}
              onChangeText={(text) => this.setState({text: text})}
              onBlur={this.submit}
              onSubmitEditing={this.submit}
              autoFocus={this.props.isFirst}
              value={this.state.text} />
          </View>
        </View>
    );
  },
})

ConversationDisplay = React.createClass({
  render: function() {
    var transcript = this.props.transcript;
    console.log(transcript);
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

ConversationRecorder = React.createClass({
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
        return (<StaticBubble style={styles.bubble} key={index} index={index}
                              text={turn.text} sayer={turn.sayer} />);
      });
    // Any conversation so far?
    var convoStarted = (convo.length > 0);
    // Order of You said, They said
    var sayerFlip = {"You": "They", "They": "You"};
    var sayers = (convoStarted) ? [sayerFlip[convo[convo.length - 1].sayer]] : ["You", "They"];
    // InputBubble, given sayer
    var that = this;
    var InputForSayer = function(sayer, index) {
      return (<InputBubble isFirst={index===0} key={index}
                           style={styles.bubble}  onSubmit={that.addToConvo}
                           sayer={sayer} convoStarted={convoStarted}/>);
    };
    var submit = () => { this.props.submitTranscript(this.state.convo); };
    var btn = (convoStarted) ?
      <Button style={styles.button} title={"Submit"} onPress={submit}  /> :
      <Button style={styles.button} title={"Cancel"} onPress={this.props.close} />;
    return(
      <ScrollView style={styles.container}
                  keyboardShouldPersistTaps={"handled"}>
         <View style={styles.colLayout}>
            <ConversationDisplay transcript={convo} />
            {sayers.map(InputForSayer)}
         </View>
         {btn}
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

