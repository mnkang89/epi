import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'

import EpisodeDetail from './EpisodeDetail'
import AccountActions from '../../Redux/AccountRedux'

class FeedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apisodes: [],
      follow: 'gray'
    }
  }

  componentDidMount () {
    const { token, accountId } = this.props
    const active = false

    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.requestInfo(token, accountId)
    this.props.requestUserEpisodes(token, accountId, active)
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    nickname: state.account.nickname,
    profileImagePath: state.account.profileImagePath,
    followerCount: state.account.followerCount,
    followingCount: state.account.followingCount,

    items: state.account.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, accountId, active) => dispatch(AccountActions.userEpisodesRequest(token, accountId, active))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
