import React from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Dimensions, TouchableHighlight } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Input, Button, Switcher, SegmentedControlButton, Strong, P } from 'nachos-ui';
import RNPickerSelect from 'react-native-picker-select';

import commonStyles from '../style/common'
import styleConstants from '../style/constants'
import { signUp } from '../utils/auth'
import { validateEmail } from '../utils/helpers'
import { getRegions, getCityWorkPlaces, getSpecializations } from '../utils/api'
import LikoButton from '../components/ui/LikoButton'


function filterLocations(allLocations, queryValue){
	if(queryValue.length == 0){
		return allLocations.slice(0, 5);
	} else {
		return allLocations.filter(location => (
			location.name_ua.toLowerCase().includes(queryValue.toLowerCase())
		)).slice(0, 5);
	}
}

function validatePhone(phone) {
    var re = /^\d\d\d\d\d\d\d\d\d\d$/;
    return re.test(String(phone).toLowerCase());
}

function validatePassword(pw) {
    return pw.length >= 8;
}

function sendForm(firstNameValue, lastNameValue, fatherNameValue,
		emailValue, passwordValue, phoneValue, secondaryPhoneValue,
		userTypeValue, experienceValue, specValue, cityValue,
		placeValue, placeQueryValue, positionValue, educationValue, customInfoValue,
		navigation) {
	if(!firstNameValue)
		return Alert.alert('Помилка в даних', 'Вкажіть правильне ім\'я');
	if(!lastNameValue)
		return Alert.alert('Помилка в даних', 'Вкажіть правильне прізвище');
	if(!fatherNameValue)
		return Alert.alert('Помилка в даних', 'Вкажіть правильне ім\'я по батькові');
	if(!validateEmail(emailValue))
		return Alert.alert('Помилка в даних', 'Вкажіть правильний email');
	if(!validatePassword(passwordValue))
		return Alert.alert('Помилка в даних', 'Пароль має складатись з якнайменш 8 символів');
	if(!validatePhone(phoneValue))
		return Alert.alert('Помилка в даних', 'Вкажіть правильний телефон');
	if(secondaryPhoneValue)
		if(!validatePhone(secondaryPhoneValue))
			return Alert.alert('Помилка в даних', 'Вкажіть правильний телефон');
	if(['DOCTOR', 'PHARMACIST'].indexOf(userTypeValue) === -1)
		return Alert.alert('Помилка в даних', 'Вкажіть професію');
	if(!experienceValue)
		return Alert.alert('Помилка в даних', 'Вкажіть досвід роботи');
	if((userTypeValue == 'DOCTOR') && !specValue)
		return Alert.alert('Помилка в даних', 'Вкажіть спеціалізацію');
	if(!cityValue)
		return Alert.alert('Помилка в даних', 'Вкажіть місто, де працюєте');
	if((!placeValue) && (!placeQueryValue))
		return Alert.alert('Помилка в даних', 'Вкажіть адресу місця роботи');
	if(!positionValue)
		return Alert.alert('Помилка в даних', 'Вкажіть посаду');

	params = {
		first_name: firstNameValue, last_name: lastNameValue, father_name: fatherNameValue,
		email: emailValue, password: passwordValue, phone: phoneValue, secondary_phone: secondaryPhoneValue,
		user_type: userTypeValue, experience: experienceValue,
		city: cityValue.id, position: positionValue, education: educationValue, custom_info: customInfoValue
	}
	if(userTypeValue == 'DOCTOR')
		params['specialization'] = specValue.id;
	if(placeValue){
		params['work_place'] = placeValue.id;
	} else {
		params['custom_work_place'] = placeQueryValue;
	}
	signUp(params,
		() => {
			// success
			Alert.alert(
				'Реєстрація успішна!',
				'Для активації аккаунта зверніться до представника фармацевтичної компанії-партнера Phares або до служби підтримки Phares');
			navigation.navigate('SignIn');
		},
		() => {
			// fail
			Alert.alert('Не вдалось створити аккаунт', 'Перевірте введені дані');
		},
		() => {
			// error
			Alert.alert('Не вдалось створити аккаунт', 'Перевірте введені дані та підключення до мережі');
		},

		)
}

