import React, { Component, PropTypes } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'
import FlatListE from '../Experimental/FlatList_e'
import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import FollowModalContainer from './common/FollowModalContainer'

// Styles
import styles from './Styles/FeedScreenStyle'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

class UserProfileScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    id: PropTypes.number,

    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    following: PropTypes.bool,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    items: PropTypes.array,

    screen: PropTypes.string,

    requestOtherInfo: PropTypes.func,
    requestOtherEpisodes: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      footer: false
    }
    this.before
    this.episodeRefs = {}
    this.viewableItemsArray = []
  }

  componentDidMount () {
    const { token, id } = this.props
    const active = false

    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  componentWillMount () {
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))

    if (nextProps.items.length !== 0) {
      this.before = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
    }

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      return false
    } else {
      return true
    }
  }

  _onRefresh () {
    const { token, id } = this.props
    const active = false

    this.setState({refreshing: true})
    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  _onEndReached () {
    console.log('onEndReached fired')
    this.setState({footer: true})
    if (this.props.items.length !== 0) {
      this.before = this.props.items[this.props.items.length - 1].episode.updatedDateTime
    }

    const { token, id } = this.props
    const before = this.before
    const withFollowing = false

    this.props.requestMoreOtherEpisodes(token, id, withFollowing, before)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatListE
          keyExtractor={(item, index) => index}
          style={{ flex: 1 }}
          ref={this._captureRef}
          key={'vf'}
          HeaderComponent={this._renderHeader.bind(this)}
          ItemComponent={this._renderItemComponent.bind(this)}
          FooterComponent={this._renderFooter.bind(this)}
          disableVirtualization={false}
          horizontal={false}
          data={this.props.items}
          legacyImplementation={false}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onViewableItemsChanged={this._onViewableItemsChanged}
          shouldItemUpdate={this._shouldItemUpdate}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0} />
        <View style={{height: 60}} />
        <CommentModalContainer screen={this.props.screen} token={this.props.token} />
        <FollowModalContainer screen={this.props.screen} token={this.props.token} />
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
        episode={episode.item.episode}
        account={episode.item.account}
        type={'other'}
        // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
        requestNewEpisode={this.props.requestNewEpisode}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderHeader () {
    return (
      <ProfileInfo
        type={'other'}
        token={this.props.token}
        id={this.props.id}  // 내아이디 일때는 accountId

        profileImagePath={this.props.profileImagePath} // props는 현재는 null인 상태에서 들어가는 상황
        nickname={this.props.nickname}
        followerCount={this.props.followerCount}
        followingCount={this.props.followingCount}
        following={this.props.following}

        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow}

        openFollow={this.props.openFollow}
        getFollowing={this.props.getFollowing}
        getFollower={this.props.getFollower} />
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
      } else {
        // console.log('null인놈들')
        // console.log(index)
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
    token: state.token.token,
    following: state.account.otherFollowing,

    profileImagePath: state.account.otherProfileImagePath,
    nickname: state.account.otherNickname,
    followerCount: state.account.otherFollowerCount,
    followingCount: state.account.otherFollowingCount,

    items: state.episode.otherEpisodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestOtherInfo: (token, accountId) => dispatch(AccountActions.otherInfoRequest(token, accountId)),
    requestOtherEpisodes: (token, accountId, active) => dispatch(EpisodeActions.otherEpisodesRequest(token, accountId, active)),
    requestMoreOtherEpisodes: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreOtherEpisodesRequest(token, accountId, withFollowing, before)),
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newOtherEpisodeRequest(token, episodeId)),

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
