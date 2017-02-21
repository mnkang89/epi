import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
 } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import CachableImage from '../../Common/CachableImage'

import { Colors, Images, Metrics } from '../../Themes/'
import { convert2TimeDiffString } from '../../Lib/Utilities'

import ContentContainer from '../../Containers/common/ContentContainer'
import {
  getItemLayout
} from '../../Experimental/ListExampleShared_e'
import FlatListE from '../../Experimental/FlatList_e'

const windowSize = Dimensions.get('window')

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
      likeCount: this.props.episode.contents.map(content => content.likeCount).reduce((a, b) => a + b, 0),
      contentTypeArray: [],

      footer: false
    }
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
  }

  componentDidMount () {
    // horizontal 리프레쉬 비디오 플레이
    // const { parentHandler, index } = this.props
    // const episodeViewability = parentHandler.viewableItemsArray.includes(index)
    const centerIndex = this.currentCenterIndex

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

    if (// episodeViewability &&
        this.state.contentTypeArray[centerIndex] === 'Video' &&
        this.contentRefs[centerIndex] !== null &&
        this.contentRefs[centerIndex] !== undefined) {
      this.contentRefs[centerIndex].getWrappedInstance()._root._component.playVideo()
      this.currentCenterIndex = centerIndex
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
  }

  stopEpisodeVideo = () => {
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
      this.contentRefs[this.currentCenterIndex].getWrappedInstance()._root._component.playVideo()
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

  _onScroll (event) {
  }

  _onScrollBeginDrag (event) {
    const active = this.props.episode.active

    if (active) {
      this.dragStartingOffset = event.nativeEvent.contentOffset.x
      const dragStartingOffset = event.nativeEvent.contentOffset.x

      if (dragStartingOffset >= this.lastContentOffset) {
        console.log('푸터 실행')
        this.setState({footer: true})
      }
    }
  }

  _onScrollEndDrag (event) {
    const active = this.props.episode.active

    if (active) {
      const { token, episode } = this.props
      this.dragEndingOffset = event.nativeEvent.contentOffset.x

      // console.log('오프셋들')
      // console.log(this.dragStartingOffset)
      // console.log(this.dragEndingOffset)

      if (this.dragStartingOffset - this.dragEndingOffset > 0) {
        // console.log('푸터 취소')
        this.setState({footer: false})
      }
      // console.log('스타팅과 라스트가 같은가?')
      // console.log(this.dragStartingOffset === this.lastContentOffset)
      if (this.dragStartingOffset >= this.lastContentOffset &&
          this.dragStartingOffset - this.dragEndingOffset < 0) {
        console.log('리퀘스팅!')
        this.props.requestNewEpisode(token, episode.id)
      }
    }
  }

  _onMomentumScrollBegin (event) {
    this.horizontalLock = false
  }

  _onEndReached () {
  }

  renderProfileImage () {
    // let uri = this.props.account.profileImagePath
    let uri = 'https://facebook.github.io/react/img/logo_og.png'
    if (this.props.account.profileImagePath) {
      return (
        <CachableImage
          style={styles.profileStyle}
          source={{uri: uri}} />
      )
    } else {
      return (
        <CachableImage
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
    const active = this.props.episode.active
    const activeEpisodeLength = this.props.episode.contents.length
    const commentCount = this.props.episode.contents.map(content => content.commentCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(
      this.props.episode.updatedDateTime || this.props.episode.createDateTime)
    const {
      headerContentStyle
    } = styles

    let xPosition = 0

    this.lastContentOffset = (activeEpisodeLength - 1) * (windowSize.width - 22)

    if (!this.props.xPosition) {
      if (active) {
        xPosition = (activeEpisodeLength - 1) * (windowSize.width - 22)
      } else {
        xPosition = 0
      }
    } else {
      xPosition = this.props.xPosition
    }

    if (xPosition === 0) {
      this.currentCenterIndex = 0
    } else {
      this.currentCenterIndex = activeEpisodeLength - 1
    }

    console.log('에피소드 리렌더')
    return (
      <View
        style={{flex: 1}}>
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
        <FlatListE
          keyExtractor={(item, index) => index}
          data={this.props.episode.contents}
          ItemComponent={this._renderItemComponent}
          FooterComponent={this._renderFooter.bind(this)}
          disableVirtualization={false}
          getItemLayout={undefined}
          horizontal
          key={'hf'}
          initialListSize={50}
          onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}
          onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
          onViewableItemsChanged={this._onViewableItemsChanged}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0}
          shouldItemUpdate={this._shouldItemUpdate}
          style={{marginTop: 10, paddingLeft: 7.5, paddingRight: 7.5}}
          contentOffset={{x: xPosition, y: 0}}
          scrollEventThrottle={100}
          snapToAlignment={'start'}
          snapToInterval={windowSize.width - 22}
          showsHorizontalScrollIndicator
          decelerationRate={'fast'}
          directionalLockEnabled={false} />
        <View style={{width: windowSize.width - 30, backgroundColor: 'black', paddingTop: 15}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 13, paddingRight: 10, color: 'rgb(217,217,217)'}}>공감 {this.state.likeCount}</Text>
            <Text style={{fontSize: 13, color: 'rgb(217,217,217)'}}>댓글 {commentCount}</Text>
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
            color='white'
            size='large' />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _shouldItemUpdate (prev, next) {
    console.log('슈드아이템업데이트 인 에피소드 디테일')
    // return false
    return prev.item !== next.item
  }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
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
      console.log('호리즌탈락 풀림')
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

/*
  render () {
    // initialListSize={50} 리스트뷰에 아직 렌더링 되지않아 발생하는 에러를 해결하기 위함.
    // 50개의 내부 row를 렌더링하는 의미이며 다소 하드코딩 되어 있으므로 개선이 필요함.
    const active = this.props.episode.active
    const activeEpisodeLength = this.props.episode.contents.length
    const commentCount = this.props.episode.contents.map(content => content.commentCount).reduce((a, b) => a + b, 0)
    const timeDiffString = convert2TimeDiffString(
      this.props.episode.updatedDateTime || this.props.episode.createDateTime)
    const {
      headerContentStyle
    } = styles

    const contents = this.props.episode.contents
    const episodeId = this.props.episode.id
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.dataSource = ds.cloneWithRows(contents.slice())

    let xPosition = 0
    // console.log('액티브:')
    // console.log(active)

    if (!this.props.xPosition) {
      if (active) {
        xPosition = (activeEpisodeLength - 1) * (windowSize.width - 22)
        // console.log('xPosition:')
        // console.log(xPosition)
      } else {
        // console.log('xPosition:')
        // console.log(xPosition)
        xPosition = 0
      }
    } else {
      xPosition = this.props.xPosition
    }

    this.lastContentOffset = (activeEpisodeLength - 1) * (windowSize.width - 22)

    // this.currentCenterIndex
    if (xPosition === 0) {
      this.currentCenterIndex = 0
    } else {
      this.currentCenterIndex = activeEpisodeLength - 1
    }

    console.log('에피소드 리렌더')
    return (
      <View
        style={{flex: 1}}>
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
          ref={(component) => {
            this._listView = component
          }}
          pageSize={2}
          initialListSize={5}
          style={{marginTop: 10, paddingLeft: 7.5, paddingRight: 7.5}}
          contentOffset={{x: xPosition, y: 0}}
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
*/
