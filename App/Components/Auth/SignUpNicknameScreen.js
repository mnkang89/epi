import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ImagePickerIOS,
  Linking
} from 'react-native'
import Permissions from 'react-native-permissions'
import ImageResizer from 'react-native-image-resizer'

import { Images } from '../../Themes'
import ConfirmError from '../common/ConfirmError'

const windowSize = Dimensions.get('window')
const URL = 'https://docs.google.com/document/d/13Cc6cYMqZX3xl7J56P3j9XMgtoNJrBb2DcTh5YGuJes/edit'

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

  handleChangeNickname (text) {
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

  handleTextPress = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url)
      } else {
        return Linking.openURL(url)
      }
    }).catch(err => console.error('An error occurred', err))
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
              ImageResizer.createResizedImage(data, 150, 150, 'JPEG', 100)
                .then((resizedImageUri) => {
                  console.log('리사이징 성공')
                  this.setState({
                    photoFlag: true,
                    photoSource: resizedImageUri
                  })
                }).catch((err) => {
                  console.log('리사이징 실패')
                  console.log(err)
                })
              console.log('사진선택')
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
          <Image source={Images.profileImage} style={{alignSelf: 'center'}} />
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
    console.log('사인업 닉네임 스크린')
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
        <View style={{marginLeft: 21, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60}}>고마워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>에피소드에서 사용할 프로필사진과 이름을</Text>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>설정해주세요</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginTop: 18}}
            onPress={this.getProfileImage.bind(this)}>
            {this.renderProfileImage()}
          </TouchableOpacity>
          <View style={{width: windowSize.width - 40, marginTop: 28, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0)'}}>
            <TextInput
              ref='emailCheck'
              style={{fontWeight: 'bold', height: 20, color: 'white'}}
              editable={editable}
              keyboardType='default'
              returnKeyType='done'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeNickname.bind(this)}
              onSubmitEditing={this.handlePressNickname.bind(this)}
              placeholder='이름 (한글과 영문대소문자, 숫자만가능)'
              placeholderTextColor='rgba(255,255,255,0.5)' />
          </View>
          <TouchableOpacity
            style={{width: windowSize.width - 40, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, borderRadius: 2}}
            onPress={this.handlePressNickname.bind(this)} >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>가입</Text>
          </TouchableOpacity>
          <View style={{width: windowSize.width - 40, marginTop: 12, alignItems: 'center'}}>
            <Text style={{fontSize: 10, color: 'white'}}>회원가입시, <Text onPress={() => this.handleTextPress(URL)} style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>이용약관 및 개인정보취급방침</Text>에 동의하는 것으로 간주합니다.</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SignUpNicknameScreen
