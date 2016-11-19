// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import AlertList from '../Components/common/AlertList'

// Styles
import styles from './Styles/FeedScreenStyle'

class AlertScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <AlertList />
        </View>
      </View>
    )
  }
}

export default AlertScreen
