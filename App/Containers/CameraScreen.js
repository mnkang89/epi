'use strict'
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import styles from './Styles/CameraScreenStyle'

export default class CameraScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cameraState: false,
      cameraType: Camera.constants.Type.back
    }
  }

  takePicture () {
    this.camera.capture()
      .then((data) => {
        console.log('hihi')
        console.log(data)
        this.setState({cameraState: true})
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

  renderButtons () {
    if (this.state.cameraState) {
      return (
        <View style={[styles.capture, { flexDirection: 'row' }]}>
          <TouchableOpacity onPress={() => { this.setState({cameraState: false}) }}>
            <Icon
              name='times-circle'
              size={25}
              style={{right: 45, width: 25, height: 25, alignSelf: 'center', fontWeight: '300'}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.uploadPicture.bind(this)}>
            <View style={styles.captureButton}>
              <Icon
                name='long-arrow-up'
                size={22}
                style={{top: 24, left: 7, width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <Icon
              name='pencil-square-o'
              size={25}
              style={{left: 45, width: 25, height: 25, alignSelf: 'center', fontWeight: '300'}}
            />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.capture}>
          <TouchableOpacity style={{flex: 1}} onPress={this.switchCamera.bind(this)}>
            <Icon
              name='repeat'
              size={20}
              style={{top: 20, left: 160, width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 2, justifyContent: 'center'}} onPress={this.takePicture.bind(this)}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <View style={{
            flex: 1,
            alignItems: 'center',
            top: 20}}>
            <TouchableOpacity onPress={this.chevronPress.bind(this)}>
              <Icon
                name='chevron-down'
                size={20}
                style={{width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
              />
            </TouchableOpacity>
          </View>

        </View>
      )
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam
          }}
          type={this.state.cameraType}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill} />
        {this.renderButtons()}
      </View>
    )
  }

}
