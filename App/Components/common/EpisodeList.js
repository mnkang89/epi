// TODO: *프로필 컴포넌트 따로 만들고 에피소드 리스트 리팩토링해서 재활용성 높이기

import React, { Component, PropTypes } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import _ from 'lodash'

import EpisodeDetail from './EpisodeDetail'

class EpisodeList extends Component {

  static propTypes = {
    token: PropTypes.string,
    items: PropTypes.array,

    refreshCallback: PropTypes.func
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
        setTimeout(() => {
          console.log(this.state.refreshing)
        }, 100)
      }
    }
  }

  onRefresh () {
    // const { token, episodeId } = this.props

    this.setState({refreshing: true})
    this.props.refreshCallback(this.props.token, this.props.acountId, true)
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} account={item.account} />)
  }

  render () {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.props.children}
        {this.renderEpisodes()}
      </ScrollView>
    )
  }

}

export default EpisodeList
