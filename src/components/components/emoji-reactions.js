const React = require('react');
const ReactNative = require('react-native');
var Emoji = require('react-native-emoji');

const {
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

module.exports = React.createClass({
  render: function() {
    return (<View>
                <Emoji name="smile" />
                <Emoji name="sweat_smile" />
                <Emoji name="confused" />
                <Emoji name="grin" />
                <Emoji name="+1" />
            </View>);
    );
  }
});

const styles = StyleSheet.create({
});
