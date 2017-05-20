'use strict'

import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  StatusBar,
  Modal as NativeModal,
  ActivityIndicator
} from 'react-native'

import { getAccountId } from '../Services/Auth'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Modal from 'react-native-modalbox'
import CameraComponent from '../Components/camera/CameraComponent'
import CameraController from '../Components/camera/CameraScreenController'
import CameraHandler from '../Components/camera/CameraHandler'
import { connect } from 'react-redux'
import CameraScreenActions from '../Redux/CameraScreenRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import Permissions from 'react-native-permissions'

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
      cameraHandler: new CameraHandler(),
      type: 'back',
      loadingModal: false
    }
  }

  componentDidUpdate () {
    if (this.props.endScreen) {
      this.props.initializeCameraScreenProps()
      this.goToHomeTab()
    }
  }

  cameraPermissionCheck () {
    Permissions.getPermissionStatus('camera')
    .then(response => {
      if (response === 'undetermined') {
        Permissions.requestPermission('camera').then(response => {
          if (response === 'authorized') {
            this.props.setPermission(true)
          } else {
            this.props.setPermission(false)
          }
        })
      } else if (response === 'denied') {
        this.props.setPermission(false)
      } else {
        this.props.setPermission(true)
      }
    })
  }

  goToHomeTab () {
    this.setState({loadingModal: false}, () => {
      StatusBar.setHidden(false)
      // NavigationActions.pop()
      setTimeout(() => {
        NavigationActions.pop()
        // NavigationActions.homeTab()
      }, 500)
    })
  }

  closeModal () {
    StatusBar.setHidden(false)
    NavigationActions.pop()
  }

  activeLoadingModal () {
    this.setState({loadingModal: true})
  }

  deactiveLoadingModal () {
    this.setState({loadingModal: false})
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <Modal
          ref={(modal) => { this.modal = modal }}
          style={{backgroundColor: 'transparent', flex: 1}}
          position={'center'}
          backdrop={false}
          swipeThreshold={100}
          isOpen
          // onOpened={this.cameraPermissionCheck.bind(this)}
          onClosed={this.closeModal.bind(this)} >
          <View style={{flex: 1, flexDirection: 'column'}}>
            <NativeModal
              animationType={'none'}
              transparent
              visible={this.state.loadingModal} >
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.59)', alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator
                  size='large'
                  color='white' />
              </View>
            </NativeModal>
            <View style={{flex: cameraHeightAsFlex}}>
              <CameraComponent type={this.state.type} cameraHandler={this.state.cameraHandler} />
            </View>
            <View style={{flex: cameraControllerHeightAsFlex}}>
              <CameraController parentThis={this} cameraHandler={this.state.cameraHandler} />
            </View>
          </View>
        </Modal>
      </View>
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
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),

    setPermission: (state) => dispatch(CameraScreenActions.setPermission(state))
  })
}

export default connect(mapStateToProps, mapStateToDispatch)(CameraScreen)
