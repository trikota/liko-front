import React from 'react';
import { View, Alert, StatusBar, ScrollView } from 'react-native';
import { Button, H2, H5, H1, P, Switcher, SegmentedControlButton } from 'nachos-ui'
import commonStyles from '../style/common'
import { signOut } from '../utils/auth'
import { objArraysEqual, getUserTypeLabel } from '../utils/helpers'
import FillablesList from '../components/FillablesList'
import WithdrawsList from '../components/WithdrawsList'
import ClientSettings from '../components/ClientSettings'
import { getUser, getAllFills, getAllWithdraws, getCacheExpired,
    submitWithdraw, addWithdraw, getGlobals } from '../utils/api'
import Icon from 'react-native-vector-icons/Ionicons';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import { NavigationEvents } from 'react-navigation';


const fillsCacheLife = 24 * 60 * 60 * 1000;
const withdrawsCacheLife = 1 * 60 * 60 * 1000;
const globalsCacheLife = 1 * 60 * 60 * 1000;
const MIN_WITHDRAW_BALANCE = 5;

const SettingsScreen = (props) => {
  const [user, onChangeUser] = React.useState(undefined);
  const [cardInput, onChangeCardInput] = React.useState({});
  const [allFills, onChangeAllFills] = React.useState(undefined);
  const [allWithdraws, onChangeAllWithdraws] = React.useState(undefined);
  const [globals, onChangeGlobals] = React.useState(undefined);
  const [listSwitchValue, onChangeListSwitchValue] = React.useState('fills');
  const [_upd, _setForceUpdate] = React.useState(0);

  getAllFills(fillsCacheLife).then((fs) => {
    if (getCacheExpired('fills', fillsCacheLife) || (typeof(allFills) == 'undefined'))
      onChangeAllFills(fs);
    else if (allFills){
      if (!objArraysEqual(allFills, fs))
        onChangeAllFills(fs);
    }
  });
  getAllWithdraws(withdrawsCacheLife).then((ws) => {
    if (getCacheExpired('withdraws', withdrawsCacheLife) || (typeof(allWithdraws) == 'undefined'))
      onChangeAllWithdraws(ws);
    else if (allWithdraws){
      if (!objArraysEqual(allWithdraws, ws))
        onChangeAllWithdraws(ws);
    }
  });
  getGlobals(globalsCacheLife).then((gs) => {
    if (getCacheExpired('globals', globalsCacheLife) || (typeof(globals) == 'undefined'))
      onChangeGlobals(gs);
  });

  let balance = 0;
  let pending_balance = 0;
  if(allFills)
    for(let i=0;i<allFills.length;i++){
      if(allFills[i].status == 'ACCEPTED')
        balance += allFills[i].bonus_amount;
      else if(allFills[i].status == 'UNVERIFIED')
        pending_balance += allFills[i].bonus_amount;
    }
  if(allWithdraws)
    for(let i=0;i<allWithdraws.length;i++){
      if(!allWithdraws[i].rejected_at)
        balance -= allWithdraws[i].amount;
    }

  const is_production = globals ? globals.is_production : false;
  const currency = is_production ? "грн" : "балів";

  if(typeof(user) == 'undefined')
    getUser().then(onChangeUser);
  return (
    <ScrollView contentContainerStyle={[commonStyles.screenWrapper]}>
      <StatusBar barStyle="dark-content" />
      <NavigationEvents
          onDidFocus={payload => _setForceUpdate(_upd + 1)}/>
      <View style={[commonStyles.width100, {height: 75, flexDirection: "row"}]}>
        <View style={[commonStyles.horizontalCenter, {width: "25%"}]}>
          <Icon name="md-person" size={70}/>
        </View>
        <View style={[{width: "75%"}]}>
          <View style={[commonStyles.verticalCenter]}>
            <H2 style={[commonStyles.textCenter, {paddingVertical: 0}]}>
              {(user) ? (user.first_name + " " + user.last_name) : ""}
            </H2>
            <H5 style={[commonStyles.textCenter, {paddingVertical: 0}]}>
              {(user) ? getUserTypeLabel(user) : ""}
            </H5>
          </View>
        </View>
      </View>
      <View style={[{height: 50}, commonStyles.width100, {flexDirection: "row"}]}>
        <View style={{width: "25%"}}>
          <Button kind='squared' style={{backgroundColor: '#00000000'}}
              onPress={() => signOut(() => props.navigation.navigate('Auth'))}>
            Вийти
          </Button>
        </View>
        <View style={{width: "75%"}}>
          {/*<Button kind='squared' style={{backgroundColor: '#00000000'}}
                        onPress={() => console.log(1)}>
                      Змінити дані
            </Button>*/}
        </View>
      </View>
      {
        (user) ? (
            (user.user_type == 'CLIENT') ? <ClientSettings /> : (
              <>
                <H2 style={[commonStyles.textLeft, {paddingVertical: 0, paddingLeft: 10}]}>
                  На рахунку {balance.toFixed(1)} {currency} {(pending_balance) ? ("(+" + pending_balance.toFixed(1) + " " + currency + ")") : ""}
                </H2>
                {
                  is_production ? (
                    <>
                      <LiteCreditCardInput onChange={onChangeCardInput} autoFocus={false}
                      onlyNumber={true}/>
                      <View>
                        <Button kind='squared' type='naked' style={{marginLeft: 2.5}}
                            disabled={(cardInput.status || {}).number != 'valid'}
                            onPress={() => {
                              if((balance == 0) || (balance < MIN_WITHDRAW_BALANCE))
                                return Alert.alert('Недостатньо коштів', 'Мінімальна сума для виведення - ' + MIN_WITHDRAW_BALANCE + ' ' + currency)
                              console.log(cardInput.values.number.replace(/\s+/g, ''));
                              console.log(cardInput);
                              submitWithdraw(cardInput.values.number.replace(/\s+/g, '')).then(
                                (withdraw) => {
                                  if(withdraw.id){
                                    addWithdraw(withdraw);
                                    _setForceUpdate(_upd + 1);
                                    cardInput.values.number = '';
                                    onChangeCardInput(cardInput);
                                    Alert.alert('Запит відправлено', 'Наші оператори опрацюють заяку найближчим часом')
                                  }else{
                                    Alert.alert('Помилка', 'Щось пішло не так');
                                  }
                                }
                              );
                            }}>
                          Відправити на карту
                        </Button>
                      </View>
                    </>
                  ) : null
                }
                
              </>
            )) : <></>
      }
      <View style={[commonStyles.mt5]}>
        <Switcher
            onChange={onChangeListSwitchValue}
            defaultSelected={listSwitchValue}>
          <SegmentedControlButton value='fills' text='Завдання'/>
          <SegmentedControlButton value='withdraws' text='Операції'/>
        </Switcher>
      </View>
      {(listSwitchValue == 'fills') ? (
          <FillablesList navigation={props.navigation} showFills={true} limit={10} />
         ) : (
          <WithdrawsList navigation={props.navigation} limit={10} />
         )}

    </ScrollView>);
}

SettingsScreen.navigationOptions = {
  title: 'Ваш Кабінет',
};

export default SettingsScreen;
