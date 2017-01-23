import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ImagePickerIOS
} from 'react-native'
// import { connect } from 'react-redux'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import Permissions from 'react-native-permissions'

import { Images } from '../../Themes'
import ConfirmError from '../../Components/common/ConfirmError'

// import SignupActions from '../../Redux/SignupRedux'

class SignUpNicknameScreen extends Component {

  static propTypes = {
    checking: PropTypes.bool,
    token: PropTypes.string,
    accountId: PropTypes.number,

    checkNickname: PropTypes.func,
    requestProfileImage: PropTypes.func,
    handler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      nickname: '',
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm',
      photoFlag: false,
      photoSource: ''
    }
    this.isAttempting = false
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.nickname !== this.state.nickname) {
      return false
    }
    return true
  }
/*
componentWillReceiveProps (newProps) {
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
*/

  handleChangeNickname = (text) => {
    this.setState({ nickname: text })
  }

  handlePressNickname () {
    const { nickname, photoSource } = this.state
    const { token, accountId } = this.props

    this.props.checkNickname(nickname, token, accountId)
    this.props.requestProfileImage(photoSource, token, accountId)
    this.props.handler()
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })
  }
  onSetting () {
    console.log('온세팅')
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })

    Permissions.openSettings()
  }

  getProfileImage () {
    Permissions.getPermissionStatus('photo')
      .then(response => {
        console.log(response)
        if (response === 'undetermined') {
          ImagePickerIOS.openSelectDialog(
            { },
            (data) => {
              console.log('사진선택')
              this.setState({
                photoFlag: true,
                photoSource: data
              })
            },
            () => {
              console.log('에러')
              this.setState({
                photoFlag: false
              })
              Permissions.getPermissionStatus('photo')
                .then(response => {
                  if (response === 'denied') {
                    console.log(response)
                    this.setState({
                      alertVisible: true,
                      alertTextArray: ['설정에서 ‘사진’ 접근권한을', '허용해주세요.'],
                      confirmStyle: 'setting'
                    })
                  } else if (response === 'undetermined') {
                    console.log(response)
                    this.setState({
                      alertVisible: true,
                      alertTextArray: ['설정에서 ‘사진’ 접근권한을', '허용해주세요.'],
                      confirmStyle: 'setting'
                    })
                  }
                })
            }
          )
        } else if (response === 'denied') {
          this.setState({
            alertVisible: true,
            alertTextArray: ['설정에서 ‘사진’ 접근권한을', '허용해주세요.'],
            confirmStyle: 'setting'
          })
        } else if (response === 'authorized') {
          // 사진 라이브러리 가서 사진 가저오는 로직
          ImagePickerIOS.openSelectDialog(
            { },
            (data) => {
              console.log('사진선택')
              this.setState({
                photoFlag: true,
                photoSource: data
              })
            },
            () => {
              console.log('에러')
              this.setState({
                photoFlag: false
              })
              console.log('User canceled the action')
            }
          )
        }
      })
  }

  renderProfileImage () {
    if (this.state.photoFlag) {
      return (
        <Image source={{uri: this.state.photoSource}} style={{
          height: 99,
          width: 99,
          borderRadius: 49.5,
          alignSelf: 'center'}} />
      )
    } else {
      if (this.state.photoSource === '') {
        return (
          <Image source={Images.profileIcon} style={{alignSelf: 'center'}} />
        )
      } else {
        return (
          <Image source={{uri: this.state.photoSource}} style={{
            height: 99,
            width: 99,
            borderRadius: 49.5,
            alignSelf: 'center'}} />
        )
      }
    }
  }

  render () {
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <ConfirmError
          confirmStyle={this.state.confirmStyle}
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          AcceptText={'확인'}
          SettingText={'설정'}
          onAccept={this.onDecline.bind(this)}
          onSetting={this.onSetting.bind(this)} />
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>고마워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 86, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>에피소드에서 사용할 프로필사진과 이름을 설정해주세요 😀</Text>
        </View>
        <TouchableOpacity
          style={{marginTop: 18, marginBottom: 28}}
          onPress={this.getProfileImage.bind(this)}>
          {this.renderProfileImage()}
        </TouchableOpacity>
        <View style={{marginTop: 0, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='emailCheck'
            style={{fontWeight: 'bold', height: 20, color: 'white'}}
            editable={editable}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeNickname}
            onSubmitEditing={this.handlePressNickname.bind(this)}
            placeholder='이름 (한글과 영문대소문자, 숫자만가능)'
            placeholderTextColor='rgba(255,255,255,0.5)'
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressNickname.bind(this)} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>가입</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

/*
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
    checkNickname: (nickname, token, accountId) => dispatch(SignupActions.nicknameCheck(nickname, token, accountId)),
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId))
  }
}
*/

export default SignUpNicknameScreen
