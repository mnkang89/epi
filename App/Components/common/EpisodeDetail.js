import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
  Dimensions
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'

import ContentContainer from '../../Containers/common/ContentContainer'

const windowSize = Dimensions.get('window')

class EpisodeDetail extends Component {

  static propTypes = {
    account: PropTypes.object,
    episode: PropTypes.object,

    xPosition: PropTypes.number,
    type: PropTypes.string,
    singleType: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      likeCount: this.props.episode.contents.map(content => content.likeCount).reduce((a, b) => a + b, 0),
      contentTypeArray: []
    }
    // 컨텐츠 컴포넌트 ref
    this.contentRefs = []
    // 비디오 컴포넌트 ref
    // this.player는 deprecated될 수 있음.
    this.player = []
  }

  componentWillMount () {
    const contentTypeArray = []

    for (let i = 0; i < this.props.episode.contents.length; i++) {
      contentTypeArray.push(this.props.episode.contents[i].type)
    }

    console.log('컨텐츠 타입 어레이')
    console.log(contentTypeArray)
    this.setState({
      contentTypeArray
    })
  }

  componentDidMount () {
    // console.log(this.contentRefs)
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
/*
renderContents () {
  const contents = this.props.episode.contents
  const episodeId = this.props.episode.id

  return contents.map(content =>
    <ContentContainer
      ref={(component) => {
        this.contentRefs = component
      }}
      key={contents.indexOf(content)}
      length={contents.length}
      number={contents.indexOf(content)}
      episodeId={episodeId}
      content={content}
      like={this.like.bind(this)}
      dislike={this.dislike.bind(this)} />
  )
}
*/
  onPressProfile () {
    const accountId = this.props.episode.accountId

    if (this.props.type === 'me' ||
        this.props.type === 'other') {
    } else if (this.props.type === 'single') {
      if (this.props.singleType === 'noti') {
        NavigationActions.notiTouserProfileScreen({
          type: 'push',
          id: accountId,
          screen: 'NotiScreen'
        })
      } else {
        NavigationActions.searchTouserProfileScreen({
          type: 'push',
          id: accountId,
          screen: 'SearchScreen'
        })
      }
    } else {
      NavigationActions.feedTouserProfileScreen({
        type: 'push',
        id: accountId,
        screen: 'FeedScreen'
      })
    }
  }

  handleScroll (event) {
    // const xPoint = event.nativeEvent.contentOffset.x
  }

  handleMomentumScrollEnd (event) {
    const xPoint = event.nativeEvent.contentOffset.x
    const index = Math.floor(xPoint / (windowSize.width - 60))

    // 위치가 가운데가 아니고 비디오인 컨텐츠들에 대해 for문으로 stopVideo메써드 호출
    for (let i = 0; i < this.state.contentTypeArray.length; i++) {
      if (this.state.contentTypeArray[i] === 'Video' && i !== index) {
        console.log('일단 비디오면 껐다')
        this.contentRefs[i].getWrappedInstance()._root._component.stopVideo()
      }
    }

    // if 중간에온 컨텐츠가 video이면
    if (this.state.contentTypeArray[index] === 'Video') {
      this.contentRefs[index].getWrappedInstance()._root._component.playVideo()
      this.player[index].seek(0)
    }
  }

  renderProfileImage () {
    console.log(this.props.account.profileImagePath)
    let uri = `${this.props.account.profileImagePath}?random_number=${new Date().getTime()}`
    if (this.props.account.profileImagePath) {
      return (
        <Image
          style={styles.profileStyle}
          source={{uri}} />
      )
    } else {
      return (
        <Image
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
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const contents = this.props.episode.contents
    const episodeId = this.props.episode.id
    this.dataSource = ds.cloneWithRows(contents.slice())

    const active = this.props.episode.active
    const activeEpisodeLength = this.props.episode.contents.length
    const commentCount = this.props.episode.contents.map(content => content.commentCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(
      this.props.episode.updatedDateTime || this.props.episode.createDateTime)
    const {
      headerContentStyle
      // textStyle
    } = styles

    let xPosition = 0

    if (!this.props.xPosition) {
      if (active) {
        xPosition = (activeEpisodeLength - 1) * (windowSize.width - 22)
      } else {
        xPosition = 0
      }
    } else {
      xPosition = this.props.xPosition
    }
    return (
      <View style={{flex: 1, overflow: 'hidden'}}>
        <View style={headerContentStyle}>
          <View style={{width: windowSize.width - 30, marginTop: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <View>
                  {this.renderActiveRed()}
                  <TouchableOpacity
                    onPress={this.onPressProfile.bind(this)}>
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
        <ListView
          removeClippedSubviews
          pageSize={2}
          style={{marginTop: 10, paddingLeft: 7.5, paddingRight: 7.5}}
          contentOffset={{x: xPosition, y: 0}}
          onScroll={this.handleScroll.bind(this)}
          onScrollBeginDrag={() => console.log('onScrollBeginDrag')}
          onScrollEndDrag={() => console.log('onScrollEndDrag')}
          onMomentumScrollBegin={() => console.log('onMomentumScrollBegin')}
          onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
          scrollEventThrottle={100}
          horizontal
          snapToAlignment={'start'}
          snapToInterval={windowSize.width - 22}
          showsHorizontalScrollIndicator
          directionalLockEnabled={false}
          decelerationRate={'fast'}
          dataSource={this.dataSource}
          renderRow={(content) => {
            return (
              <ContentContainer
                ref={(component) => {
                  this.contentRefs[contents.indexOf(content)] = component
                }}
                playerRef={(player) => { this.player[contents.indexOf(content)] = player }}
                key={contents.indexOf(content)}
                length={contents.length}
                number={contents.indexOf(content)}
                episodeId={episodeId}
                content={content}
                like={this.like.bind(this)}
                dislike={this.dislike.bind(this)} />
            )
          }} />
        <View style={{width: windowSize.width - 30, backgroundColor: 'black', paddingTop: 15}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'rgb(217,217,217)'}}>공감 {this.state.likeCount}</Text>
            <Text style={{fontSize: 13, color: 'rgb(217,217,217)'}}>댓글 {commentCount}</Text>
          </View>
        </View>
      </View>
    )
  }

}

EpisodeDetail.defaultProps = {
  type: null,
  singleType: null
}

const styles = {
  headerContentStyle: {
    backgroundColor: 'black',
    alignItems: 'center'
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
