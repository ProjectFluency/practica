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

Bubble = React.createClass({
  getInitialState: function() {
    return {
      textInputFrozen: false,
      text: 'Tap here to start typing.'
    };
  },
  freezeText: function() {
    this.setState({
      textInputFrozen: true,
    });
  },
  render: function() {
    console.log(this.props.who);
    var bubbleStyle = (this.props.who==="Me" || this.props.who==="You") ?
                      styles.bubbleRight : styles.bubbleLeft;
    if (this.state.textInputFrozen) {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {this.props.who} said: </Text>
          <Text> {this.state.text} </Text>
        </View>
      );
    } else if (this.props.who === "none") {
       return(<View />);
    } else {
      return(
        <View style={[styles.colLayout, bubbleStyle]}>
          <Text> {this.props.who} said: </Text>
          <View style={[styles.dashedBox]}>
            <TextInput
              style={{minHeight: 30}}
              returnKeyType={"next"}
              onFocus={() => this.setState({text: ''})}
              onChangeText={(text) => this.setState({text: text})}
              value={this.state.text} />
          </View>
        </View>
      );
    }
  },
})


//ConversationRecorder
module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentTalker: 'none',
    }
  },
  setTalker: function(who) {
    this.setState({currentTalker: who})
  },
  render: function() {
    //animationType={"slide"}
    return(
      <ScrollView style={styles.container}>
         <View style={styles.colLayout}>
            <Button style={styles.close} onPress={this.props.onClose} title = "×" />
            <Bubble style={styles.bubble} who={"You"} />
            <Bubble style={styles.bubble} who={"They"} />
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

