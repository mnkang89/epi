// @flow
// EPISODE

import React, { Component } from 'react'
import { View } from 'react-native'
import UserFeedList from '../Components/common/UserFeedList'

// Styles
import styles from './Styles/FeedScreenStyle'

export default class UserProfileScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <UserFeedList />
      </View>
    )
  }
}
