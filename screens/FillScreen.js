import React from 'react';
import { Button, H2, Input, P, Checkbox } from 'nachos-ui'
import { View, Alert, KeyboardAvoidingView, Dimensions, ActivityIndicator,
  TouchableOpacity, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { ProgressDialog } from 'react-native-simple-dialogs';


import commonStyles from '../style/common';
import { getFillable, submitFill, addFill, getGlobals, getCacheExpired } from '../utils/api';
import { askPhotoPermissions } from '../utils/helpers';


function getFillableQuestion(fillable, index){
  if(index >= fillable.fillable_questions.length)
    return;
  return fillable.fillable_questions[index];
}


function removeOtherAnswers(answerState, questionId, exceptKey) {
  for(let i=0;i<Object.keys(answerState).length;i++){
    const key = Object.keys(answerState)[i];
    if (key.startsWith(questionId) + '_'){
      if(key == exceptKey)
        continue;
      delete answerState[key];
    }
  }
}


const Body = (props) => {
  if (!props.started)
    return (
      <>
        <H2 style={[commonStyles.textCenter]}>{props.fillable.name}</H2>
        <P>{props.fillable.description}</P>
        <P>Від компанії: {props.fillable.companies[0].name}</P>
        <P>Винагорода: {props.fillable.bonus_amount.toFixed(1)} {props.globals.is_production ? "грн" : "балів"}</P>
      </>);
  if(props.finished)
    return (
      <>
        <H2 style={[commonStyles.textCenter]}>Дякуємо за виконане завдання!</H2>
        <P style={[commonStyles.textCenter]}>Ми перевіримо відповіді та передамо Вам винагороду</P>
        <Icon name={"md-paper-plane"} style={[commonStyles.textCenter, commonStyles.mt15]}
           size={100} color="#333" />
      </>);

  
  let custom_input;
  if(props.question.accepts_custom) {
    const custom_state_i =  props.question.id + '_custom';
    custom_input = (
      <View
          style={[{height: 60, paddingVertical: 10}]}
          id={[props.fillable.id, props.question.id, 'custom'].join("_")}
          key={[props.fillable.id, props.question.id, 'custom'].join("_")}
          >
        <View style={[commonStyles.horizontalFlex]}>
          <View style={[{width: "15%"}]}>
            <View style={[commonStyles.verticalCenter]}>
              <Checkbox checked={props.answerState[custom_state_i]}/>
            </View>
          </View>
          <View style={[{width: "85%"}]}>
            <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
              <Input style={[commonStyles.width100, commonStyles.textCenter, commonStyles.mt5, {height: 50}]}
                onChangeText={text => {
                  if(props.question.accepts_single_answer)
                    removeOtherAnswers(props.answerState, props.question.id, custom_state_i);
                  props.answerState[custom_state_i] = text;
                  props.onChangeAnswerState(props.answerState);
                  props.onChangeForceUpdate(!props.forceUpdate);
                }}
                placeholder="Свій варіант відповіді"
                value={props.answerState[custom_state_i]}/>
            </View>
          </View>
        </View>
      </View>);
  }

  if(props.question.expects_photo){
    var width = Dimensions.get('window').width; //full width
    const state_i = props.question.id + '_photo';
    return (
      <>
        <H2 style={[commonStyles.textCenter]}>{props.question.text}</H2>
        <TouchableOpacity activeOpacity={0.8}
            onPress={() => {
              askPhotoPermissions(
                () => {
                  Alert.alert(
                    'Прикріпити фото',
                    '',
                    [
                      {text: 'Відміна', onPress: () => {},
                       style: 'cancel',},
                      {
                        text: 'Галерея',
                        onPress: async () => {
                          const {base64} = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: false,
                            base64: true
                          });
                          if(base64){
                            props.answerState[state_i] = base64;
                            props.onChangeAnswerState(props.answerState);
                            props.onChangeForceUpdate(!props.forceUpdate);
                          }
                        },
                      },
                      {text: 'Камера',
                       onPress: async() => {
                        const {base64} = await ImagePicker.launchCameraAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: false,
                          base64: true
                        });
                        if(base64){
                          props.answerState[state_i] = base64;
                          props.onChangeAnswerState(props.answerState);
                          props.onChangeForceUpdate(!props.forceUpdate);
                        }
                      }},
                    ],
                    {cancelable: false},
                  );
                },
                () => {
                  Alert.alert('Немає доступу до камери',
                              'Будь ласка, надайте програмі доступ до камери і галереї'
                              + ((Constants.platform.ios) ? "\nВ налаштуваннях пристрою" : ""));
                })
              return false;
            }}
            id={[props.fillable.id, props.question.id, 'photo'].join("_")}
            key={[props.fillable.id, props.question.id, 'photo'].join("_")}
            >
          {(props.answerState[state_i]) ?
              (
                <View style={[{width: width, height: width, paddingRight: 30}]} >
                  <View style={[commonStyles.horizontalFlex]}>
                    <Image source={{uri: 'data:image/jpeg;base64,' + props.answerState[state_i]}}
                      resizeMode='contain'
                      style={[{flex: 1}]} />
                  </View>
                </View>)
              : (<Icon name={"md-camera"} style={[commonStyles.textCenter, commonStyles.mt15]}
                  size={100} color="#333" />)}
        </TouchableOpacity>
      </>
    );
  }else
    return (
      <>
        <H2 style={[commonStyles.textCenter]}>{props.question.text}</H2>
        {props.question.question_answer_options.map((option) => {
          const state_i = props.question.id + '_' + option.id
          return (
            <TouchableOpacity activeOpacity={0.8}
                onPress={() => {
                  if(props.question.accepts_single_answer)
                    removeOtherAnswers(props.answerState, props.question.id, state_i);
                  props.answerState[state_i] = !props.answerState[state_i];
                  props.onChangeAnswerState(props.answerState);
                  props.onChangeForceUpdate(!props.forceUpdate);
                  return false;
                }}
                style={[{height: 60, paddingVertical: 10}]}
                id={[props.fillable.id, props.question.id, option.id].join("_")}
                key={[props.fillable.id, props.question.id, option.id].join("_")}
                >
              <View style={[commonStyles.horizontalFlex]}>
                <View style={[{width: "15%"}]}>
                  <View style={[commonStyles.verticalCenter]}>
                    <Checkbox checked={props.answerState[state_i] ? true : false}
                      onValueChange={(v) => {
                        props.answerState[state_i] = v;
                        props.onChangeAnswerState(props.answerState);
                        props.onChangeForceUpdate(!props.forceUpdate);
                      }}/>
                  </View>
                </View>
                <View style={[{width: "85%"}]}>
                  <View style={[commonStyles.verticalCenter, {alignItems: 'flex-start'}]}>
                    <P style={{fontWeight: 'bold', paddingVertical: 0}}>{option.text}</P>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
        )})}
        {custom_input}
      </>);
}


