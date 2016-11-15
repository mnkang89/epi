// @flow
// EPISODE

import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../Components/common/FeedList'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class FeedScreen extends Component {

  render () {
    return (
      <View style={styles.mainContainer}>
        <FeedList />
      </View>
    )
  }
}
