import { AsyncStorage } from 'react-native';
import { apiPost, clearCache } from './api';


export const signIn = async (username, password, onSuccess, onFail, onError) => {
	let errorMsg;
	let user = await apiPost('api-token-auth', {'email_or_username': username, 'password': password}, true)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.non_field_errors)
				errorMsg = responseJson.non_field_errors[0];
			return responseJson.user;
		})
		.catch((error) => {
			return false;
		});
	if (user === false){
		onError();
	} else if (user) {
		await AsyncStorage.setItem('user', JSON.stringify(user));
		onSuccess();
	} else {
		onFail(errorMsg);
	}
};


export const signOut = async (callback) => {
	await AsyncStorage.removeItem('user');
	clearCache();
	callback();
};


export const signUp = async (params, onSuccess, onFail, onError) => {
	let created_id = await apiPost('api/v1/register', params, true)
		//.then((response) => response.text())
		//.then(text => console.log(text))
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			return responseJson.id;
		})
		.catch((error) => {
			return false;
		});
	if (created_id === false){
		onError();
	} else if (created_id) {
		onSuccess();
	} else {
		onFail();
	}
};
