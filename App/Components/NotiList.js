import React, { Component, PropTypes } from 'react'
import { ScrollView } from 'react-native'

import NotiDetail from './NotiDetail'

class NotiList extends Component {

  static propTypes = {
    token: PropTypes.string,
    noties: PropTypes.array,
    myAccount: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderNoties () {
    return this.props.noties.map(noti =>
      <NotiDetail key={noti.id} noti={noti} myAccount={this.props.myAccount} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderNoties()}
      </ScrollView>
    )
  }
}

export default NotiList
