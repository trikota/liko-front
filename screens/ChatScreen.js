import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, P } from 'nachos-ui';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../style/common';
import { sendMessage } from '../utils/api';
import { getViewport } from '../utils/helpers'
import LikoButton from '../components/ui/LikoButton'



class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('company').name
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      messageText: ""
    };
  }

  render() {
    const viewport = getViewport();
    const company = this.props.navigation.getParam('company');
    console.log(company)
    return (
      <ScrollView contentContainerStyle={[commonStyles.verticalCenter]}>
        <KeyboardAvoidingView style={[commonStyles.verticalCenter, {height: viewport.height, width: viewport.width, }]}
            behavior="position">
          <View style={[{width: viewport.width}]}>
            <View style={[{paddingHorizontal: 40}]}>
              <Image style={{height: "50%", width: viewport.width,
                             position: "absolute", top: "-60%", left: 0,
                             resizeMode: "contain"}}
                source={{uri: company.logo}}
                />
              <P style={[{fontSize: 22}, commonStyles.textCenter]}>{company.name}</P>
              <Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
                            commonStyles.inputMultiline, {height: 200}]}
                onChangeText={text => this.setState({messageText: text})}
                placeholder="" //"Текст повідомлення"
                value={this.state.messageText}
                multiline={true}
                autoFocus={true}
                />
              <View style={[commonStyles.textCenter,
                            {height: 50, marginTop: 30, paddingHorizontal: 40,
                             flex: 1, flexDirection: "row"}]}>
                <LikoButton
                    gradientBackground={true}
                    label="відправити"
                    textStyle={[{fontSize: 22, fontWeight: 'normal', color: "#fff"}]}
                    onPress={() => {
                      if(this.state.messageText.length < 10)
                        return Alert.alert('Занадто коротке повідомлення', 'Надайте більше інформації :)')
                      sendMessage(company, this.state.messageText).then(
                        response => {
                          if(response.success) {
                            Alert.alert('Повідомлення доставлено', "Представник компанії зв'яжеться з вами по телефону або email");
                            this.setState({messageText: ""});
                          } else {
                            Alert.alert('Помилка!', "Щось пішло не так. Повідомлення не доставлено");
                          }
                        }
                      );
                    }}/>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}


export default ChatScreen;
