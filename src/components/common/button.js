const React = require('react');
const ReactNative = require('react-native');
import Emoji from 'react-native-emoji';

const {
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

module.exports = React.createClass({
  render: function() {
    var innerView = null;
    if (this.props.text) {
        innerView = <Text style={[styles.buttonText]}> {this.props.text} </Text>;
    } else if (this.props.emoji) {
        innerView = <Text><Emoji style={[styles.buttonText]} name={this.props.emoji} /></Text>;
    }
    return (
      <TouchableHighlight
        style={[styles.button]}
        underlayColor={'gray'}
        onPress={this.props.onPress}
      >
        {innerView}
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#e7e7e7',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 20
  }
});
