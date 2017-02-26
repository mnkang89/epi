import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions
 } from 'react-native'
import * as Animatable from 'react-native-animatable'

import CachableImage from '../../Common/CachableImage'
import CachableVideo from '../../Common/CachableVideo'
import { Images } from '../../Themes'
// import { Videos } from '../../Themes'
// import Video from 'react-native-video'

const windowSize = Dimensions.get('window')

class ContentDetailClass extends Component {

  static propTypes = {
    // 내려온 props
    length: PropTypes.number,
    number: PropTypes.number,
    episodeId: PropTypes.number,
    content: PropTypes.object,

    like: PropTypes.func,
    dislike: PropTypes.func,

    token: PropTypes.string,

    openComment: PropTypes.func,
    getComment: PropTypes.func,
    postLike: PropTypes.func,
    deleteLike: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      paddingRight: this.props.number + 1 === this.props.length ? 14.5 : 0,
      lastPress: 0,
      animation: false,
      textList: [ '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀', '😀' ],
      pressIn: 0,
      modalVisible: false,
      liked: this.props.content.liked,
      IsAnimationTypeLike: this.props.content.liked,
      disabled: false,

      paused: true
    }
  }

  onDoublePress () {
    const delta = new Date().getTime() - this.state.lastPress
    const { token } = this.props
    const contentId = this.props.content.id

    if (delta < 500) {
      // double tap happend
      console.log('더블탭발생')

      if (this.state.liked) {
        console.log(`like여부는 트루${this.state.liked}`)
        this.setState({
          animation: true,
          IsAnimationTypeLike: false,
          liked: false,
          disabled: false
        })
        this.props.dislike()
        // delete날리기
        this.props.deleteLike(token, contentId)
      } else {
        console.log(`like여부는 폴스${this.state.liked}`)
        this.setState({
          animation: true,
          IsAnimationTypeLike: true,
          liked: true,
          disabled: false
        })
        this.props.like()
        // post날리기
        this.props.postLike(token, contentId)
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

    this.props.openComment(true)
    this.props.getComment(token, episodeId, contentId)
    console.log('onlongpress 끝남')
  }

  playVideo () {
    console.log('비디오 켜라: ' + this.props.episodeId)
    this.setState({
      paused: false
    })
  }

  stopVideo () {
    this.setState({
      paused: true
    })
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
            <Image style={{marginTop: 30, width: 100, height: 90}} source={Images.like} />
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
    // const { imageStyle } = styles
    const paddingRight = this.state.paddingRight
    const message = content.message === 'undefined' ? '' : content.message

    if (content.type === 'Image') {
      return (
        <View style={{backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: paddingRight}}>
          <TouchableWithoutFeedback
            delayLongPress={350}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View>
              <CachableImage
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
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10, backgroundColor: 'rgba(0,0,0,0)'}}>
                  <Text
                    style={{
                      textShadowOffset: {width: 1, height: 2},
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 'bold' }} >
                    {message}
                  </Text>
                </View>
              </CachableImage>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      return (
        <View style={{backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: paddingRight}}>
          <TouchableWithoutFeedback
            disabled={this.state.disabled}
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View style={{height: windowSize.width - 30, width: windowSize.width - 30}}>
              <CachableVideo
                source={{uri: content.path}}   // Can be a URL or a local file.
                // source={Videos.ragu_8}
                muted
                videoRef={this.props.playerRef}                             // Store reference
                paused={this.state.paused}                 // Pauses playback entirely.
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
              <View style={{alignItems: 'center'}} >
                <View style={{marginTop: 90}}>
                  {this.renderAnimation()}
                </View>
                <View style={{justifyContent: 'flex-end', marginBottom: 10, backgroundColor: 'rgba(0,0,0,0)'}}>
                  <Text
                    style={{
                      textShadowOffset: {width: 1, height: 2},
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 'bold' }}>
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
      <View style={{overflow: 'hidden'}}>
        {this.renderContent(content)}
      </View>
    )
  }

}

const ContentDetail = Animatable.createAnimatableComponent(ContentDetailClass)

export default ContentDetail
