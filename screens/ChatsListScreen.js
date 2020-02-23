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
  Dimensions
} from 'react-native';
import { H4, P } from 'nachos-ui';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../style/common';
import { getAllCompanies } from '../utils/api';



class ChatsListScreen extends React.Component {
  static navigationOptions = {
    title: "Повідомлення",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    getAllCompanies().then((allCompanies) => {
      if(typeof(this.state.allCompanies) == 'undefined')
        this.setState({allCompanies});
    });

    if (!this.state.allCompanies)
      return (
        <View style={[commonStyles.verticalCenter]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    return (
      <ScrollView contentContainerStyle={[commonStyles.verticalTop, {backgroundColor: '#fff'}]}>
        {this.state.allCompanies
                   .filter(company => company.has_chat_operators)
                   .map((company) => {
          return (
            <View id={"company_tile_" + company.id}
                  key={"company_tile_" + company.id}>
                <TouchableHighlight underlayColor='#eee'
                        onPress={() => this.props.navigation.navigate('Chat', {company: company})}
                        style={[{height: 70}, commonStyles.p10]}>
                    
                      <View style={[commonStyles.horizontalFlex]}>
                          <View style={[{width: "20%"}]}>
                            <View style={[commonStyles.verticalCenter]}>
                              <Image source={{uri: company.logo}}
                                  style={{height: 30, width: 30}}
                                  resizeMode='cover'/>
                            </View>
                          </View>
                          <View style={[{width: "70%"}]}>
                              <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                                  <P style={{fontWeight: 'bold', paddingVertical: 0, fontSize: 15}}>{company.name}</P>
                              </View>
                          </View>
                          <View style={[{width: "10%"}]}>
                              <View style={[commonStyles.horizontalCenter]}>
                                  <Icon name="md-mail" size={20} color="#777" />
                                  <P></P>
                              </View>
                          </View>
                      </View>
                </TouchableHighlight>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}


export default ChatsListScreen;
