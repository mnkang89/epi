import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'

import ContentDetail from './ContentDetail'

class EpisodeDetail extends Component {

  static propTypes = {
    account: PropTypes.object,
    episode: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      likeCount: this.props.episode.contents.map(content => content.likeCount).reduce((a, b) => a + b, 0)
    }
  }

  like () {
    this.setState({
      likeCount: this.state.likeCount + 1
    })
  }

  dislike () {
    this.setState({
      likeCount: this.state.likeCount - 1
    })
  }

  renderContents () {
    const contents = this.props.episode.contents
    const episodeId = this.props.episode.id

    return contents.map(content =>
      <ContentDetail
        key={contents.indexOf(content)}
        length={contents.length}
        number={contents.indexOf(content)}
        episodeId={episodeId}
        content={content}
        like={this.like.bind(this)}
        dislike={this.dislike.bind(this)} />
    )
  }

  onProfilePress () {
    const accountId = this.props.episode.accountId
    console.log(accountId)
    NavigationActions.feedTouserProfileScreen({
      type: 'push',
      id: accountId
    })
  }

  handleScroll (event) {
    const xPoint = event.nativeEvent.contentOffset.x
    console.log(xPoint)
  }

  renderProfileImage () {
    if (this.props.account.profileImagePath) {
      return (<Image
        style={styles.profileStyle}
        source={{uri: this.props.account.profileImagePath}} />
      )
    } else {
      return (<Image
        style={styles.profileStyle}
        source={Images.profileImage} />
      )
    }
  }

  renderActiveRed () {
    if (this.props.episode.active) {
      return (
        <View style={{top: 7, left: 33, height: 5.5, width: 5.5, borderRadius: 2.75, backgroundColor: '#FC1617'}} />
      )
    } else {
      return
    }
  }

  render () {
    const {
      headerContentStyle,
      textStyle
    } = styles

    const active = this.props.episode.active
    const activeEpisodeLength = this.props.episode.contents.length
    const commentCount = this.props.episode.contents.map(content => content.commentCount).reduce((a, b) => a + b, 0)
    /*
    const likeCount = this.props.episode.contents
      .map(content => content.likeCount).reduce((a, b) => a + b, 0)
    */
    const timeDiffString = convert2TimeDiffString(
      this.props.episode.updatedDateTime || this.props.episode.createDateTime)

    // var는 es6에서 deprecated.. 어떻게 대체할지 고민해보자. state으로 처리할시 발생하는 성능문제
    // 2017/01/01 let으로 바꿧음
    let xPosition = 0

    if (active) {
      xPosition = (activeEpisodeLength - 1) * 353
    } else {
      xPosition = 0
    }
    return (
      <View>
        <View style={headerContentStyle}>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <View>
                  {this.renderActiveRed()}
                  <TouchableOpacity
                    onPress={this.onProfilePress.bind(this)}>
                    {this.renderProfileImage()}
                  </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'flex-start', paddingLeft: 5}}>
                  <Text style={{color: 'rgb(217,217,217)', fontWeight: 'bold'}}>{this.props.account.nickname}</Text>
                </View>
              </View>
              <View>
                <Text style={{color: 'rgb(217,217,217)', fontSize: 13}}>최근 업데이트 : {timeDiffString}</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          style={{paddingLeft: 7.5, paddingRight: 7.5}}
          contentOffset={{x: xPosition, y: 0}}
          onScroll={this.handleScroll.bind(this)}
          scrollEventThrottle={5000}
          horizontal
          snapToAlignment={'start'}
          snapToInterval={353}
          showsHorizontalScrollIndicator
          directionalLockEnabled={false}
          decelerationRate={'fast'} >
          {this.renderContents()}
        </ScrollView>

        <View style={[textStyle, {backgroundColor: 'black', paddingTop: 15, marginLeft: 15, marginRight: 15}]}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'rgb(217,217,217)'}}>공감 {this.state.likeCount}</Text>
            <Text style={{fontSize: 13, color: 'rgb(217,217,217)'}}>댓글 {commentCount}</Text>
          </View>
        </View>
      </View>
    )
  }
}

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

export default EpisodeDetail
