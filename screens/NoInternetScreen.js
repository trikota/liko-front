import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { P } from 'nachos-ui';

import commonStyles from '../style/common';
import { getViewport, checkInternetConnection } from '../utils/helpers';
import LikoButton from '../components/ui/LikoButton';


class NoInternetScreen extends React.Component {

  // Render any loading content that you like here
  render() {
    const viewport = getViewport();
    return (
      <View style={[commonStyles.verticalCenter,
                    {height: viewport.height, width: viewport.width,
                     paddingTop: viewport.height / 2 - 75}]}>
        <View style={[{height: 50}]}>
          <ActivityIndicator size="large" />
        </View>
        <View style={[{height: 50}]}>
          <P style={[commonStyles.textCenter]}>Погане з'єднання з інтернетом</P>
        </View>
        <View style={[{height: 50}, commonStyles.textCenter, commonStyles.mt15, {flex: 1, flexDirection: "row"}]}>
          <LikoButton
            onPress={() => {
              checkInternetConnection().then(state => {
                console.log('cis', state)
                const isInternetReachable = state ? (state.isInternetReachable) : false;
                if(isInternetReachable){
                  this.props.navigation.navigate('Work');
                }
              });
            }}
            label="перевірити"/>
          </View>
      </View>
    );
  }
}

export default NoInternetScreen;
