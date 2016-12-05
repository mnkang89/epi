import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import SignupActions from '../Redux/SignupRedux'

class SignUpPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      passwordCheck: '',
      passwordEdit: false
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the checking attempt complete?
    console.log('패스워드 중복검사')
    if (this.isAttempting && !newProps.checking && newProps.error === null) {
      console.log('유효한 비밀번호')
      this.props.signUpPassword()
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'WRONG') {
      console.log('유효하지 않은 비밀번호')
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
    const { password, passwordCheck } = this.state
    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.checkPassword(password, passwordCheck)
  }

  render () {
    const { password, passwordCheck } = this.state
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 57, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
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
            placeholderTextColor='white'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
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
            placeholderTextColor='white'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
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
    checking: state.signup.checking,
    error: state.signup.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
    checkPassword: (password, passwordCheck) => dispatch(SignupActions.passwordRequest(password, passwordCheck))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPasswordScreen)
