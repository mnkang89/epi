'use strict'

import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  StatusBar
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import Modal from 'react-native-modalbox'
import CameraComponent from '../Components/camera/CameraComponent'
import CameraController from '../Components/camera/CameraScreenController'
import CameraHandler from '../Components/camera/CameraHandler'
import { connect } from 'react-redux'
import CameraScreenActions from '../Redux/CameraScreenRedux'

import EpisodeActions from '../Redux/EpisodeRedux'

const { height, width } = Dimensions.get('window')
const cameraHeightAsFlex = Math.ceil(width / height * 100)
const cameraControllerHeightAsFlex = Math.ceil((height - width) / height * 100)

class CameraScreen extends Component {
  static PropTypes = {
    endScreen: PropTypes.bool,
    initializeCameraScreenProps: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      cameraHandler: new CameraHandler()
    }
  }

  componentDidUpdate () {
    if (this.props.endScreen) {
      this.props.initializeCameraScreenProps()
      this.goToHomeTab()
    }
  }

  goToHomeTab () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.props.requestUserEpisodes(token, accountId, withFollowing)

    StatusBar.setHidden(false)
    NavigationActions.homeTab()
  }

  render () {
    return (
      <Modal
        ref={(modal) => { this.modal = modal }}
        style={{backgroundColor: 'white', flex: 1}}
        position={'center'}
        backdrop={false}
        swipeThreshold={10}
        isOpen
        onClosed={this.goToHomeTab.bind(this)}
        >
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: cameraHeightAsFlex}}>
            <CameraComponent cameraHandler={this.state.cameraHandler} />
          </View>
          <View style={{flex: cameraControllerHeightAsFlex}}>
            <CameraController cameraHandler={this.state.cameraHandler} />
          </View>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  console.tron.log(state.cameraScreen)
  return ({
    token: state.token.token,
    accountId: state.token.id,

    endScreen: state.cameraScreen.endScreen
  })
}

const mapStateToDispatch = (dispatch) => {
  return ({
    initializeCameraScreenProps: () => dispatch(CameraScreenActions.initialize()),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing))
  })
}

export default connect(mapStateToProps, mapStateToDispatch)(CameraScreen)
