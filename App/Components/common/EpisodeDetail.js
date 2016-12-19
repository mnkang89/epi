import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
 } from 'react-native'
// import * as Animatable from 'react-native-animatable'
import { Colors, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'

import ContentDetail from './ContentDetail'

class EpisodeDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderContents () {
    const contents = this.props.episode.contents
    const episodeId = this.props.episode.id

    return contents.map(content =>
      <ContentDetail
        key={contents.indexOf(content)}
        episodeId={episodeId}
        content={content} />
    )
  }

  render () {
    const {
      headerContentStyle,
      textStyle
    } = styles

    const active = this.props.episode.active
    const activeEpisodeLength = this.props.episode.contents.length
    const likeCount = this.props.episode.contents
      .map(content => content.likeCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(this.props.episode.createDateTime)

    // var는 es6에서 deprecated.. 어떻게 대체할지 고민해보자. state으로 처리할시 발생하는 성능문제
    var xPosition = 0

    if (active) {
      xPosition = (activeEpisodeLength - 1) * 350
    } else {
      xPosition = 0
    }
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
          contentOffset={{x: xPosition, y: 0}}
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

// const EpisodeDetail = Animatable.createAnimatableComponent(EpisodeDetailClass)
export default EpisodeDetail
