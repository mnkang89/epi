import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'

const windowSize = Dimensions.get('window')

class SignInScreen extends Component {
  static propTypes = {
    fetching: PropTypes.bool,

    scrollViewHandler: PropTypes.func,
    lostPasswordScreenDispatcher: PropTypes.func,
    emailPasswordScreenDispatcher: PropTypes.func,
    attemptLogin: PropTypes.func,
    handler: PropTypes.func,

    parentHandler: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    this.email = ''
    this.password = ''
    this.emailRef
    this.passwordRef
  }
/*
shouldComponentUpdate (nextProps, nextState) {
  if (
    nextState.email !== this.state.email ||
    nextState.password !== this.state.password) {
    return false
  }
  return true
}
*/

  handlePressLogin () {
    // const { email, password } = this.state
    const email = this.email
    const password = this.password

    this.props.handler()
    this.props.attemptLogin(email, password)
  }

  handleChangeEmail (text) {
    // this.setState({ email: text })
    this.email = text
  }

  handleChangePassword (text) {
    // this.setState({ password: text })
    this.password = text
  }

  onPressLostPassword () {
    this.props.scrollViewHandler(3)

    this.props.lostPasswordScreenDispatcher(true)
    this.props.emailPasswordScreenDispatcher(false)
  }

  render () {
    console.log('사인인 스크린')
    // const { fetching, parentHandler } = this.props
    const { fetching } = this.props
    const editable = !fetching

    return (
      <View style={{marginTop: 44}} >
        <View style={{marginLeft: 21, backgroundColor: 'rgba(0,0,0,0)'}} >
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60}}>안녕하세요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, backgroundColor: 'rgba(0,0,0,0)'}} >
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>등록된 이메일과 비밀번호를 입력해주세요</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{width: windowSize.width - 40, marginTop: 78, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}} >
            <TextInput
              ref={(ref) => {
                // parentHandler.textRefs.push(ref)
                this.emailRef = ref
              }}
              style={{height: 20, fontWeight: 'bold', color: 'white'}}
              editable={editable}
              keyboardType='email-address'
              clearButtonMode='while-editing'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeEmail.bind(this)}
              onSubmitEditing={() => this.passwordRef.focus()}
              placeholder='이메일'
              placeholderTextColor='rgba(255,255,255,0.5)' />
          </View>
          <View style={{width: windowSize.width - 40, marginTop: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
            <TextInput
              ref={(ref) => {
                // parentHandler.textRefs.push(ref)
                this.passwordRef = ref
              }}
              style={{height: 20, fontWeight: 'bold', color: 'white'}}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              clearTextOnFocus
              onChangeText={this.handleChangePassword.bind(this)}
              onSubmitEditing={this.handlePressLogin.bind(this)}
              placeholder='비밀번호 (최소 8자, 최대 12자)'
              placeholderTextColor='rgba(255,255,255,0.5)' />
          </View>
          <TouchableOpacity
            style={{width: windowSize.width - 40, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, borderRadius: 2}}
            onPress={this.handlePressLogin.bind(this)} >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

SignInScreen.defaultProps = {
  scrollViewHandler: {}
}

export default SignInScreen
