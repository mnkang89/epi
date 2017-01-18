import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeList from '../Components/common/EpisodeList'
import CommentModal from '../Components/common/CommentModal'

// Styles
import styles from './Styles/FeedScreenStyle'

import SignupActions from '../Redux/SignupRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

/*
  1) TODO: 컴포넌트 윌리시브로 댓글 관련 기능 추가할 것.
  2) TODO: 스크롤뷰 스크린단에 두기
  3) ISSUE: items는 언제 콜해서 스토어에 저장되고 있는가? 프로필 스크린이 올라갈때 하는게 맞을듯.
  3) 현재는 로그인 단계에서 그리팅 스크린에서 되고 있는 중.
*/

class ProfileScreen extends Component {
  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,

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
      refreshing: false
    }
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
    this.setState({refreshing: true})

    this.props.requestUserEpisodes(
      this.props.token,
      this.props.accountId,
      false
    )
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
              type={'me'}
              token={this.props.token}
              accountId={this.props.accountId}
              profileImagePath={this.props.profileImagePath}
              nickname={this.props.nickname}
              followerCount={this.props.followerCount}
              followingCount={this.props.followingCount}
              requestProfileImage={this.props.requestProfileImage} />
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
    accountId: state.token.id,

    profileImagePath: state.account.profileImagePath,
    nickname: state.account.nickname,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

    items: state.episode.episodes,

    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    visible: state.comment.visible,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),

    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
