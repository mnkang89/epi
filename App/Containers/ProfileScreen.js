import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeList from '../Components/common/EpisodeList'

import CommentModalContainer from './common/CommentModalContainer'
import FollowModalContainer from './common/FollowModalContainer'

// Styles
import styles from './Styles/FeedScreenStyle'

import SignupActions from '../Redux/SignupRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import AccountActions from '../Redux/AccountRedux'

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
    } else {
      console.log('아이템다름')
    }

    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }
  }

  // componentWillMount () {
  //   const { token, accountId } = this.props

  //   this.props.requestInfo(token, accountId)
  // }

  onRefresh () {
    this.setState({refreshing: true})

    this.props.requestUserEpisodesWithFalse(
      this.props.token,
      this.props.accountId,
      false
    )
  }

  render () {
    console.log(this.props.items)
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
          }
        >
          <EpisodeList
            items={this.props.items}
            detailType={'me'} >
            <ProfileInfo
              type={'me'}
              token={this.props.token}
              accountId={this.props.accountId}

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
          </EpisodeList>
        </ScrollView>
        <View style={{height: 48.5}} />
        <CommentModalContainer screen={'ProfileScreen'} token={this.props.token} />
        <FollowModalContainer token={this.props.token} />
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

    items: state.episode.episodesWithFalse
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId)),
    requestUserEpisodesWithFalse: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesWithFalseRequest(token, accountId, withFollowing)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id)),

    openFollow: (followVisible, showType) => dispatch(AccountActions.openFollow(followVisible, showType)),
    getFollowing: (token, id) => dispatch(AccountActions.getFollowing(token, id)),
    getFollower: (token, id) => dispatch(AccountActions.getFollower(token, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
