// @flow
// EPISODE

import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

// import MyEpisodeList from '../Components/MyEpisodeList'
import ProfileInfo from '../Components/common/ProfileInfo'
import EpisodeList from '../Components/common/EpisodeList'

// Styles
import styles from './Styles/FeedScreenStyle'

import SignupActions from '../Redux/SignupRedux'
import EpisodeActions from '../Redux/EpisodeRedux'

class ProfileScreen extends Component {
  /*
  render () {
    return (
      <View style={styles.mainContainer}>
        <MyEpisodeList />
        <View style={{height: 50}} />
      </View>
    )
  }
  */
  static propTypes = {
    token: PropTypes.string,
    id: PropTypes.number,

    accountId: PropTypes.number,
    account: PropTypes.object,

    type: PropTypes.string,

    following: PropTypes.bool,
    profileImagePath: PropTypes.string,
    nickname: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,

    requestProfileImage: PropTypes.func,
    deleteFollow: PropTypes.func,
    postFollow: PropTypes.func
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <EpisodeList
          token={this.props.token}
          items={this.props.items}
          refreshCallback={this.props.requestUserEpisodes}>
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

    items: state.episode.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
