// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import NotiList from '../Components/NotiList'

// Styles
import styles from './Styles/FeedScreenStyle'

class NotiScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <NotiList />
        </View>
      </View>
    )
  }
}

export default NotiScreen
