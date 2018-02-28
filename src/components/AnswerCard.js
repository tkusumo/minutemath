import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text, AsyncStorage } from 'react-native';

import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

import AnswerButton from './AnswerButton';

const { width, height } = Dimensions.get('window');

class AnswerCard extends Component {
  state = {
    chosenAnswer: -1,
    answerCardIsActive: false,
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

  componentWillReceiveProps(nextProps) {
    this.setState({ answerCardIsActive: nextProps.flippedTo });

    if (!this.state.answerCardIsActive) {
      this.setState({ chosenAnswer: -1 });
    }
  };

  _answerClicked = (answer) => {
    this.props.callback(true, answer === this._generateCorrectAnswer());
    this.setState({ chosenAnswer: answer });
  };

  _renderAnswerCard = (answers) => {
    const { showAnswerCard, answerCardIsActive } = this.state;

    if (answerCardIsActive) {
      return this._renderAnswers(answers);
    };
  };

  _renderAnswers = (answers) => {
    const correctAnswer = this._generateCorrectAnswer();

    return answers.map((answer) => {
      return (
        <TouchableOpacity
          style={[styles.space]}
          key={answer}
          onPress={() => this._answerClicked(answer)}
          disabled={this.state.chosenAnswer >= 0 ? true : false}
        >
          <AnswerButton
            title={answer}
            correctAnswer={correctAnswer}
            chosenAnswer={this.state.chosenAnswer}
          />
        </TouchableOpacity>
      );
    });
  };

  _generateRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  _generateCorrectAnswer = () => {
    const { firstNumber, secondNumber, operand } = this.props;
    let answer = 0;

    if (operand === '+') {
      answer = firstNumber + secondNumber;
    } else if (operand === '-') {
      answer = firstNumber - secondNumber;
    }

    return answer;
  };

  render() {
    const { firstNumber, secondNumber, operand, answers } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: this.state.themeColor.container }]}>
        <View style={{ top: 25, position: 'absolute' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'AvenirNext-DemiBold',
          }}>
            {this.state.answerCardIsActive ? firstNumber + ' ' + operand + ' ' + secondNumber : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 25 }}>
          {this._renderAnswerCard(answers)}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: width * 0.9,
    height: height * 0.35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 80,
    color: 'white',
    fontFamily: 'AvenirNext-DemiBold',
  },
  space: {
    padding: 4,
  },
};

export default AnswerCard;
