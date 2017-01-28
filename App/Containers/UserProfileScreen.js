import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeList from '../Components/common/EpisodeList'
import CommentModal from '../Components/common/CommentModal'
import FollowModal from '../Components/common/FollowModal'

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
    contentId: PropTypes.number,
    episodeId: PropTypes.number,
    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    requestOtherInfo: PropTypes.func,
    requestOtherEpisodes: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,
    resetCommentModal: PropTypes.func,
    postComment: PropTypes.func,
    getComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount () {
    const { token, id } = this.props
    const active = false

    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      this.setState({refreshing: false})
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
      }
    }
  }

  onRefresh () {
    const { token, id } = this.props
    const active = false

    this.setState({refreshing: true})
    this.props.requestOtherInfo(token, id)
    this.props.requestOtherEpisodes(token, id, active)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          <EpisodeList
            detailType={'other'}
            items={this.props.items} >
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
          </EpisodeList>
        </ScrollView>
        <View style={{height: 48.5}} />
        <CommentModal
          screen={this.props.screen}
          token={this.props.token}
          contentId={this.props.contentId}
          episodeId={this.props.episodeId}
          visible={this.props.visible}
          comments={this.props.comments}
          commentPosting={this.props.commentPosting}
          resetCommentModal={this.props.resetCommentModal}
          getComment={this.props.getComment}
          postComment={this.props.postComment} />
        <FollowModal
          token={this.props.token}
          showType={this.props.showType}
          followVisible={this.props.followVisible}
          follows={this.props.follows}
          openFollow={this.props.openFollow}
          postFollow={this.props.postFollow}
          deleteFollow={this.props.deleteFollow} />
      </View>
    )
  }
}

/*
<CommentModal
  screen={this.props.screen}
  token={this.props.token}
  contentId={this.props.contentId}
  episodeId={this.props.episodeId}
  visible={this.props.visible}
  comments={this.props.comments}
  commentPosting={this.props.commentPosting}
  resetCommentModal={this.props.resetCommentModal}
  getComment={this.props.getComment}
  postComment={this.props.postComment} />
<FollowModal
  token={this.props.token}
  showType={this.props.showType}
  followVisible={this.props.followVisible}
  follows={this.props.follows}
  openFollow={this.props.openFollow}
  postFollow={this.props.postFollow}
  deleteFollow={this.props.deleteFollow} />
*/
const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    following: state.account.otherFollowing,

    profileImagePath: state.account.otherProfileImagePath,
    nickname: state.account.otherNickname,
    followerCount: state.account.otherFollowerCount,
    followingCount: state.account.otherFollowingCount,

    items: state.episode.otherEpisodes,

    follows: state.account.follows,
    followVisible: state.account.followVisible,
    showType: state.account.showType,

    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    visible: state.comment.visible,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestOtherInfo: (token, accountId) => dispatch(AccountActions.otherInfoRequest(token, accountId)),
    requestOtherEpisodes: (token, accountId, active) => dispatch(EpisodeActions.otherEpisodesRequest(token, accountId, active)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id)),

    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType)),
    getFollowing: (token, id) => dispatch(AccountActions.getFollowing(token, id)),
    getFollower: (token, id) => dispatch(AccountActions.getFollower(token, id)),

    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)
