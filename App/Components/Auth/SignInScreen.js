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

    scrollViewHandler: PropTypes.object,
    lostPasswordScreenDispatcher: PropTypes.func,
    emailPasswordScreenDispatcher: PropTypes.func,
    attemptLogin: PropTypes.func,
    handler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (
      nextState.email !== this.state.email ||
      nextState.password !== this.state.password) {
      return false
    }
    return true
  }

  handlePressLogin () {
    const { email, password } = this.state

    this.props.handler()
    this.props.attemptLogin(email, password)
  }

  handleChangeEmail (text) {
    this.setState({ email: text })
  }

  handleChangePassword (text) {
    this.setState({ password: text })
  }

  onPressLostPassword () {
    this.props.scrollViewHandler.scrollTo({x: 2 * windowSize.width})
    this.props.lostPasswordScreenDispatcher(true)
    this.props.emailPasswordScreenDispatcher(false)
  }

  render () {
    const { fetching } = this.props
    const editable = !fetching

    return (
      <View style={{marginTop: 44}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>안녕하세요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 52, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>등록된 이메일과 비밀번호를 입력해주세요 😄</Text>
        </View>
        <View style={{marginTop: 78, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='email'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
            editable={editable}
            keyboardType='default'
            returnKeyType='next'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeEmail.bind(this)}
            onSubmitEditing={() => this.refs.password.focus()}
            placeholder='이메일'
            placeholderTextColor='rgba(255,255,255,0.5)' />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='password'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
            editable={editable}
            keyboardType='default'
            returnKeyType='go'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            onChangeText={this.handleChangePassword.bind(this)}
            onSubmitEditing={this.handlePressLogin}
            placeholder='비밀번호 (최소 8자, 최대 12자)'
            placeholderTextColor='rgba(255,255,255,0.5)' />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressLogin.bind(this)} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 20, marginLeft: 60, marginRight: 62, backgroundColor: 'rgba(0,0,0,0)'}}
          onPress={this.onPressLostPassword.bind(this)} >
          <Text style={{textDecorationLine: 'underline', color: 'white', fontSize: 15, alignSelf: 'center'}}>비밀번호를 잊어버렸어요</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default SignInScreen
