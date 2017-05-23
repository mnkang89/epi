import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  Modal,
  Animated,
  PanResponder,
  // FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { StackNavigator } from 'react-navigation'

import { Colors, Images, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'
import { getRealm } from '../../Services/RealmFactory'

import ContentContainer from '../../Containers/common/ContentContainer'
import FlatListE from '../../Experimental/FlatList0.44/FlatList_E44'
import FeedScreen from '../../Containers/FeedScreen'
import ProfileScreen from '../../Containers/ProfileScreen'
// import FlatListE from '../../Experimental/FlatList_e'

const windowSize = Dimensions.get('window')
const realm = getRealm()
const ITEM_WIDTH = (windowSize.width - 30) + 8
// React.Pure

class EpisodeDetail extends React.PureComponent {

  static propTypes = {
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
      // contentTypeArray: [],

      footer: false,
      hide: false,
      settingModal: false
    }
    this._listRef
    // 컨텐츠 컴포넌트 ref
    this.contentRefs = {}
    this.contentTypeArray = []
    // 비디오 컴포넌트 ref
    // this.player는 deprecated될 수 있음.
    this.player = []
    this.currentCenterIndex = 0
    this.horizontalLock = true

    this.lastContentOffset
    this.dragStartingOffset
    this.dragEndingOffset
    this.isPlayVideo = false
    this.animatedValue = new Animated.Value(-200)
    this._wrapperPanResponder = {}
  }

  componentWillMount () {
    this._wrapperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        return true
      },
      onPanResponderGrant: () => {
        this.cancelPress()
      }
    })
  }

  commentSetting () {
    this.setState({
      settingModal: true
    }, () => {
      Animated.timing(this.animatedValue, {
        toValue: 10,
        duration: 150
      }).start()
    })
  }

  cancelPress () {
    Animated.timing(this.animatedValue, {
      toValue: -200,
      duration: 150
    }).start()
    setTimeout(() => {
      this.setState({
        settingModal: false
      })
    }, 200)
  }

  componentDidMount () {
    const centerIndex = this.currentCenterIndex // 센터인덱스를 잘못 설정하면 문제 생기는 부분이지만 이곳에서 문제가 생기고 있진 않아.(ok)
    const episodeId = this.props.episode.id
    const liked = this.props.episode.liked
    let episode = realm.objects('episode')
      .filtered('id = ' + episodeId)
    const contentTypeArray = []

    for (let i = 0; i < this.props.episode.contents.length; i++) {
      contentTypeArray.push(this.props.episode.contents[i].type)
    }

    // for (let i = 0; i < this.state.contentTypeArray.length; i++) {
    //   if (this.state.contentTypeArray[i] === 'Video' &&
    //       // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
    //       i !== centerIndex &&
    //       // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
    //       this.contentRefs[i] !== undefined &&
    //       // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
    //       this.contentRefs[i] !== null) {
    //     this.contentRefs[i].getWrappedInstance().ref._component.stopVideo()
    //   }
    // }
    //
    // if (this.state.contentTypeArray[centerIndex] === 'Video' &&
    //     this.contentRefs[centerIndex] !== null &&
    //     this.contentRefs[centerIndex] !== undefined) {
    //   this.contentRefs[centerIndex].getWrappedInstance().ref._component.playVideo()
    //   this.currentCenterIndex = centerIndex // 이 코드까지 왔다는건 문제없다는 것
    // }
    for (let i = 0; i < contentTypeArray.length; i++) {
      if (contentTypeArray[i] === 'Video' &&
          // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
          i !== centerIndex &&
          // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
          this.contentRefs[i] !== undefined &&
          // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
          this.contentRefs[i] !== null) {
        this.contentRefs[i].getWrappedInstance().ref._component.stopVideo()
      }
    }

    if (contentTypeArray[centerIndex] === 'Video' &&
        this.contentRefs[centerIndex] !== null &&
        this.contentRefs[centerIndex] !== undefined) {
      this.contentRefs[centerIndex].getWrappedInstance().ref._component.playVideo()
      this.currentCenterIndex = centerIndex // 이 코드까지 왔다는건 문제없다는 것
    }

    this.contentTypeArray = contentTypeArray

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

  componentWillReceiveProps (nextProps) {
    if (this.state.footer) {
      this.setState({
        footer: false
      })
    }
  }

  stopEpisodeVideo = () => {
    this.isPlayVideo = false
    for (let i = 0; i < this.contentTypeArray.length; i++) {
      if (this.contentTypeArray[i] === 'Video' &&
          // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
          this.contentRefs[i] !== undefined &&
          // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
          this.contentRefs[i] !== null) {
        this.contentRefs[i].getWrappedInstance().ref._component.stopVideo()
      }
    }
  }

  playEpisodeVideo = () => {
    if (this.contentTypeArray[this.currentCenterIndex] === 'Video') {
      this.isPlayVideo = true
      setTimeout(() => {
        if (this.isPlayVideo) {
          if (this.contentRefs[this.currentCenterIndex] != null) {
            this.contentRefs[this.currentCenterIndex].getWrappedInstance().ref._component.playVideo()
          }
        }
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
        // NavigationActions.notiTouserProfileScreen({
        //   type: 'push',
        //   id: accountId,
        //   screen: 'NotiScreen'
        // })
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'NotiScreen'})
      } else {
        // NavigationActions.searchTouserProfileScreen({
        //   type: 'push',
        //   id: accountId,
        //   screen: 'SearchScreen'
        // })
        this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'SearchScreen'})
      }
    } else {
      // NavigationActions.feedTouserProfileScreen({
      //   type: 'push',
      //   id: accountId,
      //   screen: 'FeedScreen',
      //   topOfStack: true,
      //   onBack: () => {
      //     NavigationActions.pop()
      //   }
      // })
      this.props.navigation.navigate('UserProfile', {id: accountId, screen: 'FeedScreen'})
    }
  }

  _onScrollBeginDrag (event) {
    const active = this.props.episode.active

    if (active) {
      this.dragStartingOffset = event.nativeEvent.contentOffset.x

      console.log(this.dragStartingOffset)
      // this.lastContentOffset - (windowSize.width - 22)
      if (this.dragStartingOffset >= this.lastContentOffset - (windowSize.width - 22)) {
        this.setState({footer: true})
      }
    }
  }

  _onScrollEndDrag (event) {
    const active = this.props.episode.active

    if (active) {
      const { episode } = this.props
      this.dragEndingOffset = event.nativeEvent.contentOffset.x

      // 오른쪽에서 왼쪽컨텐츠로 가면 푸터취소
      if (this.dragStartingOffset - this.dragEndingOffset > 0) {
        // 푸터가 활성상태일때만 취소
        console.log('폴폴폴?')
        if (this.state.footer) {
          this.setState({footer: false})
        }
      } else if (
        this.dragStartingOffset >= this.lastContentOffset - (windowSize.width - 22) &&
        this.dragStartingOffset - this.dragEndingOffset < 0 &&
        this.props.type !== 'other') {
        this.props.requestNewEpisode(null, episode.id)
      }
    }
  }

  _onMomentumScrollBegin (event) {
    this.horizontalLock = false
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
        this.contentRefs[this.currentCenterIndex].getWrappedInstance().ref._component.playUnikeAnimation()
      } else {
        this.setState({
          renderLikeHeart: true
        })
        this.contentRefs[this.currentCenterIndex].getWrappedInstance().ref._component.playLikeAnimation()
      }
    }
  }

  _onPressComment () {
    const episodeId = this.props.episode.id
    const contentId = this.props.episode.contents[this.currentCenterIndex].id

    this.props.commentModalHandler()
    this.props.getComment(null, episodeId, contentId)
  }

  _onPressRemove () {
    const episodeId = this.props.episode.id

    this.setState({
      hide: true
    })
    this.props.reportEpisode(episodeId)

    // data변경 방식
    // const { parentHandler, episode } = this.props
    //
    // parentHandler.removeEpisodeFromData(episode)
    // this.cancelPress()
  }

  renderProfileImage () {
    const randomTime = new Date().getTime()
    const uri = `${this.props.account.profileImagePath}?random_number=${randomTime}`

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
    if (!this.state.hide) {
      console.log('episode hide false')
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
        this.currentCenterIndex = xPosition / (windowSize.width - 22) // 여기서도 문제 생길 수 있음(x)
      } else {
        // this.currentCenterIndex = this.props.xPosition / (windowSize.width - 22) // 여기서도 문제 생길 수 있음(x)
        // xPosition = this.props.xPosition
        this.currentCenterIndex = xPosition
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
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: '#B2B2B2', fontSize: 13}}>{timeDiffString}</Text>
                  {this.props.type === 'me' ? null
                    : <TouchableOpacity style={{alignItems: 'flex-end', width: 20}} onPress={this.commentSetting.bind(this)}>
                      <View>
                        <View style={{width: 3, height: 3, marginTop: 2, backgroundColor: 'rgb(178,178,178)'}} />
                        <View style={{width: 3, height: 3, marginTop: 2, backgroundColor: 'rgb(178,178,178)'}} />
                        <View style={{width: 3, height: 3, marginTop: 2, backgroundColor: 'rgb(178,178,178)'}} />
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View>
          </View>
          {/* <FlatList
            removeClippedSubviews={false}
            viewabilityConfig={{viewAreaCoveragePercentThreshold: 51}}
            windowSize={3}
            style={{flex: 1}}
            renderItem={this._renderItemComponent}
            ListFooterComponent={this._renderFooterComponent}
            data={this.state.data} // state로 받아서 concat하기
            disableVirtualization={false}
            getItemLayout={undefined}
            // getItemLayout={this._getItemLayout}
            key={'vf'}
            keyExtractor={(item, index) => index}
            horizontal={false}
            legacyImplementation={false}
            onRefresh={this._onRefresh}
            onViewableItemsChanged={this._onViewableItemsChanged}
            ref={this._captureRef}
            refreshing={this.state.refreshing}
            shouldItemUpdate={this._shouldItemUpdate}
            scrollsToTop
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0} /> */}
          <FlatListE
            extraData={this.props}
            removeClippedSubviews={false}
            initialNumToRender={1}
            windowSize={3}
            ref={this._captureRef}
            scrollsToTop={false}
            keyExtractor={(item, index) => index}
            data={this.props.episode.contents}
            renderItem={this._renderItemComponent}
            // ItemComponent={this._renderItemComponent}
            ListFooterComponent={this._renderFooter.bind(this)}
            disableVirtualization={false}
            horizontal
            getItemLayout={this._getItemLayout}
            key={'hf'}
            initialScrollIndex={Math.round(this.currentCenterIndex)}
            onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
            onScrollEndDrag={this._onScrollEndDrag.bind(this)}
            onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
            onViewableItemsChanged={this._onViewableItemsChanged}
            // shouldItemUpdate={this._shouldItemUpdate}
            style={{paddingLeft: 7.5, backgroundColor: '#FFFFFF'}}
            scrollEventThrottle={100}
            snapToAlignment={'start'}
            snapToInterval={windowSize.width - 22}
            // showsHorizontalScrollIndicator
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
          <Modal
            animationType={'fade'}
            transparent
            visible={this.state.settingModal}>
            <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)'}} >
              <View
                style={{flex: 82}}
                {...this._wrapperPanResponder.panHandlers} />
              <Animated.View
                style={{
                  flex: 18,
                  width: 355,
                  marginBottom: this.animatedValue,
                  alignSelf: 'center',
                  backgroundColor: 'rgba(252,252,252,0.8)',
                  borderRadius: 12}} >
                <TouchableOpacity onPress={this._onPressRemove.bind(this)}>
                  <View style={{height: 60, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
                    <Text style={{fontSize: 20, color: 'rgb(254,56,36)'}}>이 에피소드 신고하기</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cancelPress.bind(this)}>
                  <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, color: 'rgb(0,118,255)'}}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>
        </View>
      )
    } else {
      console.log('episode hide true')
      return (
        <View style={{width: 0, height: 0}} />
      )
    }
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

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index
  })

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
      const episodeId = this.props.episode.id
      const offset = info.viewableItems[0].index * (windowSize.width - 22)

      const { parentHandler, index } = this.props
      const episodeViewability = parentHandler.viewableItemsArray.includes(index)

      const centerIndex = info.viewableItems[0].index
      this.currentCenterIndex = centerIndex

      realm.write(() => {
        realm.create('episode', {id: episodeId, offset: offset}, true)
      })

      for (let i = 0; i < this.contentTypeArray.length; i++) {
        if (this.contentTypeArray[i] === 'Video' &&
            // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
            i !== centerIndex &&
            // undefined일 경우, 아직 contentRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
            this.contentRefs[i] !== undefined &&
            // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
            this.contentRefs[i] !== null) {
          this.contentRefs[i].getWrappedInstance().ref._component.stopVideo()
        }
      }
      if (episodeViewability &&
          this.contentTypeArray[centerIndex] === 'Video' &&
          this.contentRefs[centerIndex] !== null &&
          this.contentRefs[centerIndex] !== undefined) {
        this.contentRefs[centerIndex].getWrappedInstance().ref._component.playVideo()
      }
    }
  }
}
//
// const ModalStack = StackNavigator({
//   Profile: {
//     screen: ProfileScreen,
//   },
// })


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
