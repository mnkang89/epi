import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import { getArrayDiff } from '../Lib/Utilities'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import FollowModalContainer from './common/FollowModalContainer'

import styles from './Styles/FeedScreenStyle'
import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class UserProfileScreen extends Component {

  static propTypes = {
    id: PropTypes.number,

    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    following: PropTypes.bool,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    items: PropTypes.array,

    screen: PropTypes.string,
    topOfStack: PropTypes.bool,

    requestOtherInfo: PropTypes.func,
    requestOtherEpisodes: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      footer: false,
      // scrollsToTop: true,
      commentModalVisible: false
    }
    this.updatedDateTime
    this.viewableItemsArray = []
    this.episodeRefs = {}
    this._onPushToUserProfileScreen = this._onPushToUserProfileScreen.bind(this)
    this._onPopFromUserProfileScreen = this._onPopFromUserProfileScreen.bind(this)
  }

  componentDidMount () {
    const { id } = this.props
    const active = false

    setTimeout(() => {
      this.props.requestOtherInfo(null, id)
      this.props.requestOtherEpisodes(null, id, active)
    }, 500)
  }

  componentWillReceiveProps (nextProps) {
    // console.log(getObjectDiff(this.props, nextProps))
    //
    // if (this.topOfStack) {
    //   this.setState({
    //     scrollsToTop: true
    //   })
    // } else {
    //   this.setState({
    //     scrollsToTop: false
    //   })
    // }
    const items = nextProps.itemsObject[this.props.id]

    if (nextProps.itemsObject[this.props.id] !== undefined) {
      this.updatedDateTime = items[items.length - 1].episode.updatedDateTime
    }

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.commentModalVisible !== nextState.commentModalVisible) {
  //     return true
  //   }
  //   if (this.state.scrollsToTop !== nextState.scrollsToTop) {
  //     return true
  //   }
  //   // otherInfo도 object화하기
  //   if (getObjectDiff(this.props, nextProps)[0] === 'otherInfoObject') {
  //     if (_.isEqual(this.props.otherInfoObject[this.props.id], nextProps.otherInfoObject[this.props.id])) {
  //       return false
  //     } else {
  //       return true
  //     }
  //   } else if (getObjectDiff(this.props, nextProps)[0] === 'itemsObject') {
  //     if (_.isEqual(this.props.itemsObject[this.props.id], nextProps.itemsObject[this.props.id])) {
  //       return false
  //     } else {
  //       return true
  //     }
  //   } else if (
  //     // refresh했을때 case
  //     _.isEqual(this.props.otherInfoObject, nextProps.otherInfoObject) ||
  //     _.isEqual(this.props.itemsObject, nextProps.itemsObject)) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          // scrollsToTop={this.state.scrollsToTop}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 51}}
          windowSize={3}
          style={{flex: 1}}
          ListHeaderComponent={this._renderHeaderComponent}
          renderItem={this._renderItemComponent}
          ListFooterComponent={this._renderFooterComponent}
          data={this.props.itemsObject[this.props.id]}
          disableVirtualization={false}
          getItemLayout={this._getItemLayout}
          key={'vf'}
          keyExtractor={(item, index) => index}
          horizontal={false}
          legacyImplementation={false}
          onRefresh={this._onRefresh}
          onViewableItemsChanged={this._onViewableItemsChanged}
          ref={this._captureRef}
          refreshing={this.state.refreshing}
          shouldItemUpdate={this._shouldItemUpdate.bind(this)}
          scrollsToTop
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0} />
        <View style={{height: 60}} />
        <CommentModalContainer
          commentModalVisible={this.state.commentModalVisible}
          commentModalHandler={this._toggleCommentModal.bind(this)}
          screen={this.props.screen}
          token={this.props.token}
          pushHandler={this._onPushToUserProfileScreen}
          popHandler={this._onPopFromUserProfileScreen} />
        <FollowModalContainer
          screen={this.props.screen}
          token={this.props.token}
          pushHandler={this._onPushToUserProfileScreen}
          popHandler={this._onPopFromUserProfileScreen} />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

  _renderItemComponent = ({item, index}) => {
    return (
      <EpisodeDetail
        type={'other'}
        index={index}
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        parentHandler={this}
        pushHandler={this._onPushToUserProfileScreen}
        popHandler={this._onPopFromUserProfileScreen}
        episode={item.episode}
        account={item.account}
        // requestNewEpisode={this.props.requestNewEpisode}
        commentModalHandler={this._toggleCommentModal.bind(this)}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderHeaderComponent = () => {
    if (this.props.otherInfoObject[this.props.id] === undefined) {
      return (
        <View />
      )
    }
    const { otherProfileImagePath, otherNickname, otherFollowerCount, otherFollowingCount, otherFollowing } = this.props.otherInfoObject[this.props.id]

    return (
      <ProfileInfo
        type={'other'}
        token={null}
        id={this.props.id}  // 내아이디 일때는 accountId

        profileImagePath={otherProfileImagePath} // props는 현재는 null인 상태에서 들어가는 상황
        nickname={otherNickname}
        followerCount={otherFollowerCount}
        followingCount={otherFollowingCount}
        following={otherFollowing}

        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow}

        openFollow={this.props.openFollow}
        getFollowing={this.props.getFollowing}
        getFollower={this.props.getFollower} />
    )
  }

  _renderFooterComponent = () => {
    if (this.state.footer) {
      return (
        <View>
          <ActivityIndicator
            color='gray'
            style={{marginBottom: 40}}
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
    return prev.item !== next.item
  }

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }
  ) => {
    /* info오브젝트에서 뷰어블인 에피소드의 인덱스 추출하고 해당 에피소드를 제외한 에피소드는 모두 stopEpisodeVideo()호출 */

    const viewableItemsArray = []
    const episodeRefsArray = Object.keys(this.episodeRefs).map(Number)

    for (let i = 0; i < info.viewableItems.length; i++) {
      viewableItemsArray.push(info.viewableItems[i].index)
    }

    this.viewableItemsArray = viewableItemsArray
    const inViewableItemsArray = getArrayDiff(episodeRefsArray, viewableItemsArray)

    for (let i in inViewableItemsArray) {
      const index = inViewableItemsArray[i]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].stopEpisodeVideo()
      }
    }

    for (let j in viewableItemsArray) {
      const index = viewableItemsArray[j]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].playEpisodeVideo()
      }
    }
  }

  _toggleCommentModal = () => {
    this.setState({
      commentModalVisible: !this.state.commentModalVisible
    })
  }

  _onRefresh = () => {
    const { id } = this.props
    const active = false

    this.setState({refreshing: true})
    this.props.requestOtherInfo(null, id)
    this.props.requestOtherEpisodes(null, id, active)
  }

  _onEndReached = () => {
    // const items = this.props.itemsObject[this.props.id]
    const { id } = this.props
    const updatedDateTime = this.updatedDateTime
    const withFollowing = false

    this.setState({footer: true})
    this.props.requestMoreOtherEpisodes(null, id, withFollowing, updatedDateTime)
    // if (items.length !== 0) {
    //   this.updatedDateTime = items[items.length - 1].episode.updatedDateTime
    // }
  }

  _onPushToUserProfileScreen () {
    this.setState({
      scrollsToTop: false
    })
  }

  _onPopFromUserProfileScreen () {
    this.setState({
      scrollsToTop: true
    })
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    itemsObject: state.episode.otherEpisodesObject,
    otherInfoObject: state.account.otherInfoObject
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestOtherInfo: (token, accountId) => dispatch(AccountActions.otherInfoRequest(token, accountId)),
    requestOtherEpisodes: (token, accountId, active) => dispatch(EpisodeActions.otherEpisodesRequest(token, accountId, active)),
    requestMoreOtherEpisodes: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreOtherEpisodesRequest(token, accountId, withFollowing, before)),
    requestNewEpisode: (token, accountId, episodeId) => dispatch(EpisodeActions.newOtherEpisodeRequest(token, accountId, episodeId)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id)),

    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType)),
    getFollowing: (token, id) => dispatch(AccountActions.getFollowing(token, id)),
    getFollower: (token, id) => dispatch(AccountActions.getFollower(token, id)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)
