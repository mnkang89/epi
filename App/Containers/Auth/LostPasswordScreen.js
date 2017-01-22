import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import LoginActions from '../../Redux/LoginRedux'

class LostPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the login attempt complete?
    console.log('로그인?')
    if (this.isAttempting && !newProps.fetching && newProps.error === null) {
      console.log('로그인 성공')
      NavigationActions.root()
    } else if (this.isAttempting && !newProps.fetching && newProps.error === 'WRONG') {
      console.log('아이디, 비밀번호를 입력해주세요')
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
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', width: 330, paddingTop: 10, paddingBottom: 10, marginTop: 22}}
          onPress={
            () => {
              this.props.scrollViewHandler.scrollTo({x: 0})
            }
          } >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>임시비밀번호 전송</Text>
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
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LostPasswordScreen)
