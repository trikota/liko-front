import React from 'react';
import { Platform, View, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BottomTabBar from 'react-navigation-tabs/src/views/BottomTabBar';

import TabBarIcon from '../components/TabBarIcon';
import WorkScreen from '../screens/WorkScreen';
import FaqScreen from '../screens/FaqScreen';
import ChatsListScreen from '../screens/ChatsListScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FillScreen from '../screens/FillScreen';
import styleConstants from '../style/constants';
import logo from '../assets/images/icon.png'; 


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const WorkStack = createStackNavigator(
  {
    Work: WorkScreen,
    Faq: FaqScreen,
    ChatsList: ChatsListScreen,
    Chat: ChatScreen,
    Fill: FillScreen,
  },
  config
);

WorkStack.navigationOptions = {
  //tabBarLabel: 'Робота',
  tabBarLabel: ({focused}) => (undefined),
  tabBarIcon: ({ focused }) => (
    <View style={{width: "100%", paddingLeft: 40}}>
      <Image source={require('../assets/images/btn_icons/task.png')}
        style={{width: 40, height: 40, opacity: focused ? 1 : 0.6}}
      />
    </View>
    
  ),
};

WorkStack.path = '';


const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  //tabBarLabel: 'Кабінет',
  tabBarLabel: ({focused}) => (undefined),
  tabBarIcon: ({ focused }) => (
    <View style={{width: "100%", paddingRight: 40, alignItems: 'flex-end'}}>
      <Image source={require('../assets/images/btn_icons/user.png')}
        style={{width: 40, height: 40, opacity: focused ? 1 : 0.6}}
      />
    </View>),
};

SettingsStack.path = '';


const tabNavigator = createBottomTabNavigator({
    WorkStack,
    SettingsStack,
  }, {
    tabBarOptions: {
      keyboardHidesTabBar: false,
    },
    tabBarComponent: (props) => (
      <View>
        <BottomTabBar {...props} style={{height: 60, borderTopWidth: 0}}/>
        <View style={{width: "100%", paddingHorizontal: 40,
                      position: "absolute", left: 40, top: 0}}>
          <View style={{width: "100%", height: 1, backgroundColor: styleConstants.primaryBlue,
                        position: "absolute", left: 0, top: 0}}/>
        </View>
        <Image style={{height: 80, width: 80,
                       position: "absolute", right: "50%", marginRight: -40, top: -10,
                       }}
            source={logo}/>
      </View>),
    style: {
      backgroundColor: '#000000ee',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 50,
      borderTopWidth: 0
    },
  });

tabNavigator.path = '';

export default tabNavigator;
