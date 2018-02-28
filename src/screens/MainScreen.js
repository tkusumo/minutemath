import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { orange, purple, pink, green, blue } from '../helpers/ThemeColors';

class MainScreen extends Component {
  state = {
    themeColor: {},
  };

  colorCallback = (color) => {
    this._setColor(color);
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ top: 30, right: 20, position: 'absolute' }}>
          <Ionicons
            name='md-settings'
            color={this.state.themeColor.icon}
            size={35}
            onPress={() => this.props.navigation.navigate('Settings', { callback: this.colorCallback })}
          />
        </View>
        <View>
          <Ionicons name='md-stopwatch' color={this.state.themeColor.icon} size={50} />
        </View>
        <View style={{ paddingBottom: 30 }}>
          <Text style={[styles.title, { color: this.state.themeColor.text }]}>Minute Math</Text>
        </View>
        <View style={[styles.boxContainer, { backgroundColor: this.state.themeColor.container }]}>
          <Ionicons
            name='md-add'
            size={80}
            color='white'
            onPress={() => this._handlePress('ADD')}
          />
        </View>
        <View style={styles.viewPadding} />
        <View style={[styles.boxContainer, { backgroundColor: this.state.themeColor.container }]}>
          <Ionicons
            name='md-remove'
            size={80} color='white'
            onPress={() => this._handlePress('SUBSTRACT')}
          />
        </View>
        <View style={styles.viewPadding} />
        <View style={[styles.boxContainer, { backgroundColor: this.state.themeColor.container }]}>
          <Ionicons name='ios-add-circle-outline' size={40} color='white' />
          <Ionicons name='ios-remove-circle-outline' size={40} color='white' />
        </View>
      </View>
    );
  }

  _handlePress = (operation) => {
    if (operation === 'ADD') {
      this.props.navigation.navigate('AddScreen');
    } else if (operation === 'SUBSTRACT') {
      this.props.navigation.navigate('SubstractScreen');
    }
  };
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainer: {
    width: 100,
    height: 100,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPadding: {
    padding: 10,
  },
  title: {
    fontSize: 38,
    fontFamily: 'AvenirNext-Bold',
  },
};

export default MainScreen;
