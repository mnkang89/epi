import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'

import ExploreDetail from './ExploreDetail'
import AccountActions from '../../Redux/AccountRedux'

class ExploreList extends Component {

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
    this.props.requestUserEpisodes(token, accountId, active)
  }

  renderExplores () {
    return this.props.items.map(item =>
      <ExploreDetail key={item.episode.id} episode={item.episode} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderExplores()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExploreList)
