import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import { getAccountId } from '../Services/Auth'
import { logGenerator } from '../Services/Logger/LogGenerator'
import { insertToLogQueue } from '../Services/Logger/LogSender'
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
import { Images } from '../Themes'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class ProfileScreen extends Component {
  static navigationOptions = {
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    header: () => (
      <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 60, paddingTop: 10}}>
        <Image
          source={Images.profileLogo}
          style={{
            width: 82,
            height: 16}} />
      </View>
    ),
    tabBarIcon: ({focused}) => {
      if (focused) {
        return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image style={{width: 23, height: 25}} source={Images.tabUser} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
              <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
            </View>
          </View>
        )
      } else {
        return (
          <Image style={{width: 23, height: 25}} source={Images.tabUser} />
        )
      }
    }
  }

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
      refreshing: false,
      footer: false,
      data: [],
      commentModalVisible: false,
      stopOnEndReached: false
    }
    this.updatedDateTime
    this.beforeUpdatedDateTime
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
    this.beforeUpdatedDateTime = this.updatedDateTime
    if (nextProps.items.length !== 0) {
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }

    if (this.beforeUpdatedDateTime === this.updatedDateTime) {
      if (this.beforeUpdatedDateTime !== undefined &&
          this.updatedDateTime !== undefined) {
        this.setState({
          stopOnEndReached: true,
          footer: false
        })
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

  scrollsToTop = () => {
    this._listRef.scrollToOffset({x: 0, y: 0})
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{height: 1}} />
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
        {/* <View style={{height: 60}} /> */}
        <CommentModalContainer
          navigation={this.props.navigation}
          commentModalVisible={this.state.commentModalVisible}
          commentModalHandler={this._toggleCommentModal}
          screen={'ProfileScreen'}
          token={this.props.token} />
        <FollowModalContainer
          screen={'ProfileScreen'}
          token={this.props.token}
          navigation={this.props.navigation} />
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
        navigation={this.props.navigation}
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 60}}>
          <ActivityIndicator
            color='gray'
            size='small' />
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

    // Logging
    if (info.viewableItems.length !== 0) {
      const viewableIndex = info.viewableItems[0].index
      const impLog = logGenerator(this.episodeRefs, viewableIndex, 'profile', 'Impression')
      const viewLog = logGenerator(this.episodeRefs, viewableIndex, 'profile', 'View')

      console.log(impLog)
      insertToLogQueue(impLog)
      clearTimeout(this.viewTimer)
      this.viewTimer = setTimeout(() => {
        console.log(viewLog)
        insertToLogQueue(viewLog)
        clearTimeout(this.viewTimer)
      }, 3000)
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
    if (this.state.stopOnEndReached) {
      console.log('엔드리치드 겜셋')
      return
    } else {
      const accountId = getAccountId()
      const withFollowing = false
      const updatedDateTime = this.updatedDateTime

      this.setState({footer: true})
      this.props.requestMoreEpisodes(null, accountId, withFollowing, updatedDateTime)
    }
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
