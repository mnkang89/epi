import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'

const windowSize = Dimensions.get('window')

class LostPasswordScreen extends Component {
  static propTypes = {
    scrollViewHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.email !== this.state.email) {
      return false
    }
    return true
  }

  handleChangeEmail (text) {
    this.setState({ email: text })
  }

  onPressSend () {
    this.props.scrollViewHandler(0)
  }

  render () {
    console.log('로스트 패스워드 스크린')
    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60}}>ㅠ.ㅠ</Text>
        </View>
        <View style={{marginTop: 17, marginLeft: 23, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>회원가입시 입력한 이메일을 알려주시면</Text>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>비밀번호 변경 링크를 보내드려요 😉</Text>
        </View>
        <View style={{alignItems: 'center', marginTop: 100}}>
          <View style={{width: windowSize.width - 40, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
            <TextInput
              placeholder='이메일'
              placeholderTextColor='rgba(255,255,255,0.5)'
              style={{fontWeight: 'bold', color: 'white', height: 20}} />
          </View>
          <TouchableOpacity
            style={{alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', width: windowSize.width - 40, paddingTop: 10, paddingBottom: 10, marginTop: 22, borderRadius: 2}}
            onPress={this.onPressSend.bind(this)} >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>임시비밀번호 전송</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default LostPasswordScreen
