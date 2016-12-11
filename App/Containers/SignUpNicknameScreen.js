import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image
} from 'react-native'
import { connect } from 'react-redux'
// import LoginActions from '../Redux/LoginRedux'
import { Images } from '../Themes'
import ConfirmError from '../Components/common/ConfirmError'

import SignupActions from '../Redux/SignupRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

class SignUpPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nickname: '',
      error: '',
      alertVisible: false,
      alertTextArray: []
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the checking attempt complete?
    console.log('닉네임 중복검사')
    if (this.isAttempting && !newProps.checking && newProps.error === null) {
      console.log('유효한 닉네임')
      NavigationActions.root()
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'VACANT') {
      console.log('유효하지 않은 닉네임(공백)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이름을 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'DUPLICATED') {
      console.log('유효하지 않은 닉네임(중복)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이미 사용 중인 이름입니다.', '다른 이름을 사용해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'INVALID_FORMAT') {
      console.log('유효하지 않은 닉네임(닉네임 형식)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['한글과 영문대소문자 숫자만', '사용 가능합니다.', '다시 한번 확인해주세요.']
      })
    }
  }

  handleChangeNickname = (text) => {
    this.setState({ nickname: text })
  }

  handlePressNickname () {
    const { nickname } = this.state
    const { token, accountId } = this.props

    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    console.log(token)
    console.log(accountId)
    this.props.checkNickname(nickname, token, accountId)
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: []
    })
  }

  render () {
    const { nickname } = this.state
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <ConfirmError
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)} />
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>고마워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 86, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>에피소드에서 사용할 프로필사진과 이름을 설정해주세요 😀</Text>
        </View>
        <View style={{marginTop: 18, marginBottom: 28}}>
          <Image source={Images.profileIcon} style={{alignSelf: 'center'}} />
        </View>
        <View style={{marginTop: 0, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='emailCheck'
            style={{fontWeight: 'bold', height: 20, color: 'white'}}
            editable={editable}
            value={nickname}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeNickname}
            onSubmitEditing={this.handlePressNickname.bind(this)}
            placeholder='이름 (한글과 영문대소문자, 숫자만가능)'
            placeholderTextColor='white'
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressNickname.bind(this)}
          >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>가입</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    checking: state.signup.checking,
    error: state.signup.error,
    token: state.token.token,
    accountId: state.token.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
    checkNickname: (nickname, token, accountId) => dispatch(SignupActions.nicknameCheck(nickname, token, accountId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPasswordScreen)
