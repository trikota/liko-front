import React from 'react';
import commonStyles from '../style/common';
import { getCacheExpired, getAllFillables, getAllFills } from '../utils/api';
import { getFillStatusString, objArraysEqual, getViewport } from '../utils/helpers';
import { Strong, P, H4, Button } from 'nachos-ui';
import { View, TouchableHighlight, Animated, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const fillablesCacheLife = 10 * 60 * 1000;
const fillsCacheLife = 24 * 60 * 60 * 1000;


class FillablesListItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      drawerHeight: new Animated.Value(0),
      drawerOpened: false
    }
  }

  toggleDrawer(){
    if(this.state.drawerOpened){
      Animated.timing(this.state.drawerHeight, {
        toValue: 0,
        duration: 100
      }).start(() => this.setState({drawerOpened: false}));
    }else{
      this.setState({drawerOpened: true})
      Animated.timing(this.state.drawerHeight, {
        toValue: 50,
        duration: 100
      }).start();
    }
  }

  render () {
    //const [fillable, onChangeFillable] = React.useState(undefined);
    const props = this.props;
    const viewport = getViewport();

    const fillable = props.fillable;
    const fill = props.fill;
    let tileIcon;
    if(!props.showFills) {
      tileIcon = <Image source={fillable.is_photo_fillable ?
                                  require("../assets/images/btn_icons/photo.png")
                                  : require("../assets/images/btn_icons/task.png")}
                    style={{height: 40, width: 40, alignSelf: 'flex-start'}}/>;
    } else if (fill.status == 'UNVERIFIED') {
      tileIcon = <Icon name={"md-hourglass"}  size={40} color="#ff9c00" />;
    } else if (fill.status == 'ACCEPTED') {
      tileIcon = <Icon name={"md-checkmark"}  size={40} color="#000" />;
    } else if (fill.status == 'REJECTED') {
      tileIcon = <Icon name={"md-close"}  size={40} color="#000" />;
    } else {
      tileIcon = <Icon name={"md-help"}  size={40} color="#000" />;
    }

    return ( // 70, 0
        <Animated.View style={[{height: Animated.add(this.state.drawerHeight, 70)}]}>
            <TouchableHighlight underlayColor='#eee'
                    onPress={() => {
                      if(!props.showFills){
                        this.toggleDrawer();
                      }
                        
                    }}
                    style={[commonStyles.p15, {paddingHorizontal: 40}]}
                    id={"fillable_tile_" + fillable.id}
                    key={"fillable_tile_" + fillable.id}>
                <>
                  <Animated.View style={[commonStyles.horizontalFlex, {paddingBottom: this.state.drawerHeight}]}>
                      <View style={[{width: 40}]}>
                          <View style={[commonStyles.verticalCenter]}>
                              {tileIcon}
                          </View>
                      </View>
                      <View style={[{width: viewport.width - 80 * 2, paddingHorizontal: 10}]}>
                          <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                              <P style={{fontWeight: 'normal', paddingVertical: 0, fontSize: 16}}
                                  numberOfLines={2} ellipsizeMode='tail'>{fillable.name}</P>
                              <P style={{ paddingVertical: 0, textAlign: 'left'}}
                                      numberOfLines={1} ellipsizeMode='tail'>
                                  {props.showFills ? getFillStatusString(fill) : "Переказ на карту"}  
                              </P>
                          </View>
                      </View>
                      <View style={[{width: 40}]}>
                          <View style={[commonStyles.verticalCenter]}>
                              <H4 style={{paddingVertical: 0}}>
                                  {fillable.bonus_amount.toFixed(1)}
                              </H4>
                          </View>
                      </View>
                  </Animated.View>
                  {(this.state.drawerOpened) ? (
                    <Animated.View style={[commonStyles.horizontalFlex,
                                           {position: 'absolute', bottom: 0, left: 40,
                                            height: 60, width: viewport.width - 80,
                                            opacity: Animated.divide(this.state.drawerHeight, 50)}]}> 
                        <View style={[commonStyles.horizontalFlex]}>
                          <View style={[{width: 40}]}>
    
                          </View>
                          <View style={[{width: viewport.width - 80 * 2, paddingHorizontal: 10}]}>
                              <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                                  <P style={{paddingVertical: 0}}
                                      numberOfLines={3} ellipsizeMode='tail'>{fillable.description}</P>
                              </View>
                          </View>
                          <View style={[{width: 40}]}>
                              <View style={[commonStyles.verticalCenter]}>
                                  <TouchableOpacity onPress={() => props.navigation.navigate('Fill', {fillable: fillable})}>
                                    <Image source={require("../assets/images/btn_icons/task.png")}
                                      style={{height: 40, width: 40, alignSelf: 'flex-start'}}/>
                                  </TouchableOpacity>
                              </View>
                          </View>
                      </View>
                    </Animated.View>
                  ) : null}
                  
                </>
            </TouchableHighlight>
        </Animated.View>
    );
  }
}


function FillablesList(props) {
  const [allFillables, onChangeAllFillables] = React.useState(undefined);
  const [allFills, onChangeAllFills] = React.useState(undefined);
  const [scrollY, onChangeScrollY] = React.useState(0);

  getAllFills(fillsCacheLife).then((fs) => {
    if (getCacheExpired('fills', fillsCacheLife) || (typeof(allFills) == 'undefined'))
      onChangeAllFills(fs);
    else if (allFills){
      if (!objArraysEqual(allFills, fs))
        onChangeAllFills(fs);
    }
  });
  const fillablesExpired = getCacheExpired('fillables', fillablesCacheLife);
  getAllFillables(fillablesCacheLife).then((fs) => {
    if((typeof(allFillables) == 'undefined') || fillablesExpired)
      onChangeAllFillables(fs);
    else if (!objArraysEqual(allFillables, fs))
      onChangeAllFillables(fs);
  });

  let displayFillables = allFillables;
  const fillsByFillableId = {};
  if(allFills && displayFillables){
    for(let i=0;i<allFills.length;i++)
      if(allFills[i].fillable)
        fillsByFillableId[allFills[i].fillable.id] = allFills[i];
    displayFillables = displayFillables.filter(
      fillable => (props.showFills) ? (typeof(fillsByFillableId[fillable.id]) !== 'undefined')
                                      : (typeof(fillsByFillableId[fillable.id]) === 'undefined'));
    if(props.showFills)
      for(let i=0;i<allFills.length;i++)
        if(!allFills[i].fillable){
          fillsByFillableId['fill_' + allFills[i].id] = allFills[i];
          displayFillables.push({id: 'fill_' + allFills[i].id, name: 'Видалене завдання', bonus_amount: allFills[i].bonus_amount})
        }
  }
  if(!displayFillables)
    displayFillables = [];
  displayFillables.sort((a,b) => -(a.id - b.id));
  if(props.limit)
    displayFillables = displayFillables.slice(0, props.limit);
  const content = displayFillables.map(
    (fillable) => <FillablesListItem fillable={fillable}
                      key={fillable.id}
                      fill={fillsByFillableId[fillable.id]}
                      {...props}/>);
  return (
      <ScrollView contentContainerStyle={[commonStyles.width100, commonStyles.verticalTop,]}
              scrollEnabled={(!props.disableScroll)}>
          {content}
      </ScrollView>
  );
}

export default FillablesList;
