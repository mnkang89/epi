import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback
 } from 'react-native'
import Video from 'react-native-video'
// import { Actions as NavigationActions } from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable'

class ContentDetailClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lastPress: 0,
      animation: false,
      textList: ['좋아', '짜릿해', '맛있어', '최고야', '개좋아', '좋아', '짜릿해', '맛있어', '최고야', '개좋아'],
      pressIn: 0,
      modalVisible: false
    }
  }

  onDoublePress () {
    const delta = new Date().getTime() - this.state.lastPress

    if (delta < 500) {
      // double tap happend
      console.log('더블탭발생')
      this.setState({
        animation: true
      })
    }

    this.setState({
      lastPress: new Date().getTime()
    })
  }

  onLongPress (visible) {
    // NavigationActions.commentScreen({type: 'reset'})
    // this.setState({modalVisible: visible})
  }

  renderAnimation () {
    const textIndex = Math.floor(Math.random() * 10)
    const message = this.state.textList

    if (this.state.animation) {
      return (
        <Animatable.Text
          animation='zoomIn'
          style={{ textAlign: 'center', color: 'white', fontSize: 100, backgroundColor: 'rgba(0,0,0,0)' }}
          onAnimationEnd={() => { this.setState({animation: false}) }}>
          {message[textIndex]}
        </Animatable.Text>
      )
    } else {
      return
    }
  }

  renderContent (content) {
    const { imageStyle } = styles

    if (content.type === 'Image') {
      return (
        <View style={{backgroundColor: 'black', paddingLeft: 4}}>
          <TouchableWithoutFeedback
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={() => {
              this.onLongPress(!this.state.modalVisible)
              console.log(this.state.modalVisible)
            }} >
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
        <View style={{backgroundColor: 'black', paddingLeft: 4}}>
          <TouchableWithoutFeedback
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={() => {
              this.onLongPress(!this.state.modalVisible)
              console.log(this.state.modalVisible)
            }} >
            <View style={{height: 345, width: 345}}>
              <Video
                source={{uri: content.path}}   // Can be a URL or a local file.
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

const ContentDetail = Animatable.createAnimatableComponent(ContentDetailClass)
export default ContentDetail
