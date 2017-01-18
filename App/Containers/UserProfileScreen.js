import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeList from '../Components/common/EpisodeList'
import CommentModal from '../Components/common/CommentModal'

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
    postComment: PropTypes.func
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
            items={this.props.items} >
            <ProfileInfo
              type={'other'}
              token={this.props.token}
              id={this.props.id}  // 내아이디 일때는 accountId
              profileImagePath={this.props.profileImagePath}
              nickname={this.props.nickname}
              followerCount={this.props.followerCount}
              followingCount={this.props.followingCount}
              following={this.props.following}
              postFollow={this.props.postFollow}
              deleteFollow={this.props.deleteFollow} />
          </EpisodeList>
          <View style={{height: 50}} />
        </ScrollView>
        <CommentModal
          token={this.props.token}
          contentId={this.props.contentId}
          episodeId={this.props.episodeId}
          visible={this.props.visible}
          comments={this.props.comments}
          commentPosting={this.props.commentPosting}
          resetCommentModal={this.props.resetCommentModal}
          postComment={this.props.postComment} />
      </View>
    )
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

    items: state.episode.otherEpisodes,

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

    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)
