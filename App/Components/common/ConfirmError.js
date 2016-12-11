import React from 'react'
import { Text, View, Modal, TouchableHighlight } from 'react-native'

const renderTexts = (TextArray) => {
  return TextArray.map(text => <Text key={TextArray.indexOf(text)} style={{fontSize: 17}}>{text}</Text>)
}

const renderConfirm = (confirmStyle = 'confirm', onAccept, onSetting = null) => {
  if (confirmStyle === 'confirm') {
    return (
      <View style={{paddingTop: 9}}>
        <TouchableHighlight onPress={onAccept}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>확인</Text>
        </TouchableHighlight>
      </View>
    )
  } else if (confirmStyle === 'setting') {
    return (
      <View style={{paddingTop: 9, flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableHighlight onPress={onAccept}>
          <Text style={{fontSize: 15, fontWeight: 'bold', marginRight: 92}}>확인</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onSetting}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>설정</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const ConfirmError = ({ confirmStyle, visible, TextArray, onSetting, onAccept }) => {
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
        <View style={{borderRadius: 4, width: 263, height: 146, backgroundColor: 'white', alignItems: 'center'}}>
          <View style={{
            width: 250.8,
            height: 104,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(217, 217, 217)'}}>
            {renderTexts(TextArray)}
          </View>
          {renderConfirm(confirmStyle, onAccept, onSetting)}
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmError
