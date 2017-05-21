import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Animated
 } from 'react-native'
import * as Animatable from 'react-native-animatable'

import CachableImage from '../../Common/CachableImage'
import CachableVideo from '../../Common/CachableVideo'
import { Images } from '../../Themes'
// import { Images, Videos } from '../../Themes'
import { getRealm } from '../../Services/RealmFactory'
// import Video from 'react-native-video'

const realm = getRealm()
const windowSize = Dimensions.get('window')

class ContentDetailClass extends Component {

  static propTypes = {
    // 내려온 props
    length: PropTypes.number,
    number: PropTypes.number,
    episodeId: PropTypes.number,
    content: PropTypes.object,
    // episodeLiked: PropTypes.bool,

    like: PropTypes.func,
    dislike: PropTypes.func,

    token: PropTypes.string,

    openComment: PropTypes.func,
    getComment: PropTypes.func,
    postLike: PropTypes.func,
    deleteLike: PropTypes.func,
    commentModalHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      lastPress: 0,
      animation: false,
      textList: [ '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀' ],
      pressIn: 0,
      modalVisible: false,
      // episodeLiked: this.props.episodeLiked,
      IsAnimationTypeLike: this.props.content.liked,
      disabled: false,

      paused: true,
      visible: false,
      refresh: false,

      videoWidth: 0
    }
    this.hiddenOpacity = new Animated.Value(0)
  }

  componentDidMount () {
  }

  onDoublePress () {
    const delta = new Date().getTime() - this.state.lastPress
    const { token, episodeId } = this.props

    let episode = realm.objects('episode')
      .filtered('id = ' + episodeId)

    if (delta < 500) {
      // double tap happend
      console.log('더블탭발생')

      if (episode[0].like) {
        console.log(`like여부는 트루`)
        this.setState({
          animation: true,
          IsAnimationTypeLike: true,
          disabled: false
        })
      } else {
        console.log(`like여부는 폴스`)
        this.setState({
          animation: true,
          IsAnimationTypeLike: true,
          disabled: false
        })
        realm.write(() => {
          realm.create('episode', {id: episodeId, like: true}, true)
        })

        // EpisodeDetail관련
        // like수 올리기
        this.props.like()
        this.props.postLike(token, episodeId)
      }
    }

    this.setState({
      lastPress: new Date().getTime()
    })
  }

  onLongPress () {
    console.log('onlongpress 눌림')
    const {token, episodeId} = this.props
    const contentId = this.props.content.id

    // this.props.openComment(true)
    this.props.commentModalHandler()
    this.props.getComment(token, episodeId, contentId)
    console.log('onlongpress 끝남')
  }

  playVideo () {
    // this.setState({
    //   paused: false
    // })
    console.log('플레이비도')
    this.setState({
      visible: true
    }, () => {
      setTimeout(() => {
        // this.setState({
        //   videoWidth: windowSize.width - 30
        // })
        Animated.timing(
          this.hiddenOpacity,
          { toValue: 1, duration: 0 }
        ).start()
      }, 150)
    })
  }

  stopVideo () {
    // this.setState({
    //   paused: true
    // })
    this.setState({
      visible: false
    }, () => {
      setTimeout(() => {
        // this.setState({
        //   videoWidth: 0
        // })
        Animated.timing(
          this.hiddenOpacity,
          { toValue: 0, duration: 0 }
        ).start()
      }, 150)
    })
  }

  playLikeAnimation () {
    const { token, episodeId } = this.props

    this.setState({
      animation: true,
      IsAnimationTypeLike: true,
      disabled: false
    })

    realm.write(() => {
      realm.create('episode', {id: episodeId, like: true}, true)
    })
    // EpisodeDetail관련
    this.props.like()
    this.props.postLike(token, episodeId)
  }

  playUnikeAnimation () {
    const { token, episodeId } = this.props

    this.setState({
      animation: true,
      IsAnimationTypeLike: false,
      disabled: false
    })

    realm.write(() => {
      realm.create('episode', {id: episodeId, like: false}, true)
    })
    this.props.dislike()
    this.props.deleteLike(token, episodeId)
  }

  renderContentOverlayVideo (content, message) {
    if (this.state.visible) {
      return (
        <Animated.View style={{height: windowSize.width - 30, width: windowSize.width - 30, position: 'absolute', opacity: this.hiddenOpacity}} >
          <CachableVideo
            thumbnail={content.thumbnailPath}
            source={{uri: content.path}}   // Can be a URL or a local file.
            muted
            // videoRef={(ref) => {
            //   this.videoRef = ref
            //   this.props.playerRef = ref
            // }}
            // videoRef={this.props.playerRef}
            videoRef={this.videoRef}
            paused={false}                 // Pauses playback entirely.
            resizeMode='cover'             // Fill the whole screen at aspect ratio.
            repeat                         // Repeat forever.
            playInBackground={false}       // Audio continues to play when app entering background.
            playWhenInactive              // [iOS] Video continues to play when control or notification center are shown.
            progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }} />
          <View style={{flex: 1, alignItems: 'center'}} >
            <View style={{flex: 1}} />
            <View style={{flex: 1}} >
              {this.renderAnimation()}
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingRight: 15,
              paddingLeft: 15,
              marginBottom: 10,
              backgroundColor: 'rgba(0,0,0,0)'}}>
              <Text
                allowFontScaling={false}
                style={{
                  textShadowOffset: {width: 1, height: 2},
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowRadius: 1,
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 20 }} >
                {message}
              </Text>
            </View>
          </View>
        </Animated.View>
      )
    } else {
      return
    }
  }

  renderAnimation () {
    // const textIndex = Math.floor(Math.random() * 10)
    // const message = this.state.textList

    if (this.state.animation) {
      if (this.state.IsAnimationTypeLike) {
        return (
          <Animatable.View
            animation='zoomIn'
            duration={700}
            // style={{ textAlign: 'center', color: 'white', fontSize: 100, backgroundColor: 'rgba(0,0,0,0)' }}
            onAnimationEnd={() => {
              this.setState({
                animation: false
              })
            }}>
            {/* {message[textIndex]} */}
            <Image style={{width: 100, height: 90}} source={Images.like} />
          </Animatable.View>
        )
      } else {
        return (
          <Animatable.View
            animation='fadeIn'
            duration={750}
            style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onAnimationEnd={() => {
              this.setState({
                animation: false
              })
            }}>
            <View style={{
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.7)',
              width: 200,
              height: 37,
              marginTop: 50,
              alignItems: 'center',
              justifyContent: 'center'}}>
              <Text style={{fontSize: 15, color: 'white'}}>공감을 취소했습니다.</Text>
            </View>
          </Animatable.View>
        )
      }
    } else {
      return
    }
  }

  renderContent (content) {
    const paddingRight = this.props.number + 1 === this.props.length ? 15.5 : 0
    const message = content.message === 'undefined' ? '' : content.message

    if (content.type === 'Image') {
      return (
        <View style={{backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: paddingRight}}>
          <TouchableWithoutFeedback
            delayLongPress={350}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View>
              <Image
                imageRef={this.props.playerRef}
                style={{
                  alignItems: 'center',
                  height: windowSize.width - 30,
                  width: windowSize.width - 30
                }}
                source={{ uri: content.path }}
                // source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
                >
                <View style={{flex: 1, marginTop: 90}}>
                  {this.renderAnimation()}
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10, backgroundColor: 'rgba(0,0,0,0)', paddingRight: 15, paddingLeft: 15}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textShadowOffset: {width: 1, height: 2},
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 20 }} >
                    {message}
                  </Text>
                </View>
              </Image>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    // } else if (content.type === 'Video' && !this.state.visible) {
    } else if (content.type === 'Video') {
      const uri = content.thumbnailPath === undefined ? 'https://facebook.github.io/react/img/logo_og.png' : content.thumbnailPath

      return (
        <View style={{backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: paddingRight}}>
          <TouchableWithoutFeedback
            delayLongPress={350}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View>
              <Image
                imageRef={this.props.playerRef}
                style={{
                  alignItems: 'center',
                  height: windowSize.width - 30,
                  width: windowSize.width - 30
                }}
                source={{ uri: uri }} >
                <View style={{flex: 1, marginTop: 90}}>
                  {this.renderAnimation()}
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10, backgroundColor: 'rgba(0,0,0,0)', paddingRight: 15, paddingLeft: 15}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textShadowOffset: {width: 1, height: 2},
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 20 }} >
                    {message}
                  </Text>
                </View>
              </Image>
              {this.renderContentOverlayVideo(content, message)}
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      return (
        // , paddingRight: paddingRight
        <View style={{backgroundColor: '#FFFFFF', paddingLeft: 8}}>
          <TouchableWithoutFeedback
            disabled={this.state.disabled}
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View style={{height: windowSize.width - 30, width: windowSize.width - 30}} >
              <CachableVideo
                thumbnail={content.thumbnailPath}
                source={{uri: content.path}}   // Can be a URL or a local file.
                muted
                // videoRef={(ref) => {
                //   this.videoRef = ref
                //   this.props.playerRef = ref
                // }}
                // videoRef={this.props.playerRef}
                videoRef={this.videoRef}
                paused={false}                 // Pauses playback entirely.
                resizeMode='cover'             // Fill the whole screen at aspect ratio.
                repeat                         // Repeat forever.
                playInBackground={false}       // Audio continues to play when app entering background.
                playWhenInactive              // [iOS] Video continues to play when control or notification center are shown.
                progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }} />
              <View style={{flex: 1, alignItems: 'center'}} >
                <View style={{flex: 1}} />
                <View style={{flex: 1}} >
                  {this.renderAnimation()}
                </View>
                <View style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: 15,
                  paddingLeft: 15,
                  marginBottom: 10,
                  backgroundColor: 'rgba(0,0,0,0)'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textShadowOffset: {width: 1, height: 2},
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 20 }} >
                    {message}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  render () {
    const content = this.props.content

    return (
      <View>
        {this.renderContent(content)}
      </View>
    )
  }

}

const ContentDetail = Animatable.createAnimatableComponent(ContentDetailClass)

export default ContentDetail
