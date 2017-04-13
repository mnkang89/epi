import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback
} from 'react-native'

import Permissions from 'react-native-permissions'
import { connect } from 'react-redux'
import Camera from 'react-native-camera'
import Video from 'react-native-video'
import ContentType from './ContentTypeEnum'
// import EpisodeControllerButton from './EpisodeControllerButton'
import CameraScreenActions from '../../Redux/CameraScreenRedux'
import _ from 'lodash'

class CameraSection extends Component {

  static propTypes = {
    isContentTaken: PropTypes.bool,
    contentPath: PropTypes.string,
    contentType: PropTypes.object,
    cameraHandler: PropTypes.object,
    setPermission: PropTypes.func,
    message: PropTypes.string,
    messageWritable: PropTypes.bool,
    toggleMessageWriteAble: PropTypes.func,
    permission: PropTypes.bool,
    cameraType: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      componentWidth: null
    }
  }

  componentDidMount () {
    // Permissions.getPermissionStatus('camera')
    // .then(response => {
    //   if (response === 'undetermined') {
    //     Permissions.requestPermission('camera').then(response => {
    //       if (response === 'authorized') {
    //         this.props.setPermission(true)
    //       } else {
    //         this.props.setPermission(false)
    //       }
    //     })
    //   } else if (response === 'denied') {
    //     this.props.setPermission(false)
    //   } else {
    //     this.props.setPermission(true)
    //   }
    // })
  }

  renderMessage () {
    if (!this.props.messageWritable) {
      return (
        // let position of text by marginTop due to bug of video
        <View style={{ position: 'absolute', marginBottom: 10, marginTop: this.state.componentWidth - this.state.componentWidth / 10, width: this.state.componentWidth, backgroundColor: 'rgba(0,0,0,0)' }}>
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              textShadowOffset: {width: 1, height: 2},
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowRadius: 1,
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center'}}
            onPress={() => { this.props.toggleMessageWriteAble() }}>
            {this.props.message}
          </Text>
        </View>
      )
    } else {
      return false
    }
  }

  renderPreview () {
    if (_.isEqual(this.props.contentType, ContentType.Image)) {
      return (
        <View>
          <Image style={{ position: 'absolute',
            height: this.state.componentWidth,
            width: this.state.componentWidth,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0 }} source={{uri: this.props.contentPath}}>
            {this.renderMessage()}
          </Image>
        </View>
      )
    } else if (_.isEqual(this.props.contentType, ContentType.Video)) {
      return (
        <View>
          <Video
            source={{uri: this.props.contentPath}}   // Can be a URL or a local file.
            muted
            ref={(ref) => { this.player = ref }}   // Store reference
            paused={false}                        // Pauses playback entirely.
            resizeMode='cover'                   // Fill the whole screen at aspect ratio.
            repeat                              // Repeat forever.
            playInBackground={false}          // Audio continues to play when app entering background.
            playWhenInactive                  // [iOS] Video continues to play when control or notification center are shown.
            progressUpdateInterval={250.0}   // [iOS] Interval to fire onProgress (default to ~250ms)
            style={{ position: 'absolute',
              height: this.state.componentWidth,
              width: this.state.componentWidth,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0 }} />
          {this.renderMessage()}
        </View>
      )
    } else {
      return false
    }
  }

  openPermissionSetting () {
    console.log('press openPermissionSetting')
    Permissions.openSettings()
  }

  renderAuthDenied () {
    return (
      <TouchableWithoutFeedback onPress={this.openPermissionSetting.bind(this)}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
          <View>
            <Text style={{fontSize: 17, color: 'rgb(255,255,255)', textAlign: 'center'}}>휴대폰 설정에서 카메라 사용을</Text>
            <Text style={{fontSize: 17, color: 'rgb(255,255,255)', textAlign: 'center'}}>허용해주세요</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderView () {
    if (!this.props.permission) {
      return (
        <View style={{flex: 1}}>
          {this.renderAuthDenied()}
        </View>
      )
    } else {
      if (this.props.isContentTaken) {
        return (
          <View style={{flex: 1}}>
            {this.renderPreview()}
          </View>
        )
      } else {
        return (
          <View sytle={{flex: 1}}>
            {/* <View style={{position: 'absolute', marginTop: 30, marginLeft: 10, height: this.state.componentWidth, width: this.state.componentWidth, zIndex: 1}} >
              <EpisodeControllerButton />
            </View> */}
            <View style={{position: 'absolute', marginTop: 8.5, alignItems: 'center', height: this.state.componentWidth, width: this.state.componentWidth, zIndex: 1}} >
              <View style={{width: 36, height: 4, borderRadius: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.5)'}} />
            </View>
            <Camera
              ref={(cam) => { this.props.cameraHandler.setCamera(cam) }}
              style={{ position: 'absolute', height: this.state.componentWidth, width: this.state.componentWidth }}
              captureMode={Camera.constants.CaptureMode.still}
              captureTarget={Camera.constants.CaptureTarget.disk}
              captureQuality={Camera.constants.CaptureQuality.high}
              // captureQuality={Camera.constants.CaptureQuality.photo}
              captureAudio={false}
              type={this.props.cameraType}
              defaultOnFocusComponent={false}
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
              aspect={Camera.constants.Aspect.fill} />
          </View>
        )
      }
    }
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} onLayout={(event) => { this.setState({ componentWidth: event.nativeEvent.layout.width }) }}>
        {this.renderView()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isContentTaken: state.cameraScreen.isContentTaken,
    contentPath: state.cameraScreen.contentPath,
    contentType: state.cameraScreen.contentType,
    message: state.cameraScreen.message,
    messageWritable: state.cameraScreen.messageWritable,
    permission: state.cameraScreen.permission,
    cameraType: state.cameraScreen.cameraType
  }
}

const mapStateToDispatch = (dispatch) => {
  return {
    setPermission: (state) => dispatch(CameraScreenActions.setPermission(state)),
    toggleMessageWriteAble: () => dispatch(CameraScreenActions.toggleMessageWriteAble())
  }
}

export default connect(mapStateToProps, mapStateToDispatch)(CameraSection)
