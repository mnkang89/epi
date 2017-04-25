import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import { getAccountId } from '../Services/Auth'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'
// import FlatListE from '../Experimental/FlatList_e'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import styles from './Styles/FeedScreenStyle'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

// const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 471

class FeedScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,

    episodesRequesting: PropTypes.bool,
    items: PropTypes.array.isRequired,

    contentId: PropTypes.number,
    episodeId: PropTypes.number,

    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    requestInfo: PropTypes.func,
    requestUserEpisodes: PropTypes.func,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func,
    postComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      footer: false,
      scrollsToTop: true,
      commentModalVisible: false,
      leftTime: 5
    }
    this.before
    this.episodeRefs = {}
    this.viewableItemsArray = []
    this._onPushToUserProfileScreen = this._onPushToUserProfileScreen.bind(this)
    this._onPopFromUserProfileScreen = this._onPopFromUserProfileScreen.bind(this)
    this.profileModifiedFlag = false
  }

  componentWillMount () {
    const token = null
    const withFollowing = true
    const accountId = getAccountId()

    this.props.requestUserEpisodes(token, accountId, withFollowing)
    this.props.requestUserEpisodesWithFalse(token, accountId, false)
  }

  componentDidMount () {
    const token = null
    const accountId = getAccountId()

    this.props.requestInfo(token, accountId)
  }

  componentWillReceiveProps (nextProps, nextState) {
    console.log('리시브프랍스인 피드스크린')
    console.log(getObjectDiff(this.props, nextProps))

    if (nextProps.items.length !== 0) {
      this.before = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
    }

    if (nextProps.beforeScreen === 'homeTab') {
      if (nextProps.beforeScreen === nextProps.pastScreen) {
        if (this.props.items.length === 0) {
        } else {
          this._listRef.scrollToIndex({index: 0})
        }
      }
    }

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.profileModified !== nextProps.profileModified) {
      this.profileModifiedFlag = true
      return true
    }
    // newEpisode콜시에 업뎃안되는 문제가 있음
    if (this.state.scrollsToTop !== nextState.scrollsToTop) {
      return true
    }

    if (this.props.episodesRequesting !== nextProps.episodesRequesting) {
      return true
    }

    if (this.state.commentModalVisible !== nextState.commentModalVisible) {
      return true
    }
    if (_.isEqual(this.props.items, nextProps.items) &&
        !getObjectDiff(this.props, nextProps).includes('newEpisodeRequesting')) {
      console.log('슈드아이템 폴스')
      return false
    } else {
      console.log('슈드아이템 트루')
      return true
    }
  }

  _onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  _onEndReached () {
    console.log('onEndReached fired')
    this.setState({footer: true})
    const { token, accountId } = this.props
    const before = this.before
    const withFollowing = true

    this.props.requestMoreFeeds(token, accountId, withFollowing, before)
  }

  _onPushToUserProfileScreen () {
    this.setState({
      scrollsToTop: false
    })
    // this.topOfStack = false
  }

  _onPopFromUserProfileScreen () {
    this.setState({
      scrollsToTop: true
    })
  }

  _toggleCommentModal () {
    console.log('스테이트 변경함니다')
    this.setState({
      commentModalVisible: !this.state.commentModalVisible
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          windowSize={10}
          style={{ flex: 1 }}
          renderItem={this._renderItemComponent.bind(this)}
          FooterComponent={this._renderFooter.bind(this)}
          data={this.props.items}
          disableVirtualization={false}
          getItemLayout={this._getItemLayout}
          key={'vf'}
          keyExtractor={(item, index) => index}
          horizontal={false}
          legacyImplementation={false}
          onRefresh={this._onRefresh.bind(this)}
          onViewableItemsChanged={this._onViewableItemsChanged}
          ref={this._captureRef}
          refreshing={this.state.refreshing}
          shouldItemUpdate={this._shouldItemUpdate.bind(this)}
          scrollsToTop={this.state.scrollsToTop}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0} />
        <View style={{height: 60}} />
        <CommentModalContainer
          commentModalVisible={this.state.commentModalVisible}
          commentModalHandler={this._toggleCommentModal.bind(this)}
          screen={'FeedScreen'}
          token={this.props.token}
          pushHandler={this._onPushToUserProfileScreen}
          popHandler={this._onPopFromUserProfileScreen} />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _renderItemComponent = (episode) => {
    const index = episode.index

    return (
      <EpisodeDetail
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        key={index}
        index={index}
        token={this.props.token}
        parentHandler={this}
        pushHandler={this._onPushToUserProfileScreen}
        popHandler={this._onPopFromUserProfileScreen}
        episode={episode.item.episode}
        account={episode.item.account}
        requestNewEpisode={this.props.requestNewEpisode}
        commentModalHandler={this._toggleCommentModal.bind(this)}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderFooter () {
    if (this.state.footer) {
      return (
        <View>
          <ActivityIndicator
            color='white'
            style={{marginBottom: 50}}
            size='large' />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

  _shouldItemUpdate (prev, next) {
    if (this.profileModifiedFlag) {
      this.profileModifiedFlag = false
      return true
    }
    return prev.item !== next.item
  }

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }) => {
    const viewableItemsArray = []
    const episodeRefsArray = Object.keys(this.episodeRefs).map(Number)

    for (let i = 0; i < info.viewableItems.length; i++) {
      viewableItemsArray.push(info.viewableItems[i].index)
    }
    // 보이는 아이템들 어레이
    this.viewableItemsArray = viewableItemsArray
    // 보이지않는 아이템들 어레이
    const inViewableItemsArray = getArrayDiff(episodeRefsArray, viewableItemsArray)

    for (let i in inViewableItemsArray) {
      const index = inViewableItemsArray[i]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].stopEpisodeVideo()
      }
    }
    // 뷰어블한 아이템이 3개이면 중간 아이템만 play
    if (viewableItemsArray.length === 3) {
      if (this.episodeRefs[viewableItemsArray[0]] !== null) {
        this.episodeRefs[viewableItemsArray[0]].stopEpisodeVideo()
      }
      if (this.episodeRefs[viewableItemsArray[2]] !== null) {
        this.episodeRefs[viewableItemsArray[2]].stopEpisodeVideo()
      }
    } else {
      for (let j in viewableItemsArray) {
        const index = viewableItemsArray[j]
        if (this.episodeRefs[index] !== null) {
          this.episodeRefs[index].playEpisodeVideo()
        }
      }
    }
  }

}

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    token: state.token.token,
    accountId: state.token.id,

    episodesRequesting: state.episode.episodesRequesting,
    newEpisodeRequesting: state.episode.newEpisodeRequesting,
    items: state.episode.episodes,

    trigger: state.screen.trigger,
    beforeScreen: state.screen.beforeScreen,
    pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeRequest(token, episodeId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),
    requestUserEpisodesWithFalse: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesWithFalseRequest(token, accountId, withFollowing)),
    requestMoreFeeds: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreFeedsRequest(token, accountId, withFollowing, before)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
