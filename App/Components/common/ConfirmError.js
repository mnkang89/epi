import React from 'react'
import { Text, View, Modal, TouchableOpacity } from 'react-native'

const renderTexts = (TextArray) => {
  return TextArray.map(text => <Text key={TextArray.indexOf(text)} style={{fontSize: 17}}>{text}</Text>)
}

const renderConfirm = (confirmStyle = 'confirm', onAccept, onSetting = null, AcceptText = '확인해', SettingText = '설정') => {
  // console.log(AcceptText)

  if (confirmStyle === 'confirm') {
    return (
      <TouchableOpacity onPress={onAccept}>
        <View style={{
          width: 250.8,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{AcceptText}</Text>
        </View>
      </TouchableOpacity>
    )
  } else if (confirmStyle === 'setting') {
    // TODO: 터치영역 넓히기
    return (
      <View style={{paddingTop: 9, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={onAccept}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{AcceptText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={onSetting}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{SettingText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const ConfirmError = ({ confirmStyle, visible, TextArray, onSetting, onAccept, AcceptText, SettingText }) => {
  return (
    <Modal
      animationType={'none'}
      transparent
      visible={visible} >
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'}}>
        <View style={{
          shadowOffset: {width: 1, height: 3},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          borderRadius: 4,
          width: 263,
          height: 146,
          backgroundColor: 'white',
          alignItems: 'center'}} >
          <View style={{
            width: 250.8,
            height: 104,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(217, 217, 217)'}}>
            {renderTexts(TextArray)}
          </View>
          {renderConfirm(confirmStyle, onAccept, onSetting, AcceptText, SettingText)}
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmError
