import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal as NativeModal,
  TextInput,
  CameraRoll
} from 'react-native'
import { Images } from '../../Themes'
// import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import CameraScreenAction from '../../Redux/CameraScreenRedux'
import Camera from 'react-native-camera'
import EpisodeControllerButton from './EpisodeControllerButton'
import ProgressBar from './Progress-Bar'
import ConfirmError from '../common/ConfirmError'
import ContentType from './ContentTypeEnum'
// import ImageEditor from 'ImageEditor'
import ImageResizer from 'react-native-image-resizer'
import VideoResizer from './VideoResizer'
import _ from 'lodash'

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
      // 원본
      // CameraRoll.saveToCameraRoll(data.path)
      // ImageEditor
      // ImageEditor.cropImage(
      //   data.path,
      //   // TODO: this is just for iphone, improve this
      //   {offset: {x: 0, y: 420}, size: {width: 2448, height: 3264}, displaySize: {width: 1224, height: 1632}},
      //   (data) => {
      //     // 저장 로직을 업로드시점으로 이동
      //     CameraRoll.saveToCameraRoll(data)
      //     this.props.takeContent(ContentType.Image, data)
      //   },
      //   (err) => { console.err(err) }
      // )
      CameraRoll.saveToCameraRoll(data.path)
      this.props.takeContent(ContentType.Image, data.path)

      // ImageResizer.createResizedImage(data.path, 1224, 1632, 'JPEG', 50)
      //   .then((resizedImageUri) => {
      //     console.log('리사이징 성공')
      //     // CameraRoll.saveToCameraRoll(resizedImageUri)
      //     this.props.takeContent(ContentType.Image, resizedImageUri)
      //   }).catch((err) => {
      //     console.log('리사이징 실패')
      //     console.log(err)
      //   })

      // // ImageResizer Quality: 100
      // ImageResizer.createResizedImage(data.path, 2448, 2448, 'JPEG', 100)
      //   .then((resizedImageUri) => {
      //     console.log('리사이징 성공')
      //     CameraRoll.saveToCameraRoll(resizedImageUri)
      //   }).catch((err) => {
      //     console.log('리사이징 실패')
      //     console.log(err)
      //   })
      //
      // ImageResizer Quality: 80
      // ImageResizer.createResizedImage(data.path, 1224, 1632, 'JPEG', 70)
      //   .then((resizedImageUri) => {
      //     console.log('리사이징 성공')
      //     CameraRoll.saveToCameraRoll(resizedImageUri)
      //   }).catch((err) => {
      //     console.log('리사이징 실패')
      //     console.log(err)
      //   })
      //
      // // ImageResizer Quality: 40
      // ImageResizer.createResizedImage(data.path, 2448, 3264, 'JPEG', 50)
      //   .then((resizedImageUri) => {
      //     console.log('리사이징 성공')
      //     CameraRoll.saveToCameraRoll(resizedImageUri)
      //   }).catch((err) => {
      //     console.log('리사이징 실패')
      //     console.log(err)
      //   })
      //
      // // ImageResizer Quality: 20
      // ImageResizer.createResizedImage(data.path, 720, 720, 'JPEG', 20)
      //   .then((resizedImageUri) => {
      //     console.log('리사이징 성공')
      //     CameraRoll.saveToCameraRoll(resizedImageUri)
      //   }).catch((err) => {
      //     console.log('리사이징 실패')
      //     console.log(err)
      //   })
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
      CameraRoll.saveToCameraRoll(data.path)
      this.props.takeContent(ContentType.Video, data.path)
      VideoResizer.createResizedVideo(data.path)
        .then((resizedVideoUri) => {
          console.log('리사이징 성공')
          CameraRoll.saveToCameraRoll(resizedVideoUri)
        })
        .catch((err) => {
          console.log('리사이징 실패')
          console.log(err)
        })
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
            <View style={{ position: 'absolute', width: this.state.componentWidth, marginTop: this.margin - 10 }}>
              <TextInput
                value={this.state.message}
                style={{
                  height: 45,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  textShadowOffset: {width: 1, height: 2},
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowRadius: 1,
                  fontWeight: 'bold',
                  paddingLeft: 15,
                  paddingRight: 15,
                  marginBottom: 10 }}
                maxLength={300}
                multiline
                placeholder='코멘트 쓰기..'
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                enablesReturnKeyAutomatically
                editable
                onSubmitEditing={() => {
                  console.tron.log('controller state message ' + this.state.message)
                  this.props.registerContentText(this.state.message)
                  this.props.toggleMessageWriteAble()
                  return
                }}
                autofocus
                onChangeText={(text) => this.setState({message: text})} />
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
            visible >
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
            progress={this.state.progress} />
        </View>
      )
    } else {
      return
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
    // 이미지 리사이징은 이 함수에서 진행된 후, post된다.
    this.props.parentThis.activeLoadingModal()
    if (_.isEqual(this.props.contentType, ContentType.Image)) {
      ImageResizer.createResizedImage(this.props.contentPath, 1224, 1632, 'JPEG', 50)
        .then((resizedImageUri) => {
          console.log('리사이징 성공')
          this.props.postContent(this.props.contentType, resizedImageUri, this.props.message)
        }).catch((err) => {
          console.log('리사이징 실패')
          console.log(err)
        })
    } else if (_.isEqual(this.props.contentType, ContentType.Video)) {
      VideoResizer.createResizedVideo(this.props.contentPath)
        .then((resizedVideoUri) => {
          console.log('리사이징 성공')
          this.props.postContent(this.props.contentType, resizedVideoUri, this.props.message)
        })
        .catch((err) => {
          console.log('리사이징 실패')
          console.log(err)
        })
    } else {
      this.props.parentThis.deactiveLoadingModal()
    }
  }

  renderView () {
    if (this.props.isContentTaken) {
      return (
        <View style={{flex: 1}}>
          {this.renderCommentInput()}
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={this.pressBackToReadyToTakeContent.bind(this)}>
                <Image style={{width: 16, height: 27}} source={Images.backChevron} />
              </TouchableOpacity>
            </View>

            <View style={{flex: 2, alignItems: 'center'}}>
              <TouchableOpacity onPress={this.postContent.bind(this)}>
                <Image style={{width: 85, height: 85}} source={Images.aftercaptureButton} />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={this.onPressOpenTextInput.bind(this)} >
                <Image style={{width: 38, height: 38}} source={Images.write} />
              </TouchableOpacity>
            </View>
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
          </View>
          <View style={{flex: 70, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-around'}}>
            <View style={{flex: 1, alignItems: 'flex-end'}} >
              <EpisodeControllerButton />
            </View>

            <View style={{flex: 2, alignItems: 'center'}}>
              <TouchableWithoutFeedback
                delayLongPress={300}
                onPress={this.takePicture.bind(this)}
                onLongPress={this.takeVideo.bind(this)}
                onPressOut={this.takeContent.bind(this)}>
                <Image style={{width: 85, height: 85}} source={Images.captureButton} />
              </TouchableWithoutFeedback>
            </View>

            <View style={{flex: 1, paddingTop: 10}}>
              <TouchableOpacity
                onPress={this.switchCamera.bind(this)}>
                <Image source={Images.cameraSwitch} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 15}} />
        </View>
      )
    }
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}} onLayout={(event) => { this.setState({ componentWidth: event.nativeEvent.layout.width }) }}>
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
