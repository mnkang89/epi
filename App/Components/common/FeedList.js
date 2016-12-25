import React, { Component } from 'react'
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import EpisodeDetail from './EpisodeDetail'
import AccountActions from '../../Redux/AccountRedux'
import EpisodeActions from '../../Redux/EpisodeRedux'

class FeedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      follow: 'gray'
    }
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      console.log(nextProps.items)
      console.log(this.props.items)
      return
    } else {
      console.log('아이템다름')
      console.log(nextProps.items)
      console.log(this.props.items)
      console.log('윌리시브에서 리프레슁 상태 1')
      console.log(this.state.refreshing)
      if (this.state.refreshing) {
        this.setState({refreshing: false})
        console.log('윌리시브에서 리프레슁 상태 2')
        setTimeout(() => {
          console.log(this.state.refreshing)
        }, 100)
      }
      // const { token, accountId } = nextProps
      // const active = false
      // this.props.requestUserEpisodes(token, accountId, active)
    }
  }

  componentDidMount () {
    const { token, accountId } = this.props
    // const active = false

    this.isAttempting = true
    // attempt to check email - a saga is listening to pick it up from here.
    this.props.requestInfo(token, accountId)
    // this.props.requestUserEpisodes(token, accountId, active)
  }

  onRefresh () {
    console.log('onRefresh에서 리프레슁 상태')
    console.log(this.state.refreshing)
    const { token, accountId } = this.props
    const active = false
    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, active)
  }

  renderEpisodes () {
    console.log(this.props)
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} />)
  }

  renderFeeds () {
    if (this.props.items.length === 0) {
      return (
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
            <Text style={{fontSize: 60, fontWeight: 'bold', color: 'white'}}>안녕하세요!</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
            <Text style={{fontSize: 16, color: 'white'}}>다른 사람들의 에피소드를 구경하고</Text>
            <Text style={{fontSize: 16, color: 'white'}}>팔로우 해보세요!</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
            <TouchableOpacity>
              <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: 'white'}}>
                <Text style={{fontSize: 16, color: 'white'}}>에피소드 탐색</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
          >
          {this.renderEpisodes()}
        </ScrollView>
      )
    }
  }

  render () {
    return (
      <View>
        {this.renderFeeds()}
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,
    // items: state.feed.bestFeeds
    items: state.episode.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, accountId, active) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, active))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
