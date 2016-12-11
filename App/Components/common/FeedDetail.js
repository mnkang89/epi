import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
// import Swiper from 'react-native-swiper'
// import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics } from '../../Themes/'

import * as Animatable from 'react-native-animatable'

// const scrollViewPadding = scrollViewWidth * 0.08

class FeedDetailClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
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

  render () {
    const { image } = this.props.album
    const {
            headerContentStyle,
            imageStyle,
            textStyle
          } = styles

    return (
      <View>
        <View style={headerContentStyle}>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => NavigationActions.userProfileScreen({duration: 100})}>
                <Image
                  style={styles.profileStyle}
                  source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: Colors.snow, fontWeight: 'bold', paddingLeft: 5}}>신촌초보</Text>
                <Text style={{color: Colors.snow, fontSize: 13, paddingLeft: 130, justifyContent: 'flex-end'}}>최근 업데이트 : 1분 전</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          style={{paddingLeft: 7.5, paddingRight: 7.5}}
          horizontal
          snapToAlignment={'start'}
          snapToInterval={350}
          showsHorizontalScrollIndicator
          scrollEventThrottle={299}
          directionalLockEnabled
          decelerationRate={'fast'} >
          <View style={{backgroundColor: 'black', paddingLeft: 4}}>
            <TouchableWithoutFeedback
              delayLongPress={800}
              onPress={this.onDoublePress.bind(this)}
              onLongPress={() => {
                this.onLongPress(!this.state.modalVisible)
                console.log(this.state.modalVisible)
              }}
              >
              <Image style={imageStyle} source={{ uri: image }}>
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
          <View style={{backgroundColor: 'black', paddingLeft: 8}}>
            <TouchableWithoutFeedback
              delayLongPress={800}
              onPress={this.onDoublePress.bind(this)}
              onLongPress={() => {
                this.onLongPress(!this.state.modalVisible)
                console.log(this.state.modalVisible)
              }}
              >
              <Image style={imageStyle} source={{ uri: image }}>
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
          <View style={{backgroundColor: 'black', paddingLeft: 8, paddingRight: 17.5}}>
            <TouchableWithoutFeedback
              delayLongPress={800}
              onPress={this.onDoublePress.bind(this)}
              onLongPress={() => {
                this.onLongPress(!this.state.modalVisible)
                console.log(this.state.modalVisible)
              }}
              >
              <Image style={imageStyle} source={{ uri: image }}>
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
        </ScrollView>

        <View style={[textStyle, {backgroundColor: 'black', paddingTop: 15, marginLeft: 15, marginRight: 15}]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, paddingLeft: 145, color: 'white'}}>알림설정 99</Text>
            <Text style={{fontSize: 13, paddingLeft: 10, color: 'white'}}>공감 9,999</Text>
            <Text style={{fontSize: 13, paddingLeft: 10, color: 'white'}}>댓글 123</Text>
          </View>
        </View>
      </View>
    )
  }
};

const styles = {
  headerContentStyle: {
    backgroundColor: 'black'
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
    height: 345,
    width: 345,
    borderRadius: 10
  },
  profileStyle: {
    width: Metrics.icons.large,
    height: Metrics.icons.large,
    borderRadius: Metrics.icons.large / 2
  },
  textStyle: {
    backgroundColor: '#000000',
    flex: 1,
    height: 43,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(45, 45, 45)'
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
