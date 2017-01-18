// @flow
// EPISODE

import React, { Component, PropTypes } from 'react'
import {
  View
} from 'react-native'
import { connect } from 'react-redux'

import NotiList from '../Components/NotiList'
import styles from './Styles/FeedScreenStyle'

import NotiActions from '../Redux/NotiRedux'

class NotiScreen extends Component {
  static propTypes = {
    token: PropTypes.string,
    noties: PropTypes.array,

    requestNoties: PropTypes.func
  }

  componentDidMount () {
    const { token } = this.props

    this.isAttempting = true
    this.props.requestNoties(token)
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <NotiList
            token={this.props.token}
            noties={this.props.noties}
          />
        </View>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen)
