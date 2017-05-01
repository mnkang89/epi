import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'

const windowSize = Dimensions.get('window')

class SignUpEmailScreen extends Component {

  static propTypes = {
    checking: PropTypes.bool,

    checkEmail: PropTypes.func,
    handler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      return false
    }
    return true
  }

  handleChangeEmail (text) {
    this.setState({ email: text })
  }

  handlePressEmail () {
    const { email } = this.state
    this.props.handler()

    this.props.checkEmail(email)
  }

  render () {
    console.log('사인업 이메일 스크린')
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 </Text>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>비밀번호를 등록해주세요</Text>
        </View>
        <View style={{marginTop: 111, alignItems: 'center'}}>
          <View style={{width: windowSize.width - 40, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
            <TextInput
              ref='emailCheck'
              style={{fontWeight: 'bold', height: 20, color: 'white'}}
              editable={editable}
              keyboardType='email-address'
              returnKeyType='done'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeEmail.bind(this)}
              onSubmitEditing={this.handlePressEmail.bind(this)}
              placeholder='이메일'
              placeholderTextColor='rgba(255,255,255,0.5)'
            />
          </View>
          <TouchableOpacity
            style={{width: windowSize.width - 40, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, borderRadius: 2}}
            onPress={this.handlePressEmail.bind(this)} >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

export default SignUpEmailScreen
