import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Text,
  AsyncStorage,
  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProblemCard from '../components/ProblemCard';
import AnswerCard from '../components/AnswerCard';
import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

const { width, height } = Dimensions.get('window');

class SubstractScreen extends Component {
  state = {
    firstNumber: 0,
    secondNumber: 0,
    answers: [],
    activeCard: 'Problem',
    disableFlip: false,
    themeColor: {},
    level: '',
    questions: 0,
    questionCount: 0,
    correct: 0,
    wrong: 0,
    reset: false,
  };

  async componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });

    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });

    try {
      await AsyncStorage.getItem('settings', (error, items) => {
        const settings = JSON.parse(items);

        color = settings.themeColor;
        this._setColor(color);
        this.setState({
          level: settings.difficulty,
          questions: settings.questions,
          questionCount: settings.questions,
          reset: true,
        });
      });
    } catch (error) {
      // error
    };

    this._generateProblemAndSolution();
  }

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

  _enabledToFlip = (enabled, isCorrect) => {
    if (enabled) {
      if (isCorrect) {
        this.setState({ disableFlip: false, correct: this.state.correct + 1 });
      } else {
        this.setState({ disableFlip: false, wrong: this.state.wrong + 1 });
      }
    }
  };

  _renderPlayAgain = () => {
    if (this.state.questionCount === 0) {
      return (
        <TouchableWithoutFeedback onPress={() => this._resetCard()}>
          <View
            style={[
              styles.playAgainContainer,
              { backgroundColor: this.state.themeColor.container },
            ]}
          >
            <Text style={{ fontSize: 20, fontFamily: 'AvenirNext-Bold', color: 'white' }}>
              Play again!
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View
          style={[
            styles.playAgainContainer,
          ]}
        />
      );
    }
  };

  _resetCard = () => {
    this.setState({ questionCount: this.state.questions, correct: 0, wrong: 0, reset: true });
    this._generateProblemAndSolution();
  };

  _flipCard = () => {
    if (this.state.reset) {
      this.setState({ reset: false });
    }

    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
      this.setState({ activeCard: 'Problem', questionCount: this.state.questionCount - 1 });
      this._generateProblemAndSolution();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
      this.setState({ disableFlip: true, activeCard: 'Answer' });
    }
  };

  _generateRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  _shuffle = (array) => {
    for (let j, x, i = array.length; i;
      j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
  };

  _generateAnswers = (firstNumber, secondNumber) => {
    const answers = [firstNumber - secondNumber];

    let min = 0;
    let max = 0;

    if (this.state.level === 'Easy') {
      min = 1;
      max = 10;
    } else if (this.state.level === 'Medium') {
      min = 1;
      max = 20;
    } else if (this.state.level === 'Hard') {
      min = (Math.ceil((firstNumber - secondNumber) / 10) * 10) - 10;
      max = (Math.ceil((firstNumber - secondNumber) / 10) * 10) + 10;
    }

    for (let i = 0; i < 4; i++) {
      let rand = this._generateRandomInt(min, max);

      while (answers.find(function (element) { return element === rand })) {
        rand = this._generateRandomInt(min, max);
      }

      answers.push(rand);
    }

    return (this._shuffle(answers));
  };

  _generateProblemAndSolution = () => {
    let firstMin = 0;
    let firstMax = 0;
    let secondMin = 0;
    let secondMax = 0;

    if (this.state.level === 'Easy') {
      firstMin = 1;
      firstMax = 15;
      secondMin = 1;
      secondMax = 10;
    } else if (this.state.level === 'Medium') {
      firstMin = 10;
      firstMax = 20;
      secondMin = 10;
      secondMax = 20;
    } else if (this.state.level === 'Hard') {
      firstMin = 1;
      firstMax = 40;
      secondMin = 20;
      secondMax = 40;
    }

    let firstNumber = this._generateRandomInt(firstMin, firstMax);
    let secondNumber = this._generateRandomInt(secondMin, secondMax);

    if (firstNumber < secondNumber) {
      const tempNumber = secondNumber;
      secondNumber = firstNumber;
      firstNumber = tempNumber;
    }

    const answers = this._generateAnswers(firstNumber, secondNumber);

    this.setState({
      firstNumber: firstNumber,
      secondNumber: secondNumber,
      answers: answers,
    });
  };

  render() {
    const { firstNumber, secondNumber, answers, level, questionCount, correct, wrong } = this.state;

    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: this.frontInterpolate,
        },
      ],
    };
    const backAnimatedStyle = {
      transform: [
        {
          rotateY: this.backInterpolate,
        },
      ],
    };

    return (
      <View style={styles.container}>
        <View style={{ top: 30, left: 20, position: 'absolute' }}>
          <Ionicons
            name='md-home'
            color={this.state.themeColor.icon}
            size={35}
            onPress={() => this.props.navigation.goBack()} />
        </View>
        <View style={{ paddingBottom: 30 }}>
          <Text style={[styles.title, { color: this.state.themeColor.text }]}>
            {this.state.questionCount === 0 ? 'Score' : 'Subtraction'}
          </Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => this._flipCard()}
          disabled={
            (
              this.state.questionCount === 0
              && this.state.activeCard === 'Problem'
              || this.state.disableFlip
            ) ? true : false}>
          <View>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
              <ProblemCard
                firstNumber={firstNumber}
                operand='-'
                secondNumber={secondNumber}
                level={level}
                questions={questionCount}
                correct={correct}
                wrong={wrong}
                newGame={this.state.reset}
              />
            </Animated.View>
            <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
              <AnswerCard
                firstNumber={firstNumber}
                secondNumber={secondNumber}
                answers={answers}
                operand='-'
                flippedTo={this.state.activeCard === 'Answer' ? true : false}
                callback={this._enabledToFlip}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ padding: 20 }}/>
        {this._renderPlayAgain()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playAgainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    width: 150,
  },
  flipCard: {
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
  title: {
    fontSize: 38,
    fontFamily: 'AvenirNext-Bold',
  },
};

export default SubstractScreen;
