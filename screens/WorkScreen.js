import React from 'react';
import { View, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper'

import HomeScreen from './HomeScreen';
import AcheivementsScreen from './AcheivementsScreen';


export default function WorkScreen(props) {
  /*
    <Swiper showsButtons={false} loop={false} paginationStyle={{bottom: null, top: 40}}
        index={1} dotColor='rgba(255,255,255,0.3)' activeDotColor='rgba(255,255,255,0.9)'>
      <AcheivementsScreen />
      <>
        
      </>
    </Swiper>
    */
  return (
    <HomeScreen navigation={props.navigation}/>
  );
}

WorkScreen.headerMode= 'none';
WorkScreen.navigationOptions = {
  header: null,
  headerShown: false,
};
