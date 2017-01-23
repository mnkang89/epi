import React, { Component } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'

import ConfirmError from '../../Components/common/ConfirmError'

import SignupActions from '../../Redux/SignupRedux'
import GreetingActions from '../../Redux/GreetingRedux'

const windowSize = Dimensions.get('window')

class SignUpPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      passwordCheck: '',
      passwordEdit: false,
      error: '',
      alertVisible: false,
      alertTextArray: []
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    // const { email, password } = newProps
    this.forceUpdate()

    console.log('패스워드 중복검사')
    if (this.isAttempting && !newProps.checking && newProps.error === null && newProps.attempting) {
      console.log('유효한 비밀번호')
      this.props.scrollViewHandler.scrollTo({x: 3 * windowSize.width})
      this.props.passwordScreenDispatcher(false)
      this.props.nicknameScreenDispatcher(true)
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'VACANT') {
      console.log('유효하지 않은 비밀번호(공백)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['비밀번호를 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'NOT_MATCH') {
      console.log('유효하지 않은 비밀번호(불일치)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['비밀번호가 일치하지 않습니다.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'INVALID_FORMAT') {
      console.log('유효하지 않은 비밀번호(비밀번호 형식)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['비밀번호를 다시 한 번', '확인해주세요.']
      })
    } else if (!newProps.attempting && newProps.attemptingerror === null) {
      console.log('유효한 회원가입')
      // this.props.signUpPassword()
    } else if (!newProps.attempting && newProps.attemptingerror === 'WRONG') {
      console.log('유효하지 않은 회원가입')
    }
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
    if (this.state.password === '') {
      this.setState({passwordEdit: false})
    } else {
      this.setState({passwordEdit: true})
    }
  }

  handleChangePasswordCheck = (text) => {
    this.setState({ passwordCheck: text })
  }

  handlePressPassword () {
    const { email } = this.props
    const { password, passwordCheck } = this.state
    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.checkPassword(email, password, passwordCheck)
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: []
    })
  }

  render () {
    const { password, passwordCheck } = this.state
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <ConfirmError
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)} />
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 57, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='password'
            value={password}
            editable={editable}
            secureTextEntry
            keyboardType='default'
            returnKeyType='next'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangePassword}
            onSubmitEditing={() => this.refs.passwordCheck.focus()}
            placeholder='비밀번호 (최소 8자, 최대 12자)'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='passwordCheck'
            value={passwordCheck}
            editable={editable}
            secureTextEntry
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangePasswordCheck}
            onSubmitEditing={this.handlePressPassword.bind(this)}
            placeholder='비밀번호 확인'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressPassword.bind(this)}
        >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.signup.email,
    password: state.signup.password,
    checking: state.signup.checking,
    attempting: state.signup.attempting,
    error: state.signup.error,
    attemptingerror: state.signup.attemptingerror
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
    checkPassword: (email, password, passwordCheck) => dispatch(SignupActions.passwordRequest(email, password, passwordCheck)),
    nicknameScreenDispatcher: (nicknameScreen) => dispatch(GreetingActions.nicknameScreenDispatcher(nicknameScreen)),
    passwordScreenDispatcher: (passwordScreen) => dispatch(GreetingActions.passwordScreenDispatcher(passwordScreen))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPasswordScreen)
