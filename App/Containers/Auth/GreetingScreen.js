// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import Video from 'react-native-video'

// import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
// import styles from './Styles/FeedScreenStyle'
import { Videos } from '../../Themes'

import SignInScreen from './SignInScreen'
import LostPasswordScreen from './LostPasswordScreen'
import SignUpEmailScreen from './SignUpEmailScreen'
import SignUpPasswordScreen from './SignUpPasswordScreen'
import SignUpNicknameScreen from './SignUpNicknameScreen'

class GreetingScreen extends Component {

  constructor (props) {
    super(props)
    this.state = {
      firstScreen: true,
      signUpScreen: false,
      signInScreen: false,
      emailScreen: false,
      passwordScreen: false,
      nicknameScreen: false,
      emailPasswordScreen: false,
      lostPasswordScreen: false
    }
  }

  lostPassword () {
    this.setState({
      firstScreen: false,
      signUpScreen: false,
      signInScreen: true,
      emailScreen: false,
      passwordScreen: false,
      emailPasswordScreen: false,
      lostPasswordScreen: true
    })
  }

  sendPassword () {
    this.setState({
      firstScreen: true,
      signUpScreen: false,
      signInScreen: false,
      emailScreen: false,
      passwordScreen: false,
      nicknameScreen: false,
      emailPasswordScreen: false,
      lostPasswordScreen: false
    })
  }

  signUpEmail () {
    this.setState({
      firstScreen: false,
      signUpScreen: true,
      emailScreen: false,
      passwordScreen: true
    })
  }

  signUpPassword () {
    this.setState({
      firstScreen: false,
      signUpScreen: true,
      emailScreen: false,
      passwordScreen: false,
      nicknameScreen: true
    })
  }

  signUpNickname () {
    this.setState({
      firstScreen: true,
      signUpScreen: false,
      emailScreen: false,
      passwordScreen: false,
      nicknameScreen: false
    })
  }

  conditionalRender () {
    if (this.state.firstScreen) {
      return (
        <View style={{marginTop: 433}}>
          <View style={{marginLeft: 22.5, marginRight: 72, backgroundColor: 'rgba(0,0,0,0)'}}>
            <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 72}}>episode</Text>
          </View>
          <TouchableOpacity
            style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 32, marginLeft: 22.5, marginRight: 22.5}}
            onPress={
              () => {
                this.setState({
                  firstScreen: false,
                  signUpScreen: true,
                  signInScreen: false,
                  emailScreen: true,
                  passwordScreen: false,
                  lostPasswordScreen: false,
                  emailPasswordScreen: false,
                  nicknameScreen: false
                })
              }
            } >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: 20, marginLeft: 162.7, marginRight: 162.5}}
            onPress={
              () => {
                this.setState({
                  firstScreen: false,
                  signUpScreen: false,
                  signInScreen: true,
                  emailScreen: false,
                  passwordScreen: false,
                  lostPasswordScreen: false,
                  emailPasswordScreen: true,
                  nicknameScreen: false
                })
              }
            } >
            <Text style={{textDecorationLine: 'underline', backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 15, alignSelf: 'center'}}>로그인</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (this.state.signInScreen) {
      if (this.state.emailPasswordScreen) {
        return (
          <SignInScreen lostPassword={this.lostPassword.bind(this)} />
        )
      } else if (this.state.lostPasswordScreen) {
        return (
          <LostPasswordScreen sendPassword={this.sendPassword.bind(this)} />
        )
      }
    } else if (this.state.signUpScreen) {
      if (this.state.emailScreen) {
        return (
          <SignUpEmailScreen signUpEmail={this.signUpEmail.bind(this)} />
        )
      } else if (this.state.passwordScreen) {
        return (
          <SignUpPasswordScreen signUpPassword={this.signUpPassword.bind(this)} />
        )
      } else if (this.state.nicknameScreen) {
        return (
          <SignUpNicknameScreen signUpNickname={this.signUpNickname.bind(this)} />
        )
      }
    }
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Video source={Videos.backgroundVideo2}   // Can be a URL or a local file.
          muted
          ref={(ref) => {
            this.player = ref
          }}                             // Store reference
          paused={false}                 // Pauses playback entirely.
          resizeMode='cover'             // Fill the whole screen at aspect ratio.
          repeat={false}                 // Repeat forever.
          playInBackground={false}       // Audio continues to play when app entering background.
          playWhenInactive               // [iOS] Video continues to play when control or notification center are shown.
          progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 667}}>
          {this.conditionalRender()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return { }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GreetingScreen)
