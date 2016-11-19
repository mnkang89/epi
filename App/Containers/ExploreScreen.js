// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import ExploreList from '../Components/common/ExploreList'

// Styles
import styles from './Styles/FeedScreenStyle'

class ExploreScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <ExploreList />
        </View>
      </View>
    )
  }
}

export default ExploreScreen
