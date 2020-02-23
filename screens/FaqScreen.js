import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View,
  Animated
} from 'react-native';
import { H4, P } from 'nachos-ui';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../style/common';
import { getAllFaqs } from '../utils/api';





class FaqItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedState: new Animated.Value(0),
    };
  }

  componentDidUpdate() {
    const nowOpened = this.props.openFaqId == this.props.faq.id;
    Animated.timing(this.state.openedState, {
      toValue: (nowOpened) ? 1 : 0,
      duration: 100
    }).start()
  }

  render() {
    const faq = this.props.faq;
    const openFaqId = this.props.openFaqId;

    const arrowSpin = this.state.openedState.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg']
    })
    
    return (
      <View>
          <TouchableHighlight underlayColor='#eee'
                  onPress={() => {
                    this.props.setOpenFaqId((openFaqId == faq.id) ? undefined : faq.id)
                  }}
                  style={[{height: 70}, commonStyles.p10]}>
                <View style={[commonStyles.horizontalFlex]}>
                    <Animated.View style={[{width: "10%", transform: [{rotate: arrowSpin}] }]}>
                        <View style={[commonStyles.verticalCenter]}>
                            <Icon name={"md-arrow-dropright"} size={25} />
                        </View>
                    </Animated.View>
                    <View style={[{width: "90%"}]}>
                        <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                            <P style={{fontWeight: 'bold', paddingVertical: 0}}>{faq.question_ua}</P>
                        </View>
                    </View>
                </View>
          </TouchableHighlight>
          {(openFaqId == faq.id) ? (
              <View style={[{paddingHorizontal: 10}]}>
                  <P style={{paddingVertical: 0, paddingLeft: "10%"}}>{faq.answer_ua}</P>
              </View>) : null}
          
      </View>
    )
  }
}


class FaqScreen extends React.Component {
  static navigationOptions = {
    title: "Часті Питання",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    getAllFaqs().then((allFaqs) => {
      if(typeof(this.state.allFaqs) == 'undefined')
        this.setState({allFaqs});
    });

    if (!this.state.allFaqs)
      return (
        <View style={[commonStyles.verticalCenter]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    return (
      <ScrollView contentContainerStyle={[commonStyles.verticalTop, {backgroundColor: '#fff'}]}>
        {this.state.allFaqs.map((faq) =>(
          <FaqItem faq={faq} setOpenFaqId={(id) => this.setState({openFaqId: id})}
            openFaqId={this.state.openFaqId}
            key={"faq_tile_" + faq.id}/>
        ))}
      </ScrollView>
    );
  }
}


export default FaqScreen;
