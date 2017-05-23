import React, { Component, PropTypes } from 'react'
import { ScrollView } from 'react-native'

import FollowDetail from './FollowDetail'

class FollowList extends Component {

  static propTypes = {
    follows: PropTypes.array,
    screen: PropTypes.string,
    navigation: PropTypes.object,

    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func,
    resetFollowModal: PropTypes.func,
    pushHandler: PropTypes.func,
    popHandler: PropTypes.func
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
        navigation={this.props.navigation}
        follow={follow}
        resetFollowModal={this.props.resetFollowModal}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow}
        pushHandler={this.props.pushHandler}
        popHandler={this.props.popHandler} />
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
