import { StackNavigator } from 'react-navigation';

import MainScreen from './MainScreen';
import AddScreen from './AddScreen';
import SubstractScreen from './SubstractScreen';
import Settings from './Settings';

export const Screens = StackNavigator({
  MainScreen: {
    screen: MainScreen,
    navigationOptions: (props) => ({
      header: null,
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: (props) => ({
      header: null,
    }),
  },
  AddScreen: {
    screen: AddScreen,
    navigationOptions: (props) => ({
      header: null,
    }),
  },
  SubstractScreen: {
    screen: SubstractScreen,
    navigationOptions: (props) => ({
      header: null,
    }),
  },
});