const RegisterScreen = (props) => {
	const [emailValue, onChangeEmail] = React.useState('');
	const [firstNameValue, onChangeFirstName] = React.useState('');
	const [lastNameValue, onChangeLastName] = React.useState('');
	const [fatherNameValue, onChangeFatherName] = React.useState('');
	const [passwordValue, onChangePassword] = React.useState('');
	const [phoneValue, onChangePhone] = React.useState('');
	const [secondaryPhoneValue, onChangeSecondaryPhone] = React.useState('');
	const [userTypeValue, onChangeUserType] = React.useState(undefined);
	const [experienceValue, onChangeExperience] = React.useState(undefined);
	const [educationValue, onChangeEducation] = React.useState('');
	const [customInfoValue, onChangeCustomInfo] = React.useState('');
	const [positionValue, onChangePosition] = React.useState('');
	
	const [allSpecs, onChangeAllSpecs] = React.useState(undefined);
	const [specValue, onChangeSpecValue] = React.useState(undefined);
	if(typeof(allSpecs) == 'undefined')
		getSpecializations().then(onChangeAllSpecs);

	// regions
	const [regionValue, onChangeRegion] = React.useState(undefined);
	const [regionQueryValue, onChangeRegionQuery] = React.useState('');
	const [regionQueryFocused, onChangeRegionQueryFocused] = React.useState(false);
	const [allRegions, onChangeAllRegions] = React.useState(undefined);
	let filteredRegions = [];
	if(typeof(allRegions) == 'undefined')
		getRegions().then(onChangeAllRegions);
	else{
		filteredRegions = filterLocations(allRegions, regionQueryValue);
	}
	// cities
	const [cityValue, onChangeCity] = React.useState(undefined);
	const [cityQueryValue, onChangeCityQuery] = React.useState('');
	const [cityQueryFocused, onChangeCityQueryFocused] = React.useState(false);
	let filteredCities = [];
	if(regionValue){
		let allCities = regionValue.region_cities;
		if (allCities){
			filteredCities = filterLocations(allCities, cityQueryValue);
		}
	}
	// work places
	const [placeValue, onChangePlace] = React.useState(undefined);
	const [placeQueryValue, onChangePlaceQuery] = React.useState('');
	const [placeQueryFocused, onChangePlaceQueryFocused] = React.useState(false);
	const [allCityPlaces, onChangeAllCityPlaces] = React.useState([]);
	let filteredPlaces = [];
	if (typeof(cityValue) != 'undefined'){
		getCityWorkPlaces(cityValue.id).then(onChangeAllCityPlaces);
	} else {
		if (typeof(placeValue) != 'undefined')
			onChangePlace(undefined);
		if (placeQueryValue != '')
			onChangePlaceQuery('');
		if (placeQueryFocused)
			onChangePlaceQueryFocused(false);
		if (allCityPlaces.length)
			onChangeAllCityPlaces([]);
	}
	if(allCityPlaces){
		filteredPlaces = filterLocations(allCityPlaces, placeQueryValue)
			.filter(place => place.work_place_type == {DOCTOR: "HOSPITAL", PHARMACIST: "PHARMACY"}[userTypeValue]);
	}
	
	var width = Dimensions.get('window').width; //full width
	var height = Dimensions.get('window').height; //full height

	const specSelect = ((userTypeValue == 'DOCTOR') && (typeof(allSpecs) != 'undefined')) ? (
		<>
			<Strong style={[commonStyles.mt5]}>Спеціалізація</Strong>
			<RNPickerSelect
				value={specValue}
				onValueChange={onChangeSpecValue}
				items={
					allSpecs.map(spec => ({ label: spec.name_ua, value: spec }))
				}
				placeholder={{label: "Оберіть зі списку", value: null}}
			/>
		</>
	) : null;

	return (
		<View style={[commonStyles.verticalTop, {paddingTop: 0}]}>
			<KeyboardAvoidingView style={[commonStyles.verticalTop]}
					behavior="padding" enabled>
				<ScrollView style={[{width: width, paddingHorizontal: 15}]}>
					<View style={{paddingBottom: 100, paddingTop: 30}}>
						<Input style={[commonStyles.width100, commonStyles.textCenter,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangeFirstName(text)}
							placeholder="Ім'я"
							value={firstNameValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangeLastName(text)}
							placeholder="Прізвище"
							value={lastNameValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangeFatherName(text)}
							placeholder="По батькові"
							value={fatherNameValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangeEmail(text)}
							placeholder="Email"
							keyboardType="email-address"
							autoCapitalize = 'none'
							value={emailValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangePassword(text)}
							placeholder="Пароль"
							secureTextEntry={true}
							autoCapitalize = 'none'
							value={passwordValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => (text.substr(0, 1) == '0' | text == '') ? onChangePhone(text.replace(/\D/g,'').substr(0, 10)): undefined}
							placeholder="Телефон (0671234567)"
							keyboardType="number-pad"
							value={phoneValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => (text.substr(0, 1) == '0' | text == '') ? onChangeSecondaryPhone(text.replace(/\D/g,'').substr(0, 10)): undefined}
							placeholder="Додатковий телефон (0671234567)"
							keyboardType="number-pad"
							value={secondaryPhoneValue}/>
						<Switcher style={[commonStyles.mt5]}
								onChange={(value) => {onChangeUserType(value); onChangePlace(undefined); onChangePlaceQuery('')}}
								value={userTypeValue} direction='row'>
							<SegmentedControlButton value='DOCTOR' text='Лікар'/>
							<SegmentedControlButton value='PHARMACIST' text='Фармацевт'/>
						</Switcher>
						<Strong style={[commonStyles.mt5]}>Років досвіду</Strong>
						<Switcher style={[commonStyles.mt5]}
								onChange={onChangeExperience} value={experienceValue} direction='row'>
							<SegmentedControlButton value='LT_1Y' text='до 1'/>
							<SegmentedControlButton value='GT_1Y_LT_3Y' text='1 - 3'/>
							<SegmentedControlButton value='GT_3Y_LT_5Y' text='3 - 5'/>
							<SegmentedControlButton value='GT_5Y_LT_10Y' text='5 - 10'/>
							<SegmentedControlButton value='GT_10Y' text='10+'/>
						</Switcher>
						{specSelect}
						<Strong style={[commonStyles.mt5]}>Місце роботи</Strong>
						<Autocomplete
							autoCapitalize="none"
							autoCorrect={false}
							containerStyle={[{flex: 1, zIndex: 3}, commonStyles.mt5]}
							hideResults={!regionQueryFocused}
							data={regionQueryFocused ? filteredRegions : []}
							defaultValue={regionQueryValue}
							value={regionQueryValue}
							keyExtractor={(item, i) => item.id.toString()}
							renderTextInput={
								props => {
									let copy = Object.assign({}, props);
									delete copy.style;
									if(typeof(userTypeValue) == 'undefined')
										copy['disabled'] = true;
									return <Input {...copy} style={[commonStyles.inputBlueUnderline]}/>;
								}
							}
							inputContainerStyle={{borderWidth: 0}}
							onChangeText={text => onChangeRegionQuery(text)}
							onFocus={() => onChangeRegionQueryFocused(true)}
							onBlur={() => onChangeRegionQueryFocused(false)}
							placeholder="Область"
							renderItem={({ item, i }) => (
								<TouchableHighlight onPress={() => {if(item.name_ua != regionQueryValue){
																		onChangeCity(undefined);
																		onChangeCityQuery('');
																	}															  
																    onChangeRegionQuery(item.name_ua);
																	onChangeRegion(item);
																	onChangeRegionQueryFocused(false);
																	}}
										id={'wp_region_' + item.name_ua}
										underlayColor={styleConstants.mildBlue}>
									<P style={[commonStyles.px15]}>{item.name_ua}</P>
								</TouchableHighlight>
							)}
							/>
						<Autocomplete
							autoCapitalize="none"
							autoCorrect={false}
							containerStyle={[{flex: 1, zIndex: 2}, commonStyles.mt5]}
							hideResults={!cityQueryFocused}
							data={cityQueryFocused ? filteredCities : []}
							defaultValue={cityQueryValue}
							value={cityQueryValue}
							keyExtractor={(item, i) => item.id.toString()}
							renderTextInput={
								props => {
									let copy = Object.assign({}, props);
									delete copy.style;
									if(!regionValue)
										copy['disabled'] = true;
									return <Input {...copy} style={[commonStyles.inputBlueUnderline]}/>
								}
							}
							inputContainerStyle={{borderWidth: 0}}
							onChangeText={text => {onChangeCityQuery(text); onChangeCity(undefined)}}
							onFocus={() => onChangeCityQueryFocused(true)}
							onBlur={() => onChangeCityQueryFocused(false)}
							placeholder="Місто"
							renderItem={({ item, i }) => (
								<TouchableHighlight onPress={() => {onChangeCityQuery(item.name_ua);
																	onChangeCity(item);
																	onChangeCityQueryFocused(false);
																	}}
										id={'wp_city_' + item.name_ua}
										underlayColor={styleConstants.mildBlue}>
									<P style={[commonStyles.px15]}>{item.name_ua}</P>
								</TouchableHighlight>
							)}
							/>
						<Autocomplete
							autoCapitalize="none"
							autoCorrect={false}
							containerStyle={[{flex: 1, zIndex: 1}, commonStyles.mt5]}
							hideResults={!placeQueryFocused}
							data={placeQueryFocused ? filteredPlaces : []}
							defaultValue={placeQueryValue}
							value={placeQueryValue}
							keyExtractor={(item, i) => item.id.toString()}
							renderTextInput={
								props => {
									let copy = Object.assign({}, props);
									delete copy.style;
									copy['disabled'] = typeof(cityValue) == 'undefined';
									return <Input {...copy} style={[commonStyles.inputBlueUnderline]}/>
								}
							}
							inputContainerStyle={{borderWidth: 0}}
							onChangeText={text => {onChangePlaceQuery(text); onChangePlace(undefined)}}
							onFocus={() => onChangePlaceQueryFocused(true)}
							onBlur={() => onChangePlaceQueryFocused(false)}
							placeholder="Адреса місця роботи"
							renderItem={({ item, i }) => (
								<TouchableHighlight onPress={() => {onChangePlaceQuery(item.name_ua);
																	onChangePlace(item);
																	onChangePlaceQueryFocused(false);
																	}}
										id={'wp_place_' + item.name_ua}
										underlayColor={styleConstants.mildBlue}>
									<P style={[commonStyles.px15]}>{item.name_ua}</P>
								</TouchableHighlight>
							)}
							/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
									   commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangePosition(text)}
							placeholder="Посада"
							value={positionValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5,
						               commonStyles.inputBlueUnderline]}
							onChangeText={text => onChangeEducation(text)}
							placeholder="Освіта"
							value={educationValue}/>
						<Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt15,
									   commonStyles.inputMultiline, {height: 100}]}
							onChangeText={text => onChangeCustomInfo(text)}
							placeholder="Додаткова інфомація (якщо є)"
							multiline={true}
							value={customInfoValue}/>
						<View style={[{height: 50}, commonStyles.textCenter, commonStyles.mt15, {flex: 1, flexDirection: "row"}]}>
							<LikoButton
									onPress={() => sendForm(
										firstNameValue, lastNameValue, fatherNameValue,
										emailValue, passwordValue, phoneValue, secondaryPhoneValue,
										userTypeValue, experienceValue, specValue, cityValue,
										placeValue, placeQueryValue, positionValue, educationValue, customInfoValue,
										props.navigation)}
									label="Реєстрація"/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

RegisterScreen.navigationOptions = {
	title: 'Реєстрація',
};

export default RegisterScreen;
