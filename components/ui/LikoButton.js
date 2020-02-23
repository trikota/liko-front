
import React from 'react';
import { View, Animated } from 'react-native';
import { Button } from 'nachos-ui';
import { LinearGradient } from 'expo-linear-gradient';

import commonStyles from '../../style/common';
import styleConstants from '../../style/constants';


const defaultProps = {
  kind: 'rounded',
  uppercase: false,
  gradientBackground: false,
  backgroundColor: styleConstants.primaryBlue,
};



class LikoButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isPressed: false,
      pressedState: new Animated.Value(0),
    }
  }

  render() {
    let mergedProps = {};
    const props = this.props;

    Object.assign(mergedProps, defaultProps, props)

    return (
      <View style={{flex: 1}}>
        {
          mergedProps.gradientBackground ? (
            <LinearGradient
                colors={[styleConstants.primaryPink, styleConstants.primaryBlue]}
                start={styleConstants.gradientStart}
                end={styleConstants.gradientEnd}
                locations={styleConstants.gradientLocations}
                style={{position: "absolute", top: 0, left: 1, borderRadius: 25,
                        height: 50, width: "100%", opacity: 1}}>
            </LinearGradient>
          ) : (
            <Animated.View
                style={{position: "absolute", top: 0, left: 1, borderRadius: 25,
                        height: 50, width: "100%", backgroundColor: mergedProps.backgroundColor,
                        opacity: this.state.pressedState}}>
            </Animated.View>
          )
        }
        <Button
            style={[commonStyles.buttonBase,
                    (mergedProps.gradientBackground ? {borderWidth: 0} : {}),
                    ...(props.style ? props.style : [])]}
            textStyle={[{fontSize: 22, fontWeight: 'normal',
                         color: (this.state.isPressed || mergedProps.gradientBackground) ? "#fff" : "#555"},
                        ...(props.textStyle ? props.textStyle : []),]}
            {...mergedProps}
            onPressIn={
              () => {
                this.setState({isPressed: true});
                Animated.timing(this.state.pressedState, {
                  toValue: 1,
                  duration: 80
                }).start()
              }
            }
            onPressOut={
              () => {
                this.setState({isPressed: false});
                Animated.timing(this.state.pressedState, {
                  toValue: 0,
                  duration: 80
                }).start()
              }
            }
            >
          {props.label}
        </Button>
      </View>
    )
  }
}

export default LikoButton;
