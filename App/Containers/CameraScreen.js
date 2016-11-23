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
import Camera from 'react-native-camera'
// import {CameraKitCamera} from 'react-native-camera-kit'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Images } from '../Themes'
// import KeyboardSpacer from 'react-native-keyboard-spacer'

// Styles
import styles from './Styles/CameraScreenStyle'

const windowSize = Dimensions.get('window')

export default class CameraScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      captureMode: Camera.constants.CaptureMode.still,
      cameraState: false,
      cameraType: Camera.constants.Type.back,
      photo: '',
      focus: false,
      texting: false,
      timer: false,
      LeftTime: 15,
      interval: null,
      progress: 0
    }
  }

  takePicture () {
    this.camera.capture()
      .then((data) => {
        console.log('hihi')
        console.log(data)
        this.setState({
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
      captureMode: Camera.constants.CaptureMode.video,
      timer: true
    })
    this.state.interval = setInterval(() => {
      if (this.state.LeftTime === 0) {
        clearInterval(this.state.interval)
        this.camera.stopCapture()
        this.setState({
          LeftTime: 15,
          cameraState: true
        })
      } else {
        this.setState({
          LeftTime: this.state.LeftTime - 1,
          progress: this.state.progress + 0.07
        })
      }
    }, 1000)

    this.camera.capture()
      .then((data) => {
        console.log('hihi')
        console.log(data)
        this.setState({
          photo: data.path
        })
        setTimeout(() => {
          this.setState({
            LeftTime: 15,
            cameraState: true
          })
        }, 500)
      })
      .catch(err => console.error(err))
  }

  // 사진만 업로드
  uploadPicture () {
    // 에피소드 업데이트 api콜 하는 부분
    if (this.state.cameraState) {
      console.log('upload')
      NavigationActions.homeTab()
      this.setState({cameraState: false})
    }
  }

  // 글과 함께 사진 업로드
  uploadPictureWithText () {
    // 에피소드 업데이트 api콜 하는 부분
  }

  switchCamera () {
    const state = this.state
    state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back
    this.setState(state)
    console.log(this.state)
  }

  chevronPress () {
    NavigationActions.homeTab()
  }

  texting () {
    this.setState({
      focus: true,
      texting: true
    })
  }

  handleLongPressOut () {
    if (this.state.timer) {
      clearInterval(this.state.interval)
      this.camera.stopCapture()
      this.setState({
        LeftTime: 15,
        cameraState: true
      })
    }
  }

  renderButtons () {
    if (this.state.cameraState) {
      return (
        <View style={styles.capture}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{height: 103.5}} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity style={{marginTop: 27.5, marginRight: 57.5}} onPress={() => { this.setState({cameraState: false}) }}>
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
          <TouchableOpacity onPress={() => NavigationActions.homeTab()}>
            <Text>back</Text>
          </TouchableOpacity>
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
                delayLongPress={1200}
                onPress={this.takePicture.bind(this)}
                onLongPress={this.takeVideo.bind(this)}
                onPressOut={this.handleLongPressOut.bind(this)}
              >
                <Image style={{width: 85, height: 85}} source={Images.captureButton} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <TouchableOpacity onPress={() => NavigationActions.homeTab()}>
            <Text>back</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderCommentInput () {
    if (this.state.texting) {
      return (
        <TextInput
          placeholder='코멘트 쓰기..'
          style={styles2.input}
          multiline
          onBlur={() => {}}
          autoFocus={this.state.focus} />
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
      return
    }
  }

  renderCamera () {
    if (this.state.cameraState) {
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
        <Camera
          captureMode={this.state.captureMode}
          captureTarget={Camera.constants.CaptureTarget.disk}
          ref={(cam) => {
            this.camera = cam
          }}
          captureQuality={Camera.constants.CaptureQuality.high}
          type={this.state.cameraType}
          style={styles.preview}
          onZoomChanged={() => {}}
          aspect={Camera.constants.Aspect.fill}>
          {this.renderTimerComponent()}
        </Camera>
      )
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        {this.renderButtons()}
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
}
