import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Screens } from './src/screens/router';

export default class App extends Component {
  async componentWillMount() {
    try {
      const value = await AsyncStorage.getItem('settings');
      if (value === null) {
        // We have data!!
        const settings = {
          difficulty: 'Easy',
          questions: 10,
          themeColor: 'purple',
        };

        await AsyncStorage.setItem('settings', JSON.stringify(settings));
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    return (
      <Screens />
    );
  }
}
