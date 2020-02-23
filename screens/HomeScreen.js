import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AppState,
  Animated,
  Linking
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { H4 } from 'nachos-ui';
import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import OnLayout from 'react-native-on-layout'
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import commonStyles from '../style/common';
import { objArraysEqual } from '../utils/helpers';
import { submitAnalytics, getAllAds, getCacheExpired } from '../utils/api';
import FillablesList from '../components/FillablesList';
import styleConstants from '../style/constants';


const adsCacheLife = 12 * 60 * 60 * 1000;


class HomeHeaderComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      adsOpacity: new Animated.Value(0)
    }
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const statusBarHeight = getStatusBarHeight();

    getAllAds(adsCacheLife).then((as) => {
      if (getCacheExpired('ads', adsCacheLife) || (typeof(this.state.allAds) == 'undefined'))
        this.setState({allAds: as});
      else if (this.state.allAds){
        if (!objArraysEqual(this.state.allAds, as))
          this.setState({allAds: as});
      }
    });

    if (this.props.drawerOpened) {
      Animated.timing(this.state.adsOpacity, {
        toValue: 0,
        duration: 700
      }).start();
    } else {
      Animated.timing(this.state.adsOpacity, {
        toValue: 1,
        duration: 700
      }).start();
    }

    return (
      <View style={[commonStyles.verticalCenter, {width: screenWidth}]}>
        <OnLayout>
          {({ width, height, x, y }) => {
              const panRatio = (height - screenHeight * 0.47) / (screenHeight * 0.1);
              return (
                <View style={[commonStyles.verticalCenter, {width: screenWidth, paddingBottom: 40}]}>
                  {(this.state.allAds) ? (
                    <Animated.View style={[{opacity: this.state.adsOpacity, width: screenWidth},
                                           commonStyles.shadow1]}>
                      <Carousel
                        //ref={c => this.adSliderRef = c}
                        data={this.state.allAds}
                        renderItem={({item, index}) => (
                          <TouchableOpacity style={[{padding: 5}]}
                              disabled={!item.url}
                              onPress={() => Linking.openURL(item.url)}
                              activeOpacity={0.75}>
                            <Image source={{uri: item.image}}
                              style={[{width: screenWidth * 0.8 - 10,
                                       height: screenWidth * 0.8 * 0.75 - 10,
                                       resizeMode: "cover",
                                       borderRadius: 15}]}/>
                          </TouchableOpacity>
                        )}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth * 0.8}
                        hasParallaxImages={false}
                        firstItem={0}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        // inactiveSlideShift={20}
                        containerCustomStyle={{marginTop: 0 * statusBarHeight, width: screenWidth}}
                        // contentContainerCustomStyle={styles.sliderContentContainer}

                        loop={true}
                        loopClonesPerSide={3}
                        autoplay={true}
                        autoplayDelay={500}
                        autoplayInterval={60000}
                        //onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                      />
                    </Animated.View>) : null}
              
                  <View style={[{height: 80, width: Dimensions.get('window').width,
                                  position: 'absolute', left:0, bottom: 0}]}>
                    <View style={[commonStyles.horizontalCenter,
                                  {width: Dimensions.get('window').width,
                                   paddingHorizontal: 35}]}>
                      <View style={[commonStyles.horizontalFlex]}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {this.props.navigation.navigate('Faq')}}
                          style={{
                              //borderWidth:1,
                              borderColor:'rgba(0,0,0,0.2)',
                              alignItems:'center',
                              justifyContent:'center',
                              width:50,
                              height:50,
                              //backgroundColor:'#000',
                              borderRadius:25,
                              textAlign: 'center',
                              alignSelf: 'stretch'
                            }}>
                          <Image source={require('../assets/images/btn_icons/faq_white.png')}
                            style={{width: 40, height: 40}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={[commonStyles.horizontalFlex,
                                    {alignItems: "flex-end", justifyContent: "flex-end"}]}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {this.props.navigation.navigate('ChatsList')}}
                          style={{
                              borderColor:'rgba(0,0,0,0.2)',
                              alignItems:'center',
                              justifyContent:'center',
                              width:50,
                              height:50,
                              borderRadius:30,
                              textAlign: 'center',
                              alignSelf: 'stretch'
                            }}>
                          <Image source={require('../assets/images/btn_icons/messages_white.png')}
                            style={{width: 40, height: 40}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {/*<View style={[{height: 20, width: Dimensions.get('window').width,
                                  position: 'absolute', left:0, bottom: 0,
                                  backgroundColor: '#fff'}]}>
                  </View>*/}
                </View>);
            }
          }
        </OnLayout>
        
      </View>);
  }
}

