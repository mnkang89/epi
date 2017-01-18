// TODO: *프로필 컴포넌트 따로 만들고 에피소드 리스트 리팩토링해서 재활용성 높이기

import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'

import EpisodeDetail from './EpisodeDetail'

class EpisodeList extends Component {

  static propTypes = {
    items: PropTypes.array
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderEpisodes () {
    return this.props.items.map(item =>
      <EpisodeDetail key={item.episode.id} episode={item.episode} account={item.account} />)
  }

  render () {
    return (
      <View>
        {this.props.children}
        {this.renderEpisodes()}
      </View>
    )
  }

}

export default EpisodeList
