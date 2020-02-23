import React from 'react';
import { View, Alert, KeyboardAvoidingView, Dimensions,
		 Image, ScrollView, StatusBar } from 'react-native';
import { Input, Button, A } from 'nachos-ui';

import commonStyles from '../style/common';
import { signIn } from '../utils/auth';
import logo_nb from '../assets/images/icon_noborders.png'; 
import styleConstants from '../style/constants';
import LikoButton from '../components/ui/LikoButton';



const SignInScreen = (props) => {
	const [emailValue, onChangeEmail] = React.useState('');
	const [passwordValue, onChangePassword] = React.useState('');
	
	var width = Dimensions.get('window').width; //full width
	var height = Dimensions.get('window').height; //full height

	return (
		<View style={[{width: width, height: height}]}>
      		<StatusBar barStyle="dark-content" />
			<KeyboardAvoidingView style={[{width: width, height: height}]}
					behavior="padding">
				<ScrollView contentContainerStyle={[{width: width, paddingHorizontal: 40},
							        				commonStyles.verticalCenter]}>
					<View style={[{maxHeight: 200}]}>
						<Image source={logo_nb}
							style={{width: 250, height: 200, resizeMode: 'contain'}}/>
					</View>
					<Input style={[commonStyles.width100, commonStyles.inputBlueUnderline,
								   {padding: 0, marginTop: 15}]}
						inputStyle={[{fontSize: 22}, commonStyles.textCenter]}
						onChangeText={text => onChangeEmail(text)}
						placeholder="email"
						keyboardType="email-address"
						autoCapitalize = 'none'
						value={emailValue}/>
					<Input style={[commonStyles.width100, commonStyles.mt5,
								   commonStyles.inputBlueUnderline]}
						inputStyle={[{fontSize: 22}, commonStyles.textCenter]}
						onChangeText={text => onChangePassword(text)}
						placeholder="пароль"
						secureTextEntry={true}
						autoCapitalize = 'none'
						value={passwordValue}/>
					<View style={[{maxHeight: 60, height: 60, width: 250, marginTop: 45}]}>
						<LikoButton
							onPress={() => signIn(
								emailValue, passwordValue,
								() => props.navigation.navigate('Main'),
								(errorMsg) => {
									if (errorMsg == 'not verified'){
										Alert.alert(
											'Не активований аккаунт',
											'Для активації зверніться до представника фармацевтичної компанії-партнера Phares'
											+ ' або до служби підтримки Phares')
									} else {
										Alert.alert('Не вдалось увійти', 'Спробуйте інший email або пароль')
									}
								},
								() => Alert.alert('Помилка мережі', 'Спробуйте пізніше'),
								
								)}
							label="вхід"/>
					</View>
					<View style={[commonStyles.mt5,
								  {maxHeight: 60, height: 60, width: 250}]}>
						<LikoButton style={[commonStyles.buttonBasePink]}
							backgroundColor={styleConstants.primaryPink}
							onPress={() => props.navigation.navigate('Register')}
							label="реєстрація"/>
					</View>	
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

SignInScreen.navigationOptions = {
	title: 'Авторизація',
};

export default SignInScreen;
