// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import FollowList from '../Components/common/CommentList'

// Styles
import styles from './Styles/FeedScreenStyle'

class FollowScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <FollowList />
        </View>
      </View>
    )
  }
}

export default FollowScreen
