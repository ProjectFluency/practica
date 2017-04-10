const React = require('react');
const ReactNative = require('react-native');

const {
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

module.exports = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        style={[styles.button]}
        underlayColor={'gray'}
        onPress={this.props.onPress}
      >
        <Text style={[styles.buttonText]}>{this.props.text}</Text>
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
    borderColor: 'black',
    marginTop: 10
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 20
  }
});
