import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import { getAccountId } from '../Services/Auth'
import { getArrayDiff } from '../Lib/Utilities'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import FollowModalContainer from './common/FollowModalContainer'

import styles from './Styles/FeedScreenStyle'
import SignupActions from '../Redux/SignupRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import AccountActions from '../Redux/AccountRedux'
import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class ProfileScreen extends Component {
  static propTypes = {
    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    items: PropTypes.array,

    requestProfileImage: PropTypes.func,
    requestUserEpisodes: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: false,
      footer: false,
      commentModalVisible: false
    }
    this.updatedDateTime
    this.profileModifiedFlag = false
    this.viewableItemsArray = []
    this.episodeRefs = {}
  }

  componentDidMount () {
    const accountId = getAccountId()
    const withFollowing = false

    // this.props.requestInfo(null, accountId)
    setTimeout(() => {
      this.props.requestUserEpisodesWithFalse(null, accountId, withFollowing)
    }, 100)
  }

  componentWillReceiveProps (nextProps) {
    // console.log(getObjectDiff(this.props, nextProps))
    // if (nextProps.items.length !== 0) {
    //   this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
    // }

    // if (nextProps.beforeScreen === 'profileTab') {
    //   if (nextProps.beforeScreen === nextProps.pastScreen) {
    //     this._listRef.scrollToOffset({y: 0})
    //   }
    // }
    if (nextProps.items.length !== 0) {
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }

    this.setState({data: nextProps.items})

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.profileModified !== nextProps.profileModified) {
  //     this.profileModifiedFlag = true
  //     return true
  //   }
  //
  //   if (this.state.commentModalVisible !== nextState.commentModalVisible) {
  //     return true
  //   }
  //   if (_.isEqual(this.props.items, nextProps.items)) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          removeClippedSubviews={false}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 30}}
          windowSize={3}
          style={{flex: 1}}
          ListHeaderComponent={this._renderHeaderComponent}
          renderItem={this._renderItemComponent}
          ListFooterComponent={this._renderFooterComponent}
          data={this.state.data}
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
          commentModalHandler={this._toggleCommentModal}
          screen={'ProfileScreen'}
          token={this.props.token} />
        <FollowModalContainer token={this.props.token} />
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
        type={'me'}
        index={index}
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        parentHandler={this}
        episode={item.episode}
        account={item.account}
        commentModalHandler={this._toggleCommentModal}
        requestNewEpisode={this.props.requestNewEpisode}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderHeaderComponent = () => {
    console.log('렌더해더')
    console.log(this.props.profileImagePath)
    return (
      <ProfileInfo
        type={'me'}
        token={null}
        accountId={getAccountId()}

        profileImagePath={this.props.profileImagePath}
        nickname={this.props.nickname}
        followerCount={this.props.followerCount}
        followingCount={this.props.followingCount}

        requestProfileImage={this.props.requestProfileImage}

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
    }
  ) => {
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
    const accountId = getAccountId()
    const withFollowing = false

    this.setState({refreshing: true})
    this.props.requestInfo(null, accountId)
    this.props.requestUserEpisodesWithFalse(null, accountId, withFollowing)
  }

  _onEndReached = () => {
    const accountId = getAccountId()
    const withFollowing = false
    const updatedDateTime = this.updatedDateTime

    this.setState({footer: true})
    this.props.requestMoreEpisodes(null, accountId, withFollowing, updatedDateTime)
  }
}

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    token: state.token.token,
    accountId: state.token.id,

    profileImagePath: state.account.profileImagePath,
    nickname: state.account.nickname,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

    items: state.episode.episodesWithFalse

    // trigger: state.screen.trigger,
    // beforeScreen: state.screen.beforeScreen,
    // pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileModification(photoSource, token, accountId)),
    requestUserEpisodesWithFalse: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesWithFalseRequest(token, accountId, withFollowing)),
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeWithFalseRequest(token, episodeId)),
    requestMoreEpisodes: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreEpisodesRequest(token, accountId, withFollowing, before)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id)),

    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType)),
    getFollowing: (token, id) => dispatch(AccountActions.getFollowing(token, id)),
    getFollower: (token, id) => dispatch(AccountActions.getFollower(token, id)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
