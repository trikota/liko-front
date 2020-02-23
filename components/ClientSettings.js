import React from 'react';
import commonStyles from '../style/common';
import { submitVerifyEmail } from '../utils/api';
import { validateEmail } from '../utils/helpers';
import { P, H4, H2, Button, Input } from 'nachos-ui';
import { View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


function ClientSettings(props) {
  const [verifyEmail, onChangeVerifyEmail] = React.useState('');

  return (
    <>
      <H2 style={[commonStyles.textLeft, {paddingVertical: 0, paddingLeft: 10}]}>
        Клієнтy Phares
      </H2>
      <Input style={[commonStyles.width100, commonStyles.textCenter]}
        onChangeText={onChangeVerifyEmail}
        placeholder="Email користувача"
        autoCapitalize = 'none'
        value={verifyEmail}/>
      <View>
        <Button kind='squared' type='naked'
            onPress={() => {
              if(!validateEmail(verifyEmail))
                return Alert.alert('Помилка', 'Некоректний email');
                submitVerifyEmail(verifyEmail).then(
                (resp) => {
                  if(resp.success){
                    return Alert.alert('Активовано', 'Користувач може користуватись аккаутом')
                  }
                  
                  let errorMsg;
                  if (resp.detail)
                    errorMsg = resp.detail;
                  else if(resp.non_field_errors)
                    errorMsg = resp.non_field_errors[0];

                  if(errorMsg == 'Not found.'){
                    return Alert.alert(
                      'Email не знайдено в базі',
                      'Перевірте, що користувач пройшов регістрацію за наданою адресою')
                  }else if(errorMsg == 'already verified'){
                    return Alert.alert('Уже активовано', 'Аккаунт можна активувати лише один раз')
                  }else{
                    return Alert.alert('Помилка', 'Щось пішло не так :(')
                  }
                }
              );
            }}>
          Активувати аккаунт
        </Button>
      </View>
    </>
  );
}

export default ClientSettings;
