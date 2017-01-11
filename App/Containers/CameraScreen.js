'use strict'

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Dimensions,
  Text
} from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Camera from 'react-native-camera'
import Video from 'react-native-video'
import Modal from 'react-native-modalbox'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Images } from '../Themes'
import ConfirmError from '../Components/common/ConfirmError'

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
      confirmStyle: 'confirm',
      alertVisible: false,
      alertTextArray: [],
      onAccept: null,
      onSetting: null,
      AcceptText: '',
      SettingText: '',

      captureMode: Camera.constants.CaptureMode.still,
      cameraType: Camera.constants.Type.back,
      cameraState: false,
      photo: '',
      focus: false,
      texting: false,

      timer: false,
      LeftTime: 5,
      interval: null,
      progress: 0,
      ModalOpen: true,
      swipe: true,
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
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      return false
    }
    return true
  }

  handleLongPressOut () {
    console.log('long press out')
    this.camera.stopCapture()
  }

  handleChangeMessage = (text) => {
    this.setState({ message: text })
  }

  onClose () {
    this.setState({
      fileType: 'Image'
    })
    NavigationActions.homeTab()
  }

  onDecline () {
    console.log('거절눌림')
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
        LeftTime: 5
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
          LeftTime: 5
        })
      } else {
        this.setState({
          LeftTime: this.state.LeftTime - 1,
          progress: this.state.progress + 0.07
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

    if (this.state.texting) {
      this.setState({
        message: '',
        texting: false
      })
      this.refs.MyTextInput.clear()
    }

    if (this.state.cameraState) {
      this.setState({cameraState: false})

      if (this.props.episodeStatus) {
        const episodeId = this.props.activeEpisodeId

        this.props.postUserContent(token, episodeId, fileType, file, message)
        setTimeout(() => {
          this.props.requestUserEpisodes(token, accountId, active)
        }, 1000)
        NavigationActions.homeTab()
      } else {
        this.props.postUserEpisode(token, fileType, file, message)
        setTimeout(() => {
          this.props.requestUserEpisodes(token, accountId, active)
        }, 1000)
        NavigationActions.refresh({key: 'homeTab'})
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
    this.setState({
      alertVisible: true,
      alertTextArray: ['입력된 내용이 사라집니다.', '정말 뒤로 돌아가실건가요?'],

      confirmStyle: 'setting',
      onAccept: this.onBackAccept.bind(this),
      onSetting: this.onDecline.bind(this),
      AcceptText: '네',
      SettingText: '아니요'
    })
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

  renderButtons () {
    if (this.state.cameraState) {
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
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.capture}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{height: 103.5}} onPress={this.switchCamera.bind(this)}>
              <Icon
                name='repeat'
                size={20}
                style={{top: 20, left: 160, width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
              />
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center', marginBottom: 103.5}}>
              <TouchableWithoutFeedback
                delayLongPress={300}
                onPress={this.takePicture.bind(this)}
                onLongPress={
                  () => {
                    console.log('camera longpress~')
                    this.takeVideo()
                  }
                }
                onPressOut={this.handleLongPressOut.bind(this)}
              >
                <Image style={{width: 85, height: 85}} source={Images.captureButton} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      )
    }
  }

  renderCommentInput () {
    if (this.state.texting) {
      return (
        <View>
          <TextInput
            ref='MyTextInput'
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
      )
    } else {
      return
    }
  }

  renderTimerComponent () {
    if (this.state.timer) {
      return (
        <View style={{flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
          <Text style={{color: 'white', fontSize: 15}}>00</Text>
          <Text style={{color: 'white', fontSize: 15}}>:</Text>
          <Text style={{color: 'white', fontSize: 15}}>{this.state.LeftTime}</Text>
        </View>
      )
    } else {
      console.log('timer 없으')
      return
    }
  }

  renderEpisodeStatusButton () {
    console.log('알다가도 모르겠다~')
    if (this.props.episodeStatus) {
      console.log('에피소드 있음')
      return (
        <TouchableOpacity
          style={{width: 28.5, height: 28.5}}
          onPress={() => { this.endEpiBtnPress() }}>
          <Image style={{width: 28.5, height: 28.5, position: 'relative', bottom: 320, right: 335}} source={Images.endEpBtn} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderCamera () {
    console.log('uri')
    console.log(this.state.photo)
    console.log('hi')
    if (this.state.cameraState) {
      console.log('주소는?')
      console.log(this.state.photo)
      if (this.state.fileType === 'Image') {
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
    } else {
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
          {this.renderTimerComponent()}
        </Camera>
      )
    }
  }

  render () {
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
    width: windowSize.width - 45,
    color: 'white',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

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
