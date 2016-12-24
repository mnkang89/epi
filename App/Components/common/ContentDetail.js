import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback
 } from 'react-native'
import Video from 'react-native-video'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'

import CommentActions from '../../Redux/CommentRedux'
import ContentActions from '../../Redux/ContentRedux'

class ContentDetailClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lastPress: 0,
      animation: false,
      textList: ['좋아', '짜릿해', '맛있어', '최고야', '개좋아', '좋아', '짜릿해', '맛있어', '최고야', '개좋아'],
      pressIn: 0,
      modalVisible: false,
      liked: this.props.content.liked,
      IsAnimationTypeLike: this.props.content.liked,
      disabled: false
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

    this.props.getComment(token, episodeId, contentId)
    console.log('onlongpress 끝남')
  }

  renderAnimation () {
    const textIndex = Math.floor(Math.random() * 10)
    const message = this.state.textList

    if (this.state.animation) {
      if (this.state.IsAnimationTypeLike) {
        return (
          <Animatable.Text
            animation='zoomIn'
            style={{ textAlign: 'center', color: 'white', fontSize: 100, backgroundColor: 'rgba(0,0,0,0)' }}
            onAnimationEnd={() => {
              this.setState({
                animation: false
              })
            }}>
            {message[textIndex]}
          </Animatable.Text>
        )
      } else {
        return (
          <Animatable.View
            animation='fadeIn'
            duration={1000}
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
    const { imageStyle } = styles

    if (content.type === 'Image') {
      return (
        <View style={{backgroundColor: 'black', paddingLeft: 8, paddingRight: 0}}>
          <TouchableWithoutFeedback
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={() => this.onLongPress()} >
            <Image style={imageStyle} source={{ uri: content.path }}>
              <View style={{height: 295, paddingTop: 80}}>
                {this.renderAnimation()}
              </View>
              <View style={{alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>코멘트를남길수있음니다웬만하면짧게남겨</Text>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>최대 두 줄까지로 합시다 한줄 넘짧</Text>
              </View>
            </Image>
          </TouchableWithoutFeedback>
        </View>
      )
    } else {
      return (
        <View style={{backgroundColor: 'black', paddingLeft: 8}}>
          <TouchableWithoutFeedback
            disabled={this.state.disabled}
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)} >
            <View style={{height: 345, width: 345}}>
              <Video
                source={{uri: content.path}}   // Can be a URL or a local file.
                muted
                ref={(ref) => {
                  this.player = ref
                }}                             // Store reference
                paused={false}                 // Pauses playback entirely.
                resizeMode='cover'             // Fill the whole screen at aspect ratio.
                repeat={false}                         // Repeat forever.
                playInBackground={false}       // Audio continues to play when app entering background.
                playWhenInactive              // [iOS] Video continues to play when control or notification center are shown.
                progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 10
                }} />
              <View style={{height: 295, paddingTop: 80}}>
                {this.renderAnimation()}
              </View>
              <View style={{alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>코멘트를남길수있음니다웬만하면짧게남겨</Text>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>최대 두 줄까지로 합시다 한줄 넘짧</Text>
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
};

const styles = {
  imageStyle: {
    height: 345,
    width: 345,
    borderRadius: 10
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    openCommentModal: (episodeId, contentId, visible) => dispatch(CommentActions.openComment(episodeId, contentId, visible)),
    postLike: (token, contentId) => dispatch(ContentActions.likePost(token, contentId)),
    deleteLike: (token, contentId) => dispatch(ContentActions.likeDelete(token, contentId))
  }
}

const ContentDetail = Animatable.createAnimatableComponent(ContentDetailClass)
export default connect(mapStateToProps, mapDispatchToProps)(ContentDetail)
