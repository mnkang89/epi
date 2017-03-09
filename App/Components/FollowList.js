import React, { Component, PropTypes } from 'react'
import { ScrollView } from 'react-native'

import FollowDetail from './FollowDetail'

class FollowList extends Component {

  static propTypes = {
    follows: PropTypes.array,
    screen: PropTypes.string,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,
    resetFollowModal: PropTypes.func
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
        screen={this.props.screen}
        follow={follow}
        resetFollowModal={this.props.resetFollowModal}
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

FollowList.defaultProps = {
  follows: []
}

export default FollowList