function answerStateToParam(answerState) {
  const answerStateParam = {};
  for(let i=0;i<Object.keys(answerState).length;i++){
    const k = Object.keys(answerState)[i];
    const v = answerState[k];
    if(v){
      const question_id = k.split('_')[0];
      const option_id = k.split('_')[1];
      if(typeof(answerStateParam[question_id]) == 'undefined')
        answerStateParam[question_id] = [];
      if(option_id == 'custom'){
        answerStateParam[question_id].push({'custom': v})
      } else if (option_id == 'photo'){
        answerStateParam[question_id].push({'photo': v})
      } else {
        answerStateParam[question_id].push({'answer_option_id': parseInt(option_id)})
      }
    }
  }
  return answerStateParam;
}

function validateAnswerStateParam(answerStateParam, fillable) {
  for(let i=0;i<fillable.fillable_questions.length;i++){
    const question = getFillableQuestion(fillable, i);
    if(answerStateParam[question.id])
      continue;
    return i;
  }
  return undefined;
}

const Footer = (props) => {
  if(!props.started)
    return (
      <>
        <Button kind='squared' style={{marginRight: 2.5, backgroundColor: '#00000000'}}
            onPress={() => props.navigation.navigate('Work')}>
          Вихід
        </Button>
        <Button kind='squared' type='naked' style={{marginLeft: 2.5}}
            onPress={() => {
              props.onChangeQuestionNumber(0);
              props.onChangeFinished(false);
              props.onChangeStartedTs((new Date()).getTime());
              props.onChangeStarted(true);
            }}>
          Почати
        </Button>
      </>)
  if(props.finished)
    return (
      <>
        <Button kind='squared' style={{marginRight: 2.5, backgroundColor: '#00000000'}}
            onPress={() => props.navigation.navigate('Work')}>
          Повернутись
        </Button>
      </>)
  return (
    <>
      <Button kind='squared' style={{marginRight: 2.5, backgroundColor: '#00000000'}}
          onPress={() => {
            if(props.questionNumber == 0){
              Alert.alert(
                'Ви хочете закінчити виконання завдання?',
                'Проміжний результат не буде збережений',
                [
                  {
                    text: 'Продовжити',
                    onPress: () => console.log('OK Pressed'),
                    style: 'cancel',
                  },
                  {text: 'Закінчити виконання', onPress: () => props.navigation.navigate('Work')},
                ],
                {cancelable: false},
              );
            }else{
              props.onChangeQuestionNumber(props.questionNumber - 1);
            }
          }}>
        {(props.questionNumber == 0) ? "Вихід" : "Назад" }
      </Button>
      {
        (props.questionNumber == (props.fillable.fillable_questions.length - 1)) ?
          (<Button kind='squared' style={{marginRight: 2.5, backgroundColor: '#00000000'}}
              onPress={() => {
                // submitFill
                const answerStateParam = answerStateToParam(props.answerState);
                const wrongNumber = validateAnswerStateParam(answerStateParam, props.fillable);
                if (typeof(wrongNumber) != 'undefined'){
                  props.onChangeQuestionNumber(wrongNumber);
                  Alert.alert('Незаповнене завдання',
                              'Будь ласка дайте відповідь на всі запитання');
                  return;
                }
                props.onChangeShowDialog(true);
                submitFill(props.fillable, answerStateParam, props.startedTs).then(
                  (fill) => {
                    props.onChangeShowDialog(false);
                    if(fill.id){
                      addFill(fill);
                      props.onChangeFinished(true);
                    }else{
                      Alert.alert('Помилка', 'Щось пішло не так');
                    }
                  }
                );
                
              }}>
            Відправити
          </Button>)
          : (
            <Button kind='squared' style={{marginRight: 2.5, backgroundColor: '#00000000'}}
                onPress={() => {
                  props.onChangeQuestionNumber(props.questionNumber + 1);
                }}>
              Наступне
            </Button>)
      }
    </>)
}


