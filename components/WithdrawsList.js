import React from 'react';
import commonStyles from '../style/common';
import { getCacheExpired, getAllWithdraws } from '../utils/api';
import { getWithdrawStatusString, objArraysEqual } from '../utils/helpers';
import { Strong, P, H4, Button } from 'nachos-ui';
import { View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const withdrawsCacheLife = 24 * 60 * 60 * 1000;


function getWithdrawListItem(withdraw, props) {
    let tileIcon;
    if (withdraw.done_at) {
      tileIcon = <Icon name={"md-checkmark"}  size={35} color="#000" />;
    } else if (withdraw.rejected_at) {
      tileIcon = <Icon name={"md-close"}  size={35} color="#000" />;
    } else {
      tileIcon = <Icon name={"md-hourglass"}  size={35} color="#ff9c00" />;
    }

    const formatDate = (dt) => {
      dt = dt.substr(0, 10).split('-');
      return dt[2] + '.' + dt[1] + '.' + dt[0];
    }

    console.log(new Date(withdraw.created_at));

    return (
        <TouchableHighlight underlayColor='#eee'
                onPress={() => {}}
                style={[{height: 70}, commonStyles.p10]}
                id={"withdraw_tile_" + withdraw.id}
                key={"withdraw_tile_" + withdraw.id}>
            <View style={[commonStyles.horizontalFlex]}>
                <View style={[{width: "15%"}]}>
                    <View style={[commonStyles.verticalCenter]}>
                        {tileIcon}
                    </View>
                </View>
                <View style={[{width: "70%"}]}>
                    <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                        <P style={{fontWeight: 'bold', paddingVertical: 0}}
                              numberOfLines={2} ellipsizeMode='tail'>
                            {formatDate(withdraw.created_at)}    *{withdraw.card_number.slice(withdraw.card_number.length - 4)}
                        </P>
                        <P style={{ paddingVertical: 0, textAlign: 'left'}}
                                numberOfLines={1} ellipsizeMode='tail'>
                            {getWithdrawStatusString(withdraw)}  
                        </P>
                    </View>
                </View>
                <View style={[{width: "15%"}]}>
                    <View style={[commonStyles.verticalCenter]}>
                        <H4 style={{paddingVertical: 0}}>
                            {withdraw.amount.toFixed(1)}
                        </H4>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}


function WithdrawsList(props) {
  const [allWithdraws, onChangeAllWithdraws] = React.useState(undefined);

  getAllWithdraws(withdrawsCacheLife).then((ws) => {
    if (getCacheExpired('withdraws', withdrawsCacheLife) || (typeof(allWithdraws) == 'undefined'))
      onChangeAllWithdraws(ws);
    else if (allWithdraws){
      if (!objArraysEqual(allWithdraws, ws))
        onChangeAllWithdraws(ws);
    }
  });

  let displayWithdraws = allWithdraws;
  if(!displayWithdraws)
  displayWithdraws = [];
  displayWithdraws.sort((a,b) => -(a.id - b.id));
  if(props.limit)
  displayWithdraws = displayWithdraws.slice(0, props.limit);
  return (
    <View contentContainerStyle={[commonStyles.width100, commonStyles.verticalTop,]}>
        {displayWithdraws.map(
            (withdraw) => getWithdrawListItem(withdraw, props))}
    </View>
  );
}

export default WithdrawsList;
