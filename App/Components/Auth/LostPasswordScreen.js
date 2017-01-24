import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'

class LostPasswordScreen extends Component {
  static propTypes = {
    scrollViewHandler: PropTypes.object
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
    this.props.scrollViewHandler.scrollTo({x: 0})
  }

  render () {
    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>ㅠ.ㅠ</Text>
        </View>
        <View style={{marginTop: 17, marginLeft: 23, marginRight: 45, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>회원가입시 입력한 이메일을 알려주시면 비밀번호 변경 링크를 보내드려요 😉</Text>
        </View>
        <View style={{marginTop: 100, width: 330, alignSelf: 'center', paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            placeholder='이메일'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={{fontWeight: 'bold', color: 'white', height: 20}} />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', width: 330, paddingTop: 10, paddingBottom: 10, marginTop: 22}}
          onPress={this.onPressSend.bind(this)} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>임시비밀번호 전송</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LostPasswordScreen
