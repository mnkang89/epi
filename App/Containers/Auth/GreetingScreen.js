// @flow
// EPISODE

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import Video from 'react-native-video'

// import { Actions as NavigationActions } from 'react-native-router-flux'

import { Videos } from '../../Themes'

import SignInScreen from './SignInScreen'
import LostPasswordScreen from './LostPasswordScreen'
import SignUpEmailScreen from './SignUpEmailScreen'
import SignUpPasswordScreen from './SignUpPasswordScreen'
import SignUpNicknameScreen from './SignUpNicknameScreen'

import GreetingActions from '../../Redux/GreetingRedux'

const windowSize = Dimensions.get('window')

class GreetingScreen extends Component {

  constructor (props) {
    super(props)
    this.state = {
      firstScreen: true,
      signInScreen: false,
      lostPasswordScreen: false,
      signUpScreen: false,
      passwordScreen: false,
      nicknameScreen: false,

      scrollViewXposition: 0,
      scrollEnabled: false,
      direction: null
    }
  }

  componentDidMount () {
    this.props.passwordScreenDispatcher(false)
    this.props.nicknameScreenDispatcher(false)
  }

  handleScroll (event) {
  }

  handleBeginDrag (event) {
    this.setState({scrollViewXposition: event.nativeEvent.contentOffset.x})
  }

  handleEndDrag (event) {
    const xPoint = event.nativeEvent.contentOffset.x
    const direction = (xPoint - this.state.scrollViewXposition > 0) ? 'right' : 'left'
    console.log(this.props)

    if (this.state.signInScreen &&
        this.props.emailPasswordScreen &&
        !this.props.lostPasswordScreen &&
        direction === 'left') {
      console.log('사인인에서 첫화면으로')
      this.setState({ scrollEnabled: false })
      this.props.emailPasswordScreenDispatcher(false)
      this.refs.scrollview.scrollTo({x: 0})
    } else if (this.state.signInScreen &&
        this.props.emailPasswordScreen &&
        !this.props.lostPasswordScreen &&
        direction === 'right') {
      console.log('사인인에서 로스트패스워드로')
      this.refs.scrollview.scrollTo({x: windowSize.width})
    } else if (this.props.lostPasswordScreen &&
      !this.props.emailPasswordScreen &&
      direction === 'left') {
      console.log('로스트패스워드에서 사인인으로')
      this.props.emailPasswordScreenDispatcher(true)
      this.props.lostPasswordScreenDispatcher(false)
      this.refs.scrollview.scrollTo({x: windowSize.width})
    } else if (this.state.signUpScreen &&
        !this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'left') {
      console.log(this.props)
      console.log('사인업에서 첫화면으로')
      this.setState({ scrollEnabled: false })
      this.refs.scrollview.scrollTo({x: 0})
    } else if (this.state.signUpScreen &&
        !this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'right') {
      console.log('사인업에서 패스워드로')
      this.refs.scrollview.scrollTo({x: windowSize.width})
    } else if (this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'left') {
      console.log('패스워드에서 사인업으로')
      this.props.passwordScreenDispatcher(false)
      this.refs.scrollview.scrollTo({x: windowSize.width})
    } else if (this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'right') {
      console.log('패스워드에서 닉네임으로')
      this.refs.scrollview.scrollTo({x: 2 * windowSize.width})
    } else if (!this.props.passwordScreen &&
        this.props.nicknameScreen &&
        direction === 'left') {
      console.log('닉네임에서 패스워드로')
      this.refs.scrollview.scrollTo({x: 2 * windowSize.width})
      this.props.passwordScreenDispatcher(true)
      this.props.nicknameScreenDispatcher(false)
    } else if (!this.props.passwordScreen &&
        this.props.nicknameScreen &&
        direction === 'right') {
      console.log('닉네임에서 오른쪽으로')
      this.refs.scrollview.scrollTo({x: 3 * windowSize.width})
    }
  }

