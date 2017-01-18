import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'

import ExploreDetail from './ExploreDetail'

class ExploreList extends Component {

  static propTypes = {
    token: PropTypes.string,
    items: PropTypes.array.isRequired,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderExplores () {
    return this.props.items.map(item =>
      <ExploreDetail
        key={item.episode.id}
        token={this.props.token}
        following={item.following}
        episode={item.episode}
        account={item.account}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow} />
    )
  }

  render () {
    return (
      <View>
        {this.renderExplores()}
      </View>
    )
  }
}

export default ExploreList
