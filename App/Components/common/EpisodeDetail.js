import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
// import _ from 'lodash'

import FlatListE from '../../Experimental/FlatList_e'
import { Colors, Images, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'
import { getRealm } from '../../Services/RealmFactory'

// import CachableImage from '../../Common/CachableImage'
import ContentContainer from '../../Containers/common/ContentContainer'

const windowSize = Dimensions.get('window')
const realm = getRealm()
// const ITEM_WIDTH = 367.5

class EpisodeDetail extends Component {

  static propTypes = {
    token: PropTypes.string,
    account: PropTypes.object,
    episode: PropTypes.object,

    xPosition: PropTypes.number,
    type: PropTypes.string,
    singleType: PropTypes.string,

    parentHandler: PropTypes.object,
    requestNewEpisode: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      renderLikeHeart: this.props.episode.liked,
      likeCount: this.props.episode.likeCount,
      contentTypeArray: [],

      footer: false
    }
    this._listRef
    // 컨텐츠 컴포넌트 ref
    this.contentRefs = {}
    // 비디오 컴포넌트 ref
    // this.player는 deprecated될 수 있음.
    this.player = []
    this.currentCenterIndex = 0
    this.horizontalLock = true

    this.lastContentOffset
    this.dragStartingOffset
    this.dragEndingOffset
    this.isPlayVideo = false
  }

  componentDidMount () {
    const centerIndex = this.currentCenterIndex
    const episodeId = this.props.episode.id
    const liked = this.props.episode.liked
    let episode = realm.objects('episode')
      .filtered('id = ' + episodeId)

    for (let i = 0; i < this.state.contentTypeArray.length; i++) {
      if (this.state.contentTypeArray[i] === 'Video' &&
          // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
          i !== centerIndex &&
          // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
          this.contentRefs[i] !== undefined &&
          // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
          this.contentRefs[i] !== null) {
        this.contentRefs[i].getWrappedInstance()._root._component.stopVideo()
      }
    }

    if (this.state.contentTypeArray[centerIndex] === 'Video' &&
        this.contentRefs[centerIndex] !== null &&
        this.contentRefs[centerIndex] !== undefined) {
      this.contentRefs[centerIndex].getWrappedInstance()._root._component.playVideo()
      this.currentCenterIndex = centerIndex
    }

    if (episode.length === 0) {
      realm.write(() => {
        realm.delete(episode)
        if (liked === undefined) {
          realm.create('episode', {id: episodeId, like: false})
        } else {
          realm.create('episode', {id: episodeId, like: liked})
        }
      })
    } else {
      return
    }
  }

  componentWillMount () {
    const contentTypeArray = []

    for (let i = 0; i < this.props.episode.contents.length; i++) {
      contentTypeArray.push(this.props.episode.contents[i].type)
    }
    this.setState({
      contentTypeArray
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log('리시브프랍스인 에피소드디테일')
    if (this.state.footer) {
      this.setState({
        footer: false
      })
    }
  }

  stopEpisodeVideo = () => {
    this.isPlayVideo = false
    for (let i = 0; i < this.state.contentTypeArray.length; i++) {
      if (this.state.contentTypeArray[i] === 'Video' &&
          // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
          this.contentRefs[i] !== undefined &&
          // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
          this.contentRefs[i] !== null) {
        this.contentRefs[i].getWrappedInstance()._root._component.stopVideo()
      }
    }
  }

  playEpisodeVideo = () => {
    if (this.state.contentTypeArray[this.currentCenterIndex] === 'Video') {
      // this.contentRefs[this.currentCenterIndex].getWrappedInstance()._root._component.playVideo()
      this.isPlayVideo = true
      setTimeout(() => {
        if (this.isPlayVideo) { this.contentRefs[this.currentCenterIndex].getWrappedInstance()._root._component.playVideo() }
      }, 400)
    }
  }

  like () {
    this.setState({
      likeCount: this.state.likeCount + 1,
      renderLikeHeart: true
    })
  }

  dislike () {
    this.setState({
      likeCount: this.state.likeCount - 1,
      renderLikeHeart: false
    })
  }

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
      this.props.pushHandler()
      setTimeout(() => {
        NavigationActions.feedTouserProfileScreen({
          type: 'push',
          id: accountId,
          screen: 'FeedScreen',
          topOfStack: true,
          popHandler: this.props.popHandler,
          onBack: () => {
            this.props.popHandler()
            NavigationActions.pop()
          }
        })
      }, 500)
    }
  }

  _onScrollBeginDrag (event) {
    const active = this.props.episode.active

    if (active) {
      this.dragStartingOffset = event.nativeEvent.contentOffset.x
      const dragStartingOffset = event.nativeEvent.contentOffset.x

      if (dragStartingOffset >= this.lastContentOffset) {
        this.setState({footer: true})
      }
    }
  }

  _onScrollEndDrag (event) {
    const active = this.props.episode.active

    if (active) {
      const { token, episode } = this.props
      this.dragEndingOffset = event.nativeEvent.contentOffset.x

      // 오른쪽에서 왼쪽컨텐츠로 가면 푸터취소
      if (this.dragStartingOffset - this.dragEndingOffset > 0) {
        // 푸터가 활성상태일때만 취소
        if (this.state.footer) {
          this.setState({footer: false})
        }
      } else if (
          this.dragStartingOffset >= this.lastContentOffset &&
          this.dragStartingOffset - this.dragEndingOffset < 0) {
        if (this.props.type === 'other') {
          // this.props.requestNewEpisode(token, this.props.episode.accountId, episode.id)
        } else {
          console.log('mememe newnew')
          this.props.requestNewEpisode(token, episode.id)
        }
      }
    }
  }

  _onMomentumScrollBegin (event) {
    this.horizontalLock = false
  }

  _onMomentumScrollEnd (event) {
    const episodeId = this.props.episode.id
    const offset = event.nativeEvent.contentOffset.x
    let episode = realm.objects('episode')
      .filtered('id = ' + episodeId)
    this.currentCenterIndex = offset / (windowSize.width - 22)

    realm.write(() => {
      realm.create('episode', {id: episodeId, offset: offset}, true)
      console.log(episode[0].offset)
    })
  }

  _onPressHeart () {
    const episodeId = this.props.episode.id
    let episode = realm.objects('episode')
      .filtered('id = ' + episodeId)

    if (this.contentRefs[this.currentCenterIndex] !== null &&
        this.contentRefs[this.currentCenterIndex] !== undefined) {
      if (episode[0].like) {
        this.setState({
          renderLikeHeart: false
        })
        this.contentRefs[this.currentCenterIndex].getWrappedInstance()._root._component.playUnikeAnimation()
      } else {
        this.setState({
          renderLikeHeart: true
        })
        this.contentRefs[this.currentCenterIndex].getWrappedInstance()._root._component.playLikeAnimation()
      }
    }
  }

  _onPressComment () {
    const episodeId = this.props.episode.id
    const contentId = this.props.episode.contents[this.currentCenterIndex].id
    const token = null

    // this.props.openComment(true)
    this.props.commentModalHandler()
    this.props.getComment(token, episodeId, contentId)
  }

  renderProfileImage () {
    let uri = this.props.account.profileImagePath
    // let uri = 'https://facebook.github.io/react/img/logo_og.png'
    if (this.props.account.profileImagePath) {
      return (
        <Image
          style={styles.profileStyle}
          source={{uri: uri}} />
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
        <View style={{top: 7, left: 33, height: 5.5, width: 5.5, borderRadius: 2.75, backgroundColor: '#D02C2C'}} />
      )
    } else {
      return
    }
  }

  renderLikeHeart () {
    if (this.state.renderLikeHeart) {
      return (
        <Image style={{width: 24, height: 20}} source={Images.likeHeart} />
      )
    } else {
      return (
        <Image style={{width: 24, height: 20}} source={Images.unlikeHeart} />
      )
    }
  }

  render () {
    const episodeId = this.props.episode.id
    const activeEpisodeLength = this.props.episode.contents.length
    const commentCount = this.props.episode.contents.map(content => content.commentCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(
      this.props.episode.updatedDateTime || this.props.episode.createDateTime)
    const {
      headerContentStyle
    } = styles

    let episode = realm.objects('episode').filtered('id = ' + episodeId)
    let xPosition = 0

    this.lastContentOffset = (activeEpisodeLength - 1) * (windowSize.width - 22)

    if (this.props.xPosition === undefined) {
      if (episode[0] === undefined) {
        xPosition = 0
      } else {
        xPosition = episode[0].offset
      }
      this.currentCenterIndex = xPosition / (windowSize.width - 22)
    } else {
      xPosition = this.props.xPosition
      this.currentCenterIndex = (this.props.xPosition / (windowSize.width - 22))
    }

    return (
      <View
        style={{flex: 1, marginBottom: 10}}>
        <View style={headerContentStyle}>
          <View style={{width: windowSize.width - 30, marginTop: 10, marginBottom: 10}}>
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
                  <Text style={{color: '#626262', fontWeight: 'bold'}}>{this.props.account.nickname}</Text>
                </View>
              </View>
              <View>
                <Text style={{color: '#B2B2B2', fontSize: 13}}>{timeDiffString}</Text>
              </View>
            </View>
          </View>
        </View>
        <FlatListE
          debug
          initialNumToRender={1}
          windowSize={3}
          ref={this._captureRef}
          scrollsToTop={false}
          keyExtractor={(item, index) => index}
          data={this.props.episode.contents}
          ItemComponent={this._renderItemComponent}
          FooterComponent={this._renderFooter.bind(this)}
          disableVirtualization={false}
          horizontal
          key={'hf'}
          initialListSize={20}
          onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}
          onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
          onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
          onViewableItemsChanged={this._onViewableItemsChanged}
          shouldItemUpdate={this._shouldItemUpdate}
          style={{paddingLeft: 7.5, paddingRight: 7.5, backgroundColor: '#FFFFFF'}}
          contentOffset={{x: xPosition, y: 0}}
          scrollEventThrottle={100}
          snapToAlignment={'start'}
          snapToInterval={windowSize.width - 22}
          showsHorizontalScrollIndicator
          decelerationRate={'fast'} />
        <View style={{width: windowSize.width, backgroundColor: '#FFFFFF', paddingTop: 20, paddingBottom: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{marginLeft: 15, justifyContent: 'center'}}>
                <Image style={{width: 12, height: 10}} source={Images.likeCount} />
              </View>
              <Text style={{fontSize: 13, paddingLeft: 9, color: '#909090'}}>{this.state.likeCount}</Text>
              <View style={{marginLeft: 21, justifyContent: 'center'}}>
                <Image style={{width: 11, height: 10}} source={Images.commentCount} />
              </View>
              <Text style={{fontSize: 13, paddingLeft: 9, color: '#909090'}}>{commentCount}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 24}}>
              <TouchableOpacity onPress={this._onPressHeart.bind(this)} >
                {this.renderLikeHeart()}
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 24}} onPress={this._onPressComment.bind(this)}>
                <Image source={Images.episodeComment} style={{width: 22, height: 20}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _renderItemComponent = (content) => {
    const episodeId = this.props.episode.id
    const length = this.props.episode.contents.length
    const index = content.index

    return (
      <ContentContainer
        ref={(component) => {
          this.contentRefs[index] = component
        }}
        playerRef={(player) => {
          this.player[index] = player
        }}
        key={index}
        length={length}
        number={index}
        episodeId={episodeId}
        content={content.item}
        // episodeLiked={this.state.liked}
        commentModalHandler={this.props.commentModalHandler}
        like={this.like.bind(this)}
        dislike={this.dislike.bind(this)} />
    )
  }

  _renderFooter () {
    if (this.state.footer) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            style={{paddingRight: 14.5}}
            color='black'
            size='large' />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _captureRef = (ref) => { this._listRef = ref }

  _shouldItemUpdate (prev, next) {
    return prev.item !== next.item
  }

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }
  ) => {
    /*
      this.horizontalLock은 해당 에피소드가 좌우 스크롤된적이 없을 경우 true이다.
      onMomentumScrollBegin을 이용해 스크롤시 false로 변경한다.
    */
    if (info.viewableItems.length === 1 && !this.horizontalLock) {
      const { parentHandler, index } = this.props
      const episodeViewability = parentHandler.viewableItemsArray.includes(index)
      const centerIndex = info.viewableItems[0].index

      for (let i = 0; i < this.state.contentTypeArray.length; i++) {
        if (this.state.contentTypeArray[i] === 'Video' &&
            // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
            i !== centerIndex &&
            // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
            this.contentRefs[i] !== undefined &&
            // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
            this.contentRefs[i] !== null) {
          this.contentRefs[i].getWrappedInstance()._root._component.stopVideo()
        }
      }

      if (episodeViewability &&
          this.state.contentTypeArray[centerIndex] === 'Video' &&
          this.contentRefs[centerIndex] !== null &&
          this.contentRefs[centerIndex] !== undefined) {
        this.contentRefs[centerIndex].getWrappedInstance()._root._component.playVideo()
        this.currentCenterIndex = centerIndex
      }
    }
  }
}

EpisodeDetail.defaultProps = {
  type: null,
  absingleType: null,

  viewability: false
}

const styles = {
  headerContentStyle: {
    backgroundColor: '#FFFFFF',
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
