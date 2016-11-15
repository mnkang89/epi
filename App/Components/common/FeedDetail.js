import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from '../../Themes'

import * as Animatable from 'react-native-animatable'

class FeedDetailClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      lastPress: 0,
      animation: false,
      textList: ['좋아', '짜릿해', '맛있어', '최고야', '개좋아', '좋아', '짜릿해', '맛있어', '최고야', '개좋아'],
      pressIn: 0
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

  onLongPress () {
    NavigationActions.commentScreen({type: 'reset'})
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

  renderAlarm () {
    return (
      <View style={{flex: 1, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <Text style={{alignSelf: 'center'}}>아직 진행 중인 에피소드에요</Text>
          <Text style={{alignSelf: 'center'}}>아래 버튼을 눌러서 다음 글이 올라오면</Text>
          <Text style={{alignSelf: 'center'}}>알림을 받아보세요!</Text>
        </View>
        <View style={{marginTop: 30}}>
          <Icon
            name='bell'
            size={60}
            style={{width: 60, height: 60, alignSelf: 'center', fontWeight: '300'}}
          />
        </View>
      </View>
    )
  }

  render () {
    const { image } = this.props.album
    const {
            headerContentStyle,
            headerTextStyle,
            imageStyle,
            textStyle,
            textContainerStyle
          } = styles

    return (
      <Swiper height={488} showsButtons showsPagination={false} >
        <View>
          <TouchableWithoutFeedback
            delayLongPress={800}
            onPress={this.onDoublePress.bind(this)}
            onLongPress={this.onLongPress.bind(this)}>
            <Image style={imageStyle} source={{ uri: image }}>
              <View>
                <View style={headerContentStyle}>
                  <View style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                    <Text style={headerTextStyle}>#독수리다방</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 0}}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => NavigationActions.userProfileScreen({type: 'reset'})}>
                          <Image
                            style={styles.profileStyle}
                            source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                          />
                        </TouchableOpacity>
                        <Text style={{color: Colors.snow, fontWeight: 'bold', paddingTop: 20, paddingLeft: 5}}>신촌초보</Text>
                      </View>
                      <View style={{paddingTop: 20}}>
                        <Text style={{color: Colors.snow, fontSize: 10, justifyContent: 'flex-end'}}>재생 33,345</Text>
                        <Text style={{color: Colors.snow, fontSize: 10, justifyContent: 'flex-end'}}>업데이트 1분 전</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {this.renderAnimation()}
              </View>
            </Image>
          </TouchableWithoutFeedback>
          <View style={[textStyle, {paddingTop: 10, paddingLeft: 10}]}>
            <Text style={textContainerStyle}>오늘날씨 인정</Text>
          </View>
        </View>

        <View>
          <Image style={imageStyle} source={{ uri: image }} />
          <View style={textStyle}>
            <Text style={textContainerStyle}>댓글</Text>
          </View>
        </View>

        <View>
          <Image style={imageStyle} source={{ uri: image }} />
          <View style={textStyle}>
            <Text style={textContainerStyle}>댓글</Text>
          </View>
        </View>

        {this.renderAlarm()}
      </Swiper>
    )
  }
};

const styles = {
  headerContentStyle: {
    backgroundColor: 'rgba(0,0,0,.6)',
    height: 118
  },
  headerTextStyle: {
    color: Colors.snow,
    fontWeight: 'bold',
    fontSize: 35
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 375,
    flex: 1,
    width: null
  },
  profileStyle: {
    height: 50,
    width: 50,
    borderRadius: 30
  },
  textStyle: {
    backgroundColor: '#000000',
    flex: 1,
    height: 113
  },
  textContainerStyle: {
    color: Colors.snow,
    fontSize: 20,
    fontWeight: 'bold'
  },
  wrapper: {

  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
}

const FeedDetail = Animatable.createAnimatableComponent(FeedDetailClass)
export default FeedDetail
