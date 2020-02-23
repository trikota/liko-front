import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import NoInternetScreen from '../screens/NoInternetScreen';





const AuthStack = createStackNavigator(
  {
    SignIn: {
      screen: SignInScreen,
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
        header: null
      },
    },
    Register: RegisterScreen
  },
  {
    
  }
);


const navigator = createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
    NoInternet: NoInternetScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  }
)

export default createAppContainer(
  navigator
);
