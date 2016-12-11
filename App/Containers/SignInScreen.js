import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import ConfirmError from '../Components/common/ConfirmError'

import { Actions as NavigationActions } from 'react-native-router-flux'
import LoginActions from '../Redux/LoginRedux'

class SignInScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      alertVisible: false,
      alertTextArray: []
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    console.log(newProps)

    // Did the login attempt complete?
    console.log('로그인?')
    if (this.isAttempting && !newProps.fetching && newProps.error === null) {
      console.log('로그인 성공')
      NavigationActions.root()
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'INVALID_FORMAT') {
      console.log('유효하지 않은 형식')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
      })
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'VACANT_EMAIL') {
      console.log('이메일을 입력해주세요')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일을 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'VACANT_PASSWORD') {
      console.log('비밀번호를 입력해주세요')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['비밀번호를 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'INVALID_EMAIL') {
      console.log('유효하지 않은 이메일')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
      })
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'INVALID_PASSWORD') {
      console.log('유효하지 않은 비밀번호')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
      })
    }
  }

  handlePressLogin = () => {
    const { email, password } = this.state
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(email, password)
  }

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: []
    })
  }

  render () {
    const { email, password } = this.state
    const { fetching } = this.props
    const editable = !fetching

    return (
      <View style={{marginTop: 44}}>
        <ConfirmError
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)} />
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>안녕하세요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 52, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>등록된 이메일과 비밀번호를 입력해주세요 😄</Text>
        </View>
        <View style={{marginTop: 78, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='email'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
            value={email}
            editable={editable}
            keyboardType='default'
            returnKeyType='next'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeEmail}
            onSubmitEditing={() => this.refs.password.focus()}
            placeholder='이메일'
            placeholderTextColor='white'
          />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='password'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
            value={password}
            editable={editable}
            keyboardType='default'
            returnKeyType='go'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            onChangeText={this.handleChangePassword}
            onSubmitEditing={this.handlePressLogin}
            placeholder='비밀번호 (최소 8자, 최대 12자)'
            placeholderTextColor='white'
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressLogin} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 20, marginLeft: 60, marginRight: 62, backgroundColor: 'rgba(0,0,0,0)'}}
          onPress={() => { this.props.lostPassword() }
        } >
          <Text style={{textDecorationLine: 'underline', color: 'white', fontSize: 15, alignSelf: 'center'}}>비밀번호를 잊어버렸어요</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    error: state.login.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (email, password) => dispatch(LoginActions.loginRequest(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
