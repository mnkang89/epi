'use strict'

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Dimensions,
  Text,
  Modal as NativeModal
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Camera from 'react-native-camera'
import Video from 'react-native-video'
import Modal from 'react-native-modalbox'
import Permissions from 'react-native-permissions'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Images } from '../Themes'
import ConfirmError from '../Components/common/ConfirmError'
import ProgressBar from '../Components/camera/Progress-Bar'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import ContentActions from '../Redux/ContentRedux'

// Styles
import styles from './Styles/CameraScreenStyle'

const windowSize = Dimensions.get('window')

class CameraScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // ModalwindowSize.
      ModalOpen: true,
      swipe: true,

      // Permission
      cameraAuthorized: true,

      // ConfirmError
      confirmStyle: 'confirm',
      alertVisible: false,
      alertTextArray: [],
      onAccept: null,
      onSetting: null,
      AcceptText: '',
      SettingText: '',

      // Camera
      captureMode: Camera.constants.CaptureMode.still,
      cameraType: Camera.constants.Type.back,
      cameraState: false,
      photo: '',
      focus: false,
      texting: false,

      // Video
      timer: false,
      LeftTime: 5,
      interval: null,
      progress: 0,

      fileType: 'Image',
      message: ''
    }
  }

  componentWillReceiveProps () {
    console.log('카메라스크린 componentWillReceiveProps')
    this.props.checkUserEpisode(this.props.token, true)
  }

  componentDidMount () {
    // 여기에서 현재 active한 에피소드가 있는지 없는지 체크하고 컨디셔널 렌더링
    this.props.checkUserEpisode(this.props.token, true)
    this.refs.modal.open()

    // TODO: 카메라 퍼미션
    Permissions.getPermissionStatus('camera')
      .then(response => {
        console.log(response)
        if (response === 'undetermined') {
          Permissions.requestPermission('camera').then(response => {
            console.log(response)
            this.setState({
              cameraAuthorized: false
            })
            Permissions.openSettings()
          })
        } else if (response === 'denied') {
          console.log(response)
          this.setState({
            cameraAuthorized: false
          })
          Permissions.openSettings()
        } else if (response === 'authorized') {
          this.setState({
            cameraAuthorized: true
          })
        }
      })
    console.log(this.props)
  }

  /*
  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      console.log('업데이트 안해도됨')
      return false
    }
    return true
  }
  */

  handleLongPressOut () {
    console.log('long press out')
    clearInterval(this.state.interval)
    this.camera.stopCapture()
    this.setState({
      timer: false,
      LeftTime: 5,
      progress: 0
    })
  }

  handleChangeMessage = (text) => {
    this.setState({ message: text })
  }

  onClose () {
    console.log('hihi')
    this.setState({
      fileType: 'Image'
    })
    if (this.props.beforeScreen === 'homeTab') {
      console.log('hometab')
      NavigationActions.homeTab()
    } else if (this.props.beforeScreen === 'alarmTab') {
      console.log('alarmtab')
      NavigationActions.alarmTab()
    } else if (this.props.beforeScreen === 'searchTab') {
      console.log('searchtab')
      NavigationActions.searchTab()
    } else if (this.props.beforeScreen === 'profileTab') {
      console.log('profiletab')
      NavigationActions.profileTab()
    }
  }

  onCameraSetting () {
    console.log('온 카메라 세팅')
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })
    Permissions.openSettings()
  }

  onDecline () {
    console.log('거절 눌림')
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })
  }

  onPutting () {
    console.log('푸팅 버튼 눌림')
    const { token, accountId } = this.props
    const episodeId = this.props.activeEpisodeId
    const active = false

    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm'
    })

    this.props.putUserEpisode(token, episodeId, active)
    this.props.requestUserEpisodes(token, accountId, active)

    NavigationActions.refresh({key: 'homeTab'})
  }

  onBackAccept () {
    this.setState({
      alertVisible: false,
      alertTextArray: [],
      confirmStyle: 'confirm',

      message: '',

      cameraState: false,
      cameraType: Camera.constants.Type.back,
      photo: '',
      focus: false,
      texting: false,
      timer: false,
      LeftTime: 5,
      interval: null,
      fileType: 'Image'
    })
  }

  takePicture () {
    this.camera.capture()
      .then((data) => {
        this.setState({
          fileType: 'Image',
          photo: data.path
        })
        setTimeout(() => {
          this.setState({
            cameraState: true
          })
        }, 500)
      })
      .catch(err => console.error(err))
  }

  takeVideo () {
    this.setState({
      fileType: 'Video',
      timer: true})
    this.camera.capture({
      mode: Camera.constants.CaptureMode.video
    })
    .then((data) => {
      console.log('video capture success')
      console.log(data.path)
      clearInterval(this.state.interval)
      this.setState({
        photo: data.path,
        timer: false,
        LeftTime: 5,
        progress: 0
      })
      setTimeout(() => {
        this.setState({
          cameraState: true
        })
      }, 500)
    })
    .catch(err => console.log(err))

    this.state.interval = setInterval(() => {
      if (this.state.LeftTime === 0) {
        clearInterval(this.state.interval)
        this.camera.stopCapture()
        this.setState({
          timer: false,
          LeftTime: 5,
          progress: 0
        })
      } else {
        this.setState({
          LeftTime: this.state.LeftTime - 1,
          progress: this.state.progress + 3750 * 2
        })
      }
    }, 1000)
  }

  uploadPicture () {
    const { token, accountId } = this.props
    const file = this.state.photo
    const fileType = this.state.fileType
    const message = this.state.message
    const active = false

    this.setState({
      message: '',
      texting: false
    })

    if (this.state.cameraState) {
      this.setState({cameraState: false})

      if (this.props.episodeStatus) {
        const episodeId = this.props.activeEpisodeId

        this.props.postUserContent(token, episodeId, fileType, file, message)
        setTimeout(() => {
          this.props.requestUserEpisodes(token, accountId, active)
        }, 1000)
        console.log('카메라리플레이스1')
        NavigationActions.homeTab()
      } else {
        this.props.postUserEpisode(token, fileType, file, message)
        setTimeout(() => {
          this.props.requestUserEpisodes(token, accountId, active)
        }, 1000)
        console.log('카메라리플레이스2')
        NavigationActions.homeTab()
      }
    }
  }

  endEpiBtnPress () {
    this.setState({
      alertVisible: true,
      alertTextArray: ['정말 종료하실거예요?😢'],

      confirmStyle: 'setting',
      onAccept: this.onPutting.bind(this),
      onSetting: this.onDecline.bind(this),
      AcceptText: '물론이죠(단호)',
      SettingText: '아니에요😀'
    })
  }

  backChevronPress () {
    if (this.state.message !== '') {
      this.setState({
        alertVisible: true,
        alertTextArray: ['입력된 내용이 사라집니다.', '정말 뒤로 돌아가실건가요?'],

        confirmStyle: 'setting',
        onAccept: this.onBackAccept.bind(this),
        onSetting: this.onDecline.bind(this),
        AcceptText: '네',
        SettingText: '아니요'
      })
    } else {
      this.setState({
        cameraState: false,
        cameraType: Camera.constants.Type.back,
        photo: '',
        focus: false,
        texting: false,
        timer: false,
        LeftTime: 5,
        interval: null,
        fileType: 'Image'
      })
    }
  }

  switchCamera () {
    const state = this.state

    state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back
    this.setState(state)
  }

  texting () {
    if (this.state.texting) {
      this.refs.MyTextInput.focus()
      return
    }
    this.setState({
      texting: true,
      focus: true,
      swipe: false
    })
  }

  renderAuthDenied () {
    console.log(this.state.cameraAuthorized)
    if (this.state.cameraAuthorized) {
      return (
        <View />
      )
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
          <Text style={{fontSize: 17, color: 'rgb(255,255,255)'}}>휴대폰 설정에서 카메라 사용을</Text>
          <Text style={{fontSize: 17, color: 'rgb(255,255,255)'}}>허용해주세요😱</Text>
        </View>
      )
    }
  }

  renderButtons () {
    console.log('11')
    if (this.state.cameraState) {
      console.log('22')
      return (
        <View style={styles.capture}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{height: 103.5}} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={{marginTop: 27.5, marginRight: 57.5}}
                onPress={this.backChevronPress.bind(this)}>
                <Image style={{width: 30, height: 30}} source={Images.backChevron} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.uploadPicture.bind(this)}>
                <Image style={{width: 85, height: 85}} source={Images.aftercaptureButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.texting.bind(this)} style={{marginTop: 27.5, marginLeft: 57}}>
                <Image style={{width: 31, height: 31}} source={Images.write} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { NavigationActions.pop() }} style={{marginTop: 27.5, marginLeft: 57}}>
              <Image style={{width: 31, height: 31}} source={Images.write} />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      console.log('33')
      return (
        <View style={styles.capture}>
          <View style={{flex: 1}}>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={{marginRight: 10, marginTop: 10}}
                onPress={this.switchCamera.bind(this)}>
                <Icon
                  name='repeat'
                  size={20}
                  style={{width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 103.5}}>
              <TouchableWithoutFeedback
                delayLongPress={300}
                onPress={this.takePicture.bind(this)}
                onLongPress={
                  () => {
                    console.log('camera longpress~')
                    this.takeVideo()
                  }
                }
                onPressOut={this.handleLongPressOut.bind(this)} >
                <Image style={{width: 85, height: 85}} source={Images.captureButton} />
              </TouchableWithoutFeedback>
            </View>
            <TouchableOpacity onPress={() => { NavigationActions.statusModal({hide: true}) }} style={{marginTop: 27.5, marginLeft: 57}}>
              <Image style={{width: 31, height: 31}} source={Images.write} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderCommentInput () {
    if (this.state.texting) {
      console.log('44')
      return (
        <View>
          <NativeModal
            animationType={'none'}
            transparent
            visible={this.state.texting}>
            <View style={{flex: 1, height: windowSize.height, width: windowSize.width, backgroundColor: 'rgba(0,0,0,0.59)'}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.texting) {
                    this.refs.MyTextInput.blur()
                    this.setState({
                      texting: false
                    })
                    return
                  }
                }}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 15}}>
                  <TextInput
                    ref='MyTextInput'
                    value={this.state.message}
                    style={styles2.input}
                    maxLength={38}
                    placeholder='코멘트 쓰기..'
                    returnKeyType='done'
                    autoCapitalize='none'
                    autoCorrect={false}
                    enablesReturnKeyAutomatically
                    onBlur={(event) => {
                      this.setState({focus: false, swipe: true})
                      console.log(this.state.focus)
                    }}
                    onFocus={() => {
                      this.setState({
                        focus: true, swipe: false
                      })
                      console.log('제대로눌림')
                      console.log(this.state.focus)
                    }}
                    onChangeText={this.handleChangeMessage}
                    autoFocus={this.state.focus} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </NativeModal>
        </View>
      )
    } else {
      console.log('55')
      return (
        <View style={{backgroundColor: 'rgba(0,0,0,0)', paddingLeft: 7.5, paddingRight: 7.5}}>
          <Text style={{
            textShadowOffset: {width: 1, height: 2},
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowRadius: 1,
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold' }}>{this.state.message}</Text>
        </View>
      )
    }
  }

  renderTimerComponent () {
    if (this.state.timer) {
      console.log('66')
      return (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ProgressBar
            fillStyle={{backgroundColor: 'rgb(250,0,0)', height: 10}}
            backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2, height: 10}}
            style={{width: windowSize.width}}
            progress={this.state.progress}
          />
        </View>
      )
    } else {
      console.log('808')
      return (
        <View />
      )
    }
  }

  renderEpisodeStatusButton () {
    console.log('77')
    if (this.props.episodeStatus &&
        this.state.cameraAuthorized) {
      console.log('88')
      return (
        <View style={{flex: 1, alignSelf: 'flex-start'}}>
          <TouchableOpacity
            style={{marginTop: 30, marginLeft: 10}}
            onPress={() => { this.endEpiBtnPress() }}>
            <Image style={{width: 28.5, height: 28.5}} source={Images.endEpBtn} />
          </TouchableOpacity>
        </View>
      )
    } else {
      console.log('99')
      return (
        <View />
      )
    }
  }

  renderCamera () {
    console.log('111')
    if (
      this.state.cameraState) {
      if (this.state.fileType === 'Image') {
        console.log('222')
        return (
          <View>
            <Image style={{ height: 375 }} source={{uri: this.state.photo}}>
              <View style={styles2.textContainer}>
                {this.renderCommentInput()}
              </View>
            </Image>
          </View>
        )
      } else {
        console.log('333')
        return (
          <View>
            <Video
              source={{uri: this.state.photo}}   // Can be a URL or a local file.
              muted
              ref={(ref) => {
                this.player = ref
              }}                             // Store reference
              paused={false}                 // Pauses playback entirely.
              resizeMode='cover'             // Fill the whole screen at aspect ratio.
              repeat                         // Repeat forever.
              playInBackground={false}       // Audio continues to play when app entering background.
              playWhenInactive              // [iOS] Video continues to play when control or notification center are shown.
              progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
              style={{
                height: 375,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }} />
            <View style={styles2.textContainer}>
              {this.renderCommentInput()}
            </View>
          </View>
        )
      }
    } else if (!this.state.cameraState) {
      console.log('444')
      return (
        <Camera
          ref={(cam) => {
            this.camera = cam
          }}
          style={styles.preview}
          captureMode={this.state.captureMode}
          captureTarget={Camera.constants.CaptureTarget.disk}
          captureQuality={Camera.constants.CaptureQuality.high}
          captureAudio={false}
          type={this.state.cameraType}
          defaultOnFocusComponent={false}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          aspect={Camera.constants.Aspect.fill}>
          {this.renderEpisodeStatusButton()}
          {this.renderAuthDenied()}
          {this.renderTimerComponent()}
        </Camera>
      )
    }
  }

  render () {
    console.log('666')
    return (
      <Modal
        ref={'modal'}
        isOpen={this.state.ModalOpen}
        style={{backgroundColor: 'rgba(0,0,0,0)'}}
        position={'center'}
        backdrop={false}
        swipeToClose={this.state.swipe}
        swipeThreshold={10}
        onClosed={this.onClose.bind(this)}
        >
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.state.texting) {
              this.refs.MyTextInput.blur()
              return
            }
          }}>
          <View style={styles.container}>
            <ConfirmError
              confirmStyle={this.state.confirmStyle}
              visible={this.state.alertVisible}
              TextArray={this.state.alertTextArray}
              onAccept={this.state.onAccept}
              onSetting={this.state.onSetting}
              AcceptText={this.state.AcceptText}
              SettingText={this.state.SettingText} />
            {this.renderCamera()}
            {this.renderButtons()}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

}

const styles2 = {
  textContainer: {
    marginTop: 330
  },
  sendContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButton: {
    paddingLeft: 10,
    fontSize: 14
  },
  input: {
    width: windowSize.width - 15,
    height: 32,

    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: {width: 1, height: 2},
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    beforeScreen: state.screen.beforeScreen,
    activeEpisodeId: state.account.activeEpisodeId,
    episodeStatus: state.account.episodeStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkUserEpisode: (token, active) => dispatch(AccountActions.userEpisodeCheck(token, active)),

    requestUserEpisodes: (token, accountId, active) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, active)),
    postUserEpisode: (token, fileType, file, message) => dispatch(EpisodeActions.userEpisodePost(token, fileType, file, message)),
    putUserEpisode: (token, episodeId, active) => dispatch(EpisodeActions.userEpisodePut(token, episodeId, active)),

    postUserContent: (token, episodeId, fileType, file, message) => dispatch(ContentActions.userContentPost(token, episodeId, fileType, file, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
