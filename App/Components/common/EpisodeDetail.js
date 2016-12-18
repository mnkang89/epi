import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
 } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Colors, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'

import ContentDetail from './ContentDetail'

// const scrollViewPadding = scrollViewWidth * 0.08

class EpisodeDetailClass extends Component {
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

  renderContents () {
    const contents = this.props.episode.contents
    /*
    return this.props.episodes.map(episode =>
      <EpisodeDetail key={episode.id} episode={episode} />)
    */
    return contents.map(content =>
      <ContentDetail key={contents.indexOf(content)} content={content} />)
  }

  render () {
    const {
      headerContentStyle,
      textStyle
    } = styles

    const likeCount = this.props.episode.contents
      .map(content => content.likeCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(this.props.episode.createDateTime)

    return (
      <View>
        <View style={headerContentStyle}>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={styles.profileStyle}
                  source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: Colors.snow, fontWeight: 'bold', paddingLeft: 5}}>{this.props.episode.nickname}</Text>
                <Text style={{color: Colors.snow, fontSize: 13, paddingLeft: 130, justifyContent: 'flex-end'}}>최근 업데이트 : {timeDiffString}</Text>
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
          scrollEventThrottle={1000}
          directionalLockEnabled={false}
          decelerationRate={'fast'} >
          {this.renderContents()}
        </ScrollView>

        <View style={[textStyle, {backgroundColor: 'black', paddingTop: 15, marginLeft: 15, marginRight: 15}]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'white'}}>알림설정 : {this.props.episode.subscriberCount}</Text>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'white'}}>공감 : {likeCount}</Text>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'white'}}>댓글 123</Text>
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
    borderBottomColor: 'rgb(45, 45, 45)',
    alignItems: 'flex-end'
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

const EpisodeDetail = Animatable.createAnimatableComponent(EpisodeDetailClass)
export default EpisodeDetail
