import React, { Component } from 'react';
import { View, Text, Dimensions, AsyncStorage } from 'react-native';

import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

const { width, height } = Dimensions.get('window');

class ProblemCard extends Component {
  state = {
    themeColor: {},
    timerStart: 0,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.newGame) {
      this.setState({ timerStart: Date.now() });
    }
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

  _renderCard = () => {
    const { firstNumber, operand, secondNumber, level, questions, correct, wrong } = this.props;

    if (questions !== 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.textStyle, { fontSize: 18, top: 130, position: 'absolute' }]}>
            {level}/{questions}
          </Text>
          <Text style={styles.textStyle}>
            {firstNumber + ' ' + operand + ' ' + secondNumber}
          </Text>
        </View>
      );
    } else {
      let timestamp = '';
      if (this.state.timerStart !== 0) {
        const timerEnd = Date.now();
        const time = Math.floor((timerEnd - this.state.timerStart) / 1000);
        const minutes = '0' + Math.floor(time / 60);
        const seconds = '0' + (time - minutes * 60);
        timestamp = minutes.substr(-2) + ':' + seconds.substr(-2);
      }

      return (
        <View>
          <View style={{ alignItems: 'center', bottom: 15 }}>
            <Text style={[styles.textStyle, { fontSize: 25 }]}>{level}/{correct + wrong}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#4b830d', fontSize: 45, fontWeight: 'bold', top: -10 }}>✔︎ </Text>
            <Text style={[styles.textStyle, { fontSize: 35 }]}>
              = {this.props.correct}
            </Text>
            <View style={{ padding: 20 }} />
            <Text style={{ color: 'red', fontSize: 35, fontWeight: 'bold' }}>✘ </Text>
            <Text style={[styles.textStyle, { fontSize: 35 }]}>
              = {this.props.wrong}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.textStyle, { fontSize: 25 }]}>{timestamp}</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={[
        styles.mathProblemContainer,
        { backgroundColor: this.state.themeColor.container },
      ]}>
        {this._renderCard()}
      </View>
    );
  }
}

const styles = {
  mathProblemContainer: {
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
};

export default ProblemCard;