function HomeDrawerComponent(props) {
  const [_upd, _setForceUpdate] = React.useState(0);
  const screenWidth = Dimensions.get('window').width;
  return (
    <View style={[commonStyles.verticalTop]}>
      <View style={[{backgroundColor: "#fff", borderTopLeftRadius: 20,
                     borderTopRightRadius: 20, minWidth: screenWidth,
                     paddingTop: 15},
                    commonStyles.shadow1]}>
        <NavigationEvents
            onDidFocus={payload => _setForceUpdate(_upd + 1)}/>
        {/*
        <H4 style={[{ textAlign: 'center', color: '#888' }, commonStyles.width100]}>
          {props.showFills ? "Виконані завдання" : "Доступні завдання"}
        </H4>*/}
        {/*<Icon name={"md-filing"} size={25} color={props.showFills ? "#000" : "#777"}
          style={{position: "absolute", right: 15, top: 10}}
          onPress={() => props.onChangeShowFills(!props.showFills)}
  />*/}
        <View>
          <FillablesList navigation={props.navigation} showFills={props.showFills}
              disableScroll={!props.drawerOpened} />
        </View>
      </View>
    </View>
    );
}


class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      screenOpacity: new Animated.Value(0),
      showFills: false,
      appState: AppState.currentState
    };
    this.navigationOptions = {
      header: null,
      drawerOpened: true,
    };
  }

  componentDidMount() {
    this._drawer.close(() => {
      Animated.timing(this.state.screenOpacity, {
        toValue: 1,
        duration: 200
      }).start();
    });
    AppState.addEventListener('change', this._handleAppStateChange);
    submitAnalytics('enter');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // app is activated
      const now = Date.now();
      if(this.state.lastExit){
        if(Date.now() - this.state.lastExit > 1000 * 60 * 5){
          // after more than 5 minutes inactive
          submitAnalytics('enter');
        }
      }
    } else if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // app goes in background
      this.setState({lastExit: Date.now()});
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return (
      <LinearGradient
          colors={styleConstants.gradientColors}
          start={styleConstants.gradientStart}
          end={styleConstants.gradientEnd}
          locations={styleConstants.gradientLocations}
          style={[commonStyles.verticalTop]}> 
        <Animated.View style={{opacity: this.state.screenOpacity}}>
          <Drawer
              ref={(ref) => this._drawer = ref}
              content={<HomeDrawerComponent navigation={this.props.navigation}
                          showFills={this.state.showFills}
                          drawerOpened={this.state.drawerOpened}
                          onChangeShowFills={(v) => this.setState({showFills: v})} />}
              captureGestures={false}
              acceptTap={false}
              openDrawerOffset={0.2}
              closedDrawerOffset={0.3}
              panCloseMask={0.1}
              panThreshold={0.075}
              side='bottom'
              type='displace'
              initializeOpen={true}
              styles={{main: {backgroundColor: '#00000000'}
                      }}
              negotiatePan={true}
              onOpen={() => this.setState({drawerOpened: true})}
              onClose={() => this.setState({drawerOpened: false})}
              //tweenHandler={(ratio) => ({
              //    main: { paddingTop: 100 }
              //  })
              //}
              >
            <HomeHeaderComponent navigation={this.props.navigation}
                drawerOpened={this.state.drawerOpened}/>
          </Drawer>
        </Animated.View>
      </LinearGradient>);
  }
}


export default HomeScreen;
