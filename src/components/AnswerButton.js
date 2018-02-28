import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage } from 'react-native';

import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

class AnswerButton extends Component {
  state = {
    themeColor: {},
  };

  async componentWillMount() {
    try {
      await AsyncStorage.getItem('settings', (error, items) => {
        const settings = JSON.parse(items);
        color = settings.themeColor;
        this._setColor(color);
      });
    } catch (error) {
      // error
    };
  };

  _setColor = (color) => {
    if (color === 'orange') {
      this.setState({ themeColor: orange });
    } else if (color === 'purple') {
      this.setState({ themeColor: purple });
    } else if (color === 'pink') {
      this.setState({ themeColor: pink });
    } else if (color === 'green') {
      this.setState({ themeColor: green });
    } else if (color === 'blue') {
      this.setState({ themeColor: blue });
    }
  };

  _renderAnswerButton = () => {
    const { title, correctAnswer, chosenAnswer } = this.props;
    if (chosenAnswer === title) {
      if (correctAnswer === chosenAnswer) {
        return (
          <Text style={{ color: 'green', fontSize: 25, fontWeight: 'bold' }}>✔︎</Text>
        );
      } else {
        return (
          <Text style={{ color: 'red', fontSize: 20 }}>✘</Text>
        );
      }
    }
  };

  render() {
    const { title, correctAnswer, chosenAnswer } = this.props;
    return (
      <View style={[styles.button, chosenAnswer === title ? { backgroundColor: 'white' } : null]}>
        {this._renderAnswerButton()}
        <Text style={[styles.answerTextStyle, { color: this.state.themeColor.text }]}>{title}</Text>
      </View>
    );
  }
}

const styles = {
  answerTextStyle: {
    fontSize: 23,
    padding: 5,
    fontFamily: 'AvenirNext-DemiBold',
  },
  button: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 80,
    borderRadius: 10,
  },
};

export default AnswerButton;
