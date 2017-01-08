import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'

import NotiDetail from './NotiDetail'
import NotiActions from '../../Redux/NotiRedux'

class NotiList extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    const { token } = this.props

    this.isAttempting = true
    this.props.requestNoties(token)
  }

  renderNoties () {
    return this.props.noties.map(noti =>
      <NotiDetail key={noti.id} noti={noti} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderNoties()}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,

    noties: state.noti.noties
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNoties: (token) => dispatch(NotiActions.notiesRequest(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiList)