  handleMomentumScrollEnd (event) {
  }

  renderSubGreetingScreen () {
    if (this.state.signInScreen &&
        !this.state.signUpScreen) {
      return (
        [
          <View key='1' style={{width: windowSize.width, alignItems: 'center'}}>
            <SignInScreen scrollViewHandler={this.refs.scrollview} />
          </View>,
          <View key='2' style={{width: windowSize.width, alignItems: 'center'}}>
            <LostPasswordScreen scrollViewHandler={this.refs.scrollview} />
          </View>
        ]
      )
    } else {
      return (
        [
          <View key='3' style={{width: windowSize.width, alignItems: 'center'}}>
            <SignUpEmailScreen scrollViewHandler={this.refs.scrollview} />
          </View>,
          <View key='4' style={{width: windowSize.width, alignItems: 'center'}}>
            <SignUpPasswordScreen scrollViewHandler={this.refs.scrollview} />
          </View>,
          <View key='5' style={{width: windowSize.width, alignItems: 'center'}}>
            <SignUpNicknameScreen scrollViewHandler={this.refs.scrollview} />
          </View>
        ]
      )
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
          }} />
        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 667}}>
          <ScrollView
            ref='scrollview'
            horizontal
            pagingEnabled
            scrollEnabled={this.state.scrollEnabled}
            onScroll={this.handleScroll.bind(this)}
            onScrollBeginDrag={this.handleBeginDrag.bind(this)}
            onScrollEndDrag={this.handleEndDrag.bind(this)}
            onMomentumScrollBegin={() => console.log('onMomentumScrollBegin')}
            onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
            scrollEventThrottle={10}
            snapToAlignment={'center'} >
            <View style={{width: windowSize.width, marginTop: 433}}>
              <View style={{marginLeft: 22.5, marginRight: 72, backgroundColor: 'rgba(0,0,0,0)'}}>
                <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 72}}>episode</Text>
              </View>
              <TouchableOpacity
                style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 32, marginLeft: 22.5, marginRight: 22.5}}
                onPress={
                  () => {
                    this.setState({
                      signUpScreen: true,
                      signInScreen: false,
                      scrollEnabled: true
                    })
                    this.props.passwordScreenDispatcher(false)
                    this.props.nicknameScreenDispatcher(false)
                    this.refs.scrollview.scrollTo({x: windowSize.width})
                  }
                } >
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>회원가입</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: 20, marginLeft: 162.7, marginRight: 162.5}}
                onPress={
                  () => {
                    this.setState({
                      signUpScreen: false,
                      signInScreen: true,
                      scrollEnabled: true
                    })
                    this.props.emailPasswordScreenDispatcher(true)
                    this.props.lostPasswordScreenDispatcher(false)
                    this.refs.scrollview.scrollTo({x: windowSize.width})
                  }
                } >
                <Text style={{textDecorationLine: 'underline', backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 15, alignSelf: 'center'}}>로그인</Text>
              </TouchableOpacity>
            </View>
            {this.renderSubGreetingScreen()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    emailPasswordScreen: state.greeting.emailPasswordScreen,
    lostPasswordScreen: state.greeting.lostPasswordScreen,

    passwordScreen: state.greeting.passwordScreen,
    nicknameScreen: state.greeting.nicknameScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    emailPasswordScreenDispatcher: (emailPasswordScreen) => dispatch(GreetingActions.emailPasswordScreenDispatcher(emailPasswordScreen)),
    lostPasswordScreenDispatcher: (lostPasswordScreen) => dispatch(GreetingActions.lostPasswordScreenDispatcher(lostPasswordScreen)),

    passwordScreenDispatcher: (passwordScreen) => dispatch(GreetingActions.passwordScreenDispatcher(passwordScreen)),
    nicknameScreenDispatcher: (nicknameScreen) => dispatch(GreetingActions.nicknameScreenDispatcher(nicknameScreen))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GreetingScreen)
