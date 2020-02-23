import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Dimensions } from 'react-native';


export function getFillStatusString(fill) {
    if (fill.status == 'UNVERIFIED') {
        return 'На перевірці';
    } else if (fill.status == 'ACCEPTED') {
        return 'Виконано';
    } else if (fill.status == 'REJECTED') {
        return 'Відмова';
    } else {
        return 'Невідомо';
    }
}


export function getWithdrawStatusString(withdraw) {
    if (withdraw.done_at) {
        return 'Виконано';
    } else if (withdraw.rejected_at) {
        return 'Відмова';
    } else {
        return 'На опрацюванні';
    }
}


export function getUserTypeLabel(user) {
    if (user.user_type == 'DOCTOR') {
        return 'доктор';
    } else if (user.user_type == 'PHARMACIST') {
        return 'фармацевт';
    } else if (user.user_type == 'CLIENT') {
        return 'клієнт';
    } else {
        return '';
    }
}


export async function askPhotoPermissions(onSuccess, onFail) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted')
        return onFail();
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            return onFail();
        }
    }
    return onSuccess();
}


export function getViewport() {
    return {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
}


export function objArraysEqual(a, b) {
    return a.map(obj => obj.id.toString()).sort().join('') == b.map(obj => obj.id.toString()).sort().join('');
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export async function checkInternetConnection() {
    return fetch('https://clients3.google.com/generate_204')
        .then((response) => {
            console.log("checkInternetConnection", {isInternetReachable: response.status === 204})
            return {isInternetReachable: response.status === 204}
        })
        .catch(e => {
            console.log("checkInternetConnection", e)
            return false
        })
}
