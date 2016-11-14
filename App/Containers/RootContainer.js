// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import DebugSettings from '../Config/DebugSettings'
import NavigationRouter from '../Navigation/NavigationRouter'
//import StartupActions from '../Redux/StartupRedux'
//import ReduxPersist from '../Config/ReduxPersist'

import { Colors } from '../Themes'
// Styles
import styles from './Styles/RootContainerStyle'

export default class RootContainer extends Component {
  componentDidMount () {
    //if redux persist is not active fire startup action
    // if (!ReduxPersist.active) {
    //  this.props.startup()
    //}
  }

  render () {
    console.disableYellowBox = !DebugSettings.yellowBox
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    )
  }
}

//const mapStateToDispatch = (dispatch) => ({
//  startup: () => dispatch(StartupActions.startup())
//})

//export default connect(null, mapStateToDispatch)(RootContainer)
