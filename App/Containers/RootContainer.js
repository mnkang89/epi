// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import DebugSettings from '../Config/DebugSettings'
import NavigationRouter from '../Navigation/NavigationRouter'

// Styles
import styles from './Styles/RootContainerStyle'

export default class RootContainer extends Component {
  componentDidMount () {
    // 이 부분에서 api콜 시전되면 될듯?
  }

  render () {
    console.tron.log('root container')
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='dark-content' />
        <NavigationRouter />
      </View>
    )
  }
}
