import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  AsyncStorage,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

const { width, height } = Dimensions.get('window');

class Settings extends Component {
  state = {
    themeColor: {},
    totalQuestions: 0,
    level: 'Easy',
  };

  _themeColorPressed = async (color) => {
    try {
      const value = await AsyncStorage.getItem('settings');
      if (value !== null) {
        const setColor = {
          themeColor: color,
        };

        await AsyncStorage.mergeItem('settings', JSON.stringify(setColor));
        this._setColor(color);
        this.props.navigation.state.params.callback(color);
      }
    } catch (error) {
      console.log(error);
    }
  };

  _questionsPressed = async (total) => {
    try {
      const value = await AsyncStorage.getItem('settings');
      if (value !== null) {
        const setTotal = {
          questions: total,
        };

        await AsyncStorage.mergeItem('settings', JSON.stringify(setTotal));
        this.setState({ totalQuestions: total });
      }
    } catch (error) {
      console.log(error);
    }
  };

  _levelPressed = async (level) => {
    try {
      const value = await AsyncStorage.getItem('settings');
      if (value !== null) {
        const setLevel = {
          difficulty: level,
        };

        await AsyncStorage.mergeItem('settings', JSON.stringify(setLevel));
        this.setState({ level: level });
      }
    } catch (error) {
      console.log(error);
    }
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

  _renderLevel = (level) => {
    return (
      <TouchableWithoutFeedback onPress={() => this._levelPressed(level)}>
        <View style={[
          styles.level,
          {
            backgroundColor: this.state.level === level
            ? 'white' : this.state.themeColor.container,
          },
        ]}>
          <Text style={[
            styles.textStyle,
            {
              color: this.state.level === level ? this.state.themeColor.text : 'white',
            },
          ]}>
            {level}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderQuestions = (number) => {
    return (
      <TouchableWithoutFeedback onPress={() => this._questionsPressed(number)}>
        <View style={[
          styles.circle,
          {
            backgroundColor: this.state.totalQuestions === number
              ? 'white' : this.state.themeColor.container,
          },
        ]}>
          <Text style={[
            styles.textStyle,
            {
              color: this.state.totalQuestions === number ? this.state.themeColor.text : 'white',
            },
          ]}>
            {number}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  async componentWillMount() {
    try {
      await AsyncStorage.getItem('settings', (error, items) => {
        const settings = JSON.parse(items);

        const color = settings.themeColor;
        this._setColor(color);
        this.setState({ totalQuestions: settings.questions, level: settings.difficulty });
      });
    } catch (error) {
      // error
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ top: 30, left: 20, position: 'absolute' }}>
          <Ionicons
            name='md-home'
            color={this.state.themeColor.icon}
            size={35}
            onPress={() => this.props.navigation.goBack()} />
        </View>
        <Text style={[styles.title, { color: this.state.themeColor.container }]}>Settings</Text>
        <View style={styles.settingContainer}>
          {this._renderLevel('Easy')}
          <View style={{ padding: 5 }} />
          {this._renderLevel('Medium')}
          <View style={{ padding: 5 }} />
          {this._renderLevel('Hard')}
        </View>
        <View style={styles.settingContainer}>
          {this._renderQuestions(5)}
          <View style={{ padding: 5 }} />
          {this._renderQuestions(10)}
          <View style={{ padding: 5 }} />
          {this._renderQuestions(15)}
          <View style={{ padding: 5 }} />
          {this._renderQuestions(20)}
          <View style={{ padding: 5 }} />
          {this._renderQuestions(25)}
        </View>
        <View style={styles.settingContainer}>
          <TouchableWithoutFeedback onPress={() => this._themeColorPressed('orange')}>
            <View style={[styles.theme, { backgroundColor: 'orange' }]} />
          </TouchableWithoutFeedback>
          <View style={{ padding: 5 }} />
          <TouchableWithoutFeedback onPress={() => this._themeColorPressed('purple')}>
            <View style={[styles.theme, { backgroundColor: 'purple' }]} />
          </TouchableWithoutFeedback>
          <View style={{ padding: 5 }} />
          <TouchableWithoutFeedback onPress={() => this._themeColorPressed('pink')}>
            <View style={[styles.theme, { backgroundColor: '#a00037' }]} />
          </TouchableWithoutFeedback>
          <View style={{ padding: 5 }} />
          <TouchableWithoutFeedback onPress={() => this._themeColorPressed('green')}>
            <View style={[styles.theme, { backgroundColor: '#4b830d' }]} />
          </TouchableWithoutFeedback>
          <View style={{ padding: 5 }} />
          <TouchableWithoutFeedback onPress={() => this._themeColorPressed('blue')}>
            <View style={[styles.theme, { backgroundColor: '#005cb2' }]} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'AvenirNext-Bold',
  },
  settingContainer: {
    flexDirection: 'row',
    paddingTop: 30,
  },
  level: {
    borderRadius: 15,
    width: width * 0.275,
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'AvenirNext-Bold',
    color: 'white',
  },
  theme: {
    width: 50,
    height: 50,
  },
};

export default Settings;
