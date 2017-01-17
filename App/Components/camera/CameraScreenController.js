import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal as NativeModal,
  TextInput
} from 'react-native'
import { Images } from '../../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import CameraScreenAction from '../../Redux/CameraScreenRedux'
import Camera from 'react-native-camera'
import ProgressBar from './Progress-Bar'
import ConfirmError from '../common/ConfirmError'
import ContentType from './ContentTypeEnum'

class CameraScreenController extends Component {

  static propTypes = {
    isContentTaken: PropTypes.bool,
    takeContent: PropTypes.func,
    backToReadyToTakeContent: PropTypes.func,
    contentPath: PropTypes.string,
    contentType: PropTypes.object,
    registerContentText: PropTypes.func,
    cameraHandler: PropTypes.object,
    postContent: PropTypes.func,
    message: PropTypes.string,
    messageWritable: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      openInputText: null,
      message: null,
      messageWritable: null,
      timer: false,
      leftTime: 5,
      progress: 0,
      visibleBackToCamera: false,
      componentWidth: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ message: nextProps.message })
  }

  takePicture () {
    if (this.props.cameraHandler.getCamera() === null) return
    this.props.cameraHandler.getCamera().capture()
    .then((data) => {
      this.props.takeContent(ContentType.Image, data.path)
    })
    .catch(err => console.error(err))
  }

  stopProgress () {
    clearInterval(this.interval)
  }

  initializeProgress () {
    this.setState({
      leftTime: 5,
      progress: 0
    })
  }

  takeVideo () {
    console.tron.log('long press occur')
    this.setState({
      timer: true
    })
    this.props.cameraHandler.getCamera().capture({
      mode: Camera.constants.CaptureMode.video
    })
    .then((data) => {
      console.log(data)
      console.tron.log('video capture done')
      this.props.takeContent(ContentType.Video, data.path)
    })
    .catch(err => {
      console.tron.log('video capture err')
      console.log(err)
    })

    this.interval = setInterval(() => {
      if (this.state.leftTime <= 0) {
        console.tron.log('leftTime done')
        this.props.cameraHandler.getCamera().stopCapture()
        this.stopProgress()
        this.initializeProgress()
        this.setState({
          timer: false
        }
        )
      } else {
        this.setState({
          leftTime: this.state.leftTime - 1,
          progress: this.state.progress + 3750 * 2
        })
      }
    }, 1000)
  }

  onPressOpenTextInput () {
    this.props.toggleMessageWriteAble()
  }

  renderCommentArea () {
    this.margin = this.state.componentWidth - (this.state.componentWidth / 10)
    console.log(this.state.componentWidth)
    console.log(this.margin)
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.59)'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.tron.log('controller state message ' + this.state.message)
            this.props.registerContentText(this.state.message)
            this.props.toggleMessageWriteAble()
            return
          }}>

          <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', width: this.state.componentWidth, marginTop: this.margin }}>
              <TextInput
                value={this.state.message}
                style={{ height: 20, color: 'white', textAlign: 'center', fontSize: 20 }}
                maxLength={38}
                placeholder='코멘트 쓰기..'
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                enablesReturnKeyAutomatically
                editable
                onChangeText={(text) => this.setState({message: text})}
                autoFocus />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCommentInput () {
    if (this.props.messageWritable) {
      return (
        <View>
          <NativeModal
            animationType={'none'}
            transparent
            visible>
            {this.renderCommentArea()}
          </NativeModal>
        </View>
      )
    } else {
      return false
    }
  }

  renderTimerComponent () {
    if (this.state.timer) {
      return (
        <View style={{ height: 10, width: this.state.componentWidth }}>
          <ProgressBar
            fillstyles={{backgroundColor: 'rgb(250,0,0)', height: 10}}
            backgroundstyles={{backgroundColor: '#cccccc', borderRadius: 2, height: 10}}
            style={{width: this.state.componentWidth}}
            progress={this.state.progress}
            />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  switchCamera () {
    this.props.changeCameraType()
  }

  takeContent () {
    if (this.state.timer) {
      this.props.cameraHandler.getCamera().stopCapture()
      this.stopProgress()
      this.initializeProgress()
      this.setState({
        timer: false
      })
    }
  }

  pressBackToReadyToTakeContent () {
    if (this.props.message != null) {
      this.setState({ visibleBackToCamera: true })
    } else {
      this.backToReadyToTakeContent()
    }
  }

  backToReadyToTakeContent () {
    this.props.backToReadyToTakeContent()
    this.setState({ visibleBackToCamera: false })
  }

  postContent () {
    this.props.postContent(this.props.contentType, this.props.contentPath, this.props.message)
  }

  renderView () {
    if (this.props.isContentTaken) {
      return (
        <View style={{flex: 1}}>
          {this.renderCommentInput()}
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <TouchableOpacity
              style={{marginLeft: 30}}
              onPress={this.pressBackToReadyToTakeContent.bind(this)}>
              <Image style={{width: 30, height: 30}} source={Images.backChevron} />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.postContent.bind(this)}>
              <Image style={{width: 85, height: 85}} source={Images.aftercaptureButton} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginRight: 30}}
              onPress={this.onPressOpenTextInput.bind(this)} >
              <Image style={{width: 31, height: 31}} source={Images.write} />
            </TouchableOpacity>
          </View>
          <ConfirmError
            confirmStyle={'setting'}
            TextArray={['입력된 내용이 사라집니다.', '정말 뒤로 돌아가실건가요?']}
            onAccept={this.backToReadyToTakeContent.bind(this)}
            onSetting={() => this.setState({ visibleBackToCamera: false })}
            AcceptText={'네'}
            SettingText={'아니요'}
            visible={this.state.visibleBackToCamera} />
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
          <View style={{flex: 15, alignItems: 'flex-end', backgroundColor: 'white'}} >
            {this.renderTimerComponent()}
            <TouchableOpacity
              style={{marginRight: 10, marginTop: 10}}
              onPress={this.switchCamera.bind(this)}>
              <Icon
                name='repeat'
                size={20}
                style={{width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 70, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableWithoutFeedback
              delayLongPress={300}
              onPress={this.takePicture.bind(this)}
              onLongPress={this.takeVideo.bind(this)}
              onPressOut={this.takeContent.bind(this)}>
              <Image style={{width: 85, height: 85}} source={Images.captureButton} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex: 15}} />
        </View>
      )
    }
  }

  render () {
    return (
      <View style={{flex: 1}} onLayout={(event) => { this.setState({ componentWidth: event.nativeEvent.layout.width }) }}>
        {this.renderView()}
      </View>
    )
  }
}

const mapToProps = (state, ownProps) => {
  return {
    isContentTaken: state.cameraScreen.isContentTaken,
    contentPath: state.cameraScreen.contentPath,
    contentType: state.cameraScreen.contentType,
    message: state.cameraScreen.message,
    messageWritable: state.cameraScreen.messageWritable
  }
}

const mapToDispatch = (dispatch) => {
  return {
    takeContent: (contentType, contentPath) => dispatch(CameraScreenAction.takeContent(contentType, contentPath)),
    backToReadyToTakeContent: () => dispatch(CameraScreenAction.backToReadyToTakeContent()),
    backButtonPressed: () => dispatch(CameraScreenAction.backButtonPressed()),
    registerContentText: (message) => dispatch(CameraScreenAction.registerContentText(message)),
    postContent: (contentType, contentPath, message) => dispatch(CameraScreenAction.postContent(contentType, contentPath, message)),
    toggleMessageWriteAble: () => dispatch(CameraScreenAction.toggleMessageWriteAble()),
    changeCameraType: () => dispatch(CameraScreenAction.changeCameraType())
  }
}

export default connect(mapToProps, mapToDispatch)(CameraScreenController)
