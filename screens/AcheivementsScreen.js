import React from 'react';
import commonStyles from '../style/common';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';


export default function AcheivementsScreen() {
  return (
    <LinearGradient style={[commonStyles.verticalCenter]}
        colors={['#BB7EB3', '#F9CB80', '#E85316']}
        start={[0, 0]} end={[3, 0]}
        locations={[0, 0.6, 1]}>
      <Text>Нагороди</Text>
    </LinearGradient>
  );
}


AcheivementsScreen.navigationOptions = {
  header: null,
};
