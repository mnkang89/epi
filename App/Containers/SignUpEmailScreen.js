import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import ConfirmError from '../Components/common/ConfirmError'
// import LoginActions from '../Redux/LoginRedux'
import SignupActions from '../Redux/SignupRedux'

class SignUpEmailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      error: '',
      alertVisible: false,
      alertTextArray: []
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the checking attempt complete?
    console.log('이메일 중복검사')
    if (this.isAttempting && !newProps.checking && newProps.error === null) {
      console.log('유효한 이메일')
      this.props.signUpEmail()
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'VACANT') {
      console.log('유효하지 않은 이메일(공백)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일을 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'DUPLICATED') {
      console.log('유효하지 않은 이메일(중복)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이미 사용 중인 이메일입니다.', '다시 한 번 확인해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'INVALID_FORMAT') {
      console.log('유효하지 않은 이메일(이메일 형식)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일 형식이 맞지 않습니다.', '다시 한 번 확인해주세요.']
      })
    }
  }

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  handlePressEmail () {
    const { email } = this.state
    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.checkEmail(email)
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: []
    })
  }

  render () {
    const { email } = this.state
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <ConfirmError
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)} />
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 111, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white'}}>
          <TextInput
            ref='emailCheck'
            style={{fontWeight: 'bold', height: 20, color: 'white'}}
            editable={editable}
            value={email}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeEmail}
            onSubmitEditing={this.handlePressEmail.bind(this)}
            placeholder='이메일'
            placeholderTextColor='white'
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressEmail.bind(this)}
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
    checkEmail: (email) => dispatch(SignupActions.emailCheck(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpEmailScreen)
