import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from "nachos-ui";

import styleConstants from './style/constants';
import AppNavigator from './navigation/AppNavigator';


console.disableYellowBox = true;



class App extends React.Component {

  state = {
    isLoadingComplete: false,
  }

  render() {
    const fonts = {
      //'Text': "myriad-regular",
      //'P': "myriad-lights",
      //'Button': "myriad-regular",
    }
    const branding = {
      // primaryLightColor: styleConstants.primaryBlue,
      primaryColor: styleConstants.primaryBlue,
    };
    const theme = {
      Input: {
        style: {
          base: {
            //borderWidth: 0,
            //borderBottomWidth: 1,
          },
          normal: {
            //borderColor: styleConstants.primaryBlue,
          },
        }
      },
      Button: {
        style: {
        }
      }
    };
    ['Text', 'Button'].map(col => {
      theme[col] = {
        props: {},
        style: {
          base: {
            fontFamily: fonts["Text"],
            fontSize: 14,
          },
          baseText: {
            fontFamily: fonts["Text"],
          },
        }
      }
    })
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <ThemeProvider theme={theme} branding={branding}>
          <AppLoading
            startAsync={loadResourcesAsync}
            onError={handleLoadingError}
            onFinish={() => this.setState({isLoadingComplete: true})}
          />
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme} branding={branding}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </View>
        </ThemeProvider>
      );
    }
  }

}

export default App;

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
      require('./assets/images/icon.png'),
      require('./assets/images/icon_512.png'),
      require('./assets/images/icon_noborders.png'),
      require('./assets/images/btn_icons/faq.png'),
      require('./assets/images/btn_icons/faq_white.png'),
      require('./assets/images/btn_icons/messages.png'),
      require('./assets/images/btn_icons/messages_white.png'),
      require('./assets/images/btn_icons/photo.png'),
      require('./assets/images/btn_icons/settings.png'),
      require('./assets/images/btn_icons/task.png'),
      require('./assets/images/btn_icons/user.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'myriad-regular': require('./assets/fonts/MyriadPro-Regular.otf'),
      'myriad-light': require('./assets/fonts/MyriadPro-Light.otf'),
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'Material Icons': require('./assets/fonts/MaterialIcons.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  Alert.alert('Помилка мережі', 'Спробуйте пізніше');
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
