import React, { Component, PropTypes } from 'react'
import { ScrollView } from 'react-native'

import FollowDetail from './FollowDetail'

class FollowList extends Component {

  static propTypes = {
    follows: PropTypes.array,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderFollows () {
    return this.props.follows.map(follow =>
      <FollowDetail
        key={follow.id}
        follow={follow}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow} />
    )
  }

  render () {
    return (
      <ScrollView>
        {this.renderFollows()}
      </ScrollView>
    )
  }
}

export default FollowList