const globalsCacheLife = 1 * 60 * 60 * 1000;


const FillScreen = (props) => {
  const fillable_brief = props.navigation.getParam('fillable');

  const [fillable, onChangeFillable] = React.useState(undefined);
  const [globals, onChangeGlobals] = React.useState(undefined);
  const [started, onChangeStarted] = React.useState(false);
  const [finished, onChangeFinished] = React.useState(false);
  const [questionNumber, onChangeQuestionNumber] = React.useState(0);
  const [startedTs, onChangeStartedTs] = React.useState(undefined);
  const [answerState, onChangeAnswerState] = React.useState({});
  const [forceUpdate, onChangeForceUpdate] = React.useState(true);
  const [showDialog, onChangeShowDialog] = React.useState(false);

  if(typeof(fillable) == 'undefined')
    getFillable(fillable_brief.id).then(onChangeFillable);
  getGlobals(globalsCacheLife).then((gs) => {
    if (getCacheExpired('globals', globalsCacheLife) || (typeof(globals) == 'undefined'))
      onChangeGlobals(gs);
  });

	var width = Dimensions.get('window').width; //full width
  var height = Dimensions.get('window').height; //full height

  if ((typeof(fillable) == 'undefined') || (typeof(globals) == 'undefined'))
    return (
      <View style={[commonStyles.verticalCenter]}>
        <KeyboardAvoidingView style={[commonStyles.p5, commonStyles.verticalCenter,
                                      {height: height, width: width}]}
            behavior="position">
          <View style={[{width: width}]}>
            <View style={[commonStyles.p15]}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>
        </KeyboardAvoidingView>
		  </View>
    );

  const question = getFillableQuestion(fillable, questionNumber);
	return (
		<ScrollView contentContainerStyle={[commonStyles.verticalCenter]}>
      <KeyboardAvoidingView style={[commonStyles.p5, commonStyles.verticalCenter,
                                    {height: height, width: width}]}
					behavior="position">
        <View style={[{width: width}]}>
          <View style={[commonStyles.p15]}>
            <Body globals={globals} fillable={fillable} started={started} question={question}
                finished={finished} answerState={answerState}
                onChangeAnswerState={onChangeAnswerState}
                forceUpdate={forceUpdate} onChangeForceUpdate={onChangeForceUpdate}
                questionNumber={questionNumber}
                />
            <View style={[commonStyles.textCenter, commonStyles.mt15,
                          {minHeight: 50, flex: 1, flexDirection: "row"}]}>
              <Footer fillable={fillable} started={started} question={question}
                  finished={finished} questionNumber={questionNumber}
                  onChangeStarted={onChangeStarted} onChangeFinished={onChangeFinished}
                  onChangeStartedTs={onChangeStartedTs} startedTs={startedTs}
                  onChangeQuestionNumber={onChangeQuestionNumber}
                  navigation={props.navigation} answerState={answerState}
                  onChangeShowDialog={onChangeShowDialog}
                  />
            </View>
          </View>
          <ProgressDialog
              visible={showDialog}
              title="Завантаження"
              message="Відправляємо результати..."
          />
        </View>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}

FillScreen.navigationOptions = {
  title: 'Виконання завдання',
};

export default FillScreen;
