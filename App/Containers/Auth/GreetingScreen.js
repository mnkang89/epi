
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Dimensions,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions, ActionConst } from 'react-native-router-flux'
import Video from 'react-native-video'

import { Videos } from '../../Themes'
import { getObjectDiff } from '../../Lib/Utilities'
import ConfirmError from '../../Components/common/ConfirmError'

import FirstScreen from '../../Components/Auth/FirstScreen'
import SignInScreen from '../../Components/Auth/SignInScreen'
import LostPasswordScreen from '../../Components/Auth/LostPasswordScreen'
import SignUpEmailScreen from '../../Components/Auth/SignUpEmailScreen'
import SignUpPasswordScreen from '../../Components/Auth/SignUpPasswordScreen'
import SignUpNicknameScreen from '../../Components/Auth/SignUpNicknameScreen'

import GreetingActions from '../../Redux/GreetingRedux'
import SignupActions from '../../Redux/SignupRedux'
import EpisodeActions from '../../Redux/EpisodeRedux'
import LoginActions from '../../Redux/LoginRedux'

const windowSize = Dimensions.get('window')

class GreetingScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      signUpScreen: true,
      signInScreen: false,

      // scroll
      scrollViewXposition: 0,
      scrollEnabled: false,

      // confirm
      alertVisible: false,
      alertTextArray: []
    }

    this.isSignUpEmailChecking = false
    this.isSignUpPasswordChecking = false
    this.isSignUpNicknameChecking = false
    this.isSignInAttempting = false

    this.textRefs = []
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.scrollViewXposition !== this.state.scrollViewXposition) {
      return false
    }
    return true
  }

  componentWillReceiveProps (newProps) {
    console.log(getObjectDiff(this.props, newProps))
    if (this.isSignUpEmailChecking) {
      console.log('email Receive')
      console.log(newProps)
      if (!newProps.signUpChecking && newProps.signUpError === null) {
        console.log('유효한 이메일')
        this.handleSignUpEmailChecking()

        this.props.passwordScreenDispatcher(true)
        this.scrollview.scrollTo({x: 3 * windowSize.width})
      } else if (!newProps.signUpChecking && newProps.signUpError === 'VACANT') {
        console.log('유효하지 않은 이메일(공백)')
        this.handleSignUpEmailChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['이메일을 입력해주세요.']
        })
      } else if (!newProps.signUpChecking && newProps.signUpError === 'DUPLICATED') {
        console.log('유효하지 않은 이메일(중복)')
        this.handleSignUpEmailChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['이미 사용 중인 이메일입니다.', '다시 한 번 확인해주세요.']
        })
      } else if (!newProps.signUpChecking && newProps.signUpError === 'INVALID_FORMAT') {
        console.log('유효하지 않은 이메일(이메일 형식)')
        this.handleSignUpEmailChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['이메일 형식이 맞지 않습니다.', '다시 한 번 확인해주세요.']
        })
      }
    } else if (this.isSignUpPasswordChecking) {
      if (!newProps.signUpChecking && newProps.signUpError === null && newProps.attempting) {
        console.log('유효한 비밀번호')
      } else if (!newProps.signUpChecking && newProps.signUpError === 'VACANT') {
        console.log('유효하지 않은 비밀번호(공백)')
        this.handleSignUpPasswordChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['비밀번호를 입력해주세요.']
        })
        this.handleSignUpPasswordChecking()
      } else if (!newProps.signUpChecking && newProps.signUpError === 'NOT_MATCH') {
        console.log('유효하지 않은 비밀번호(불일치)')
        this.handleSignUpPasswordChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['비밀번호가 일치하지 않습니다.']
        })
      } else if (!newProps.signUpChecking && newProps.signUpError === 'INVALID_FORMAT') {
        console.log('유효하지 않은 비밀번호(비밀번호 형식)')
        this.handleSignUpPasswordChecking()

        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['비밀번호를 다시 한 번', '확인해주세요.']
        })
      } else if (!newProps.attempting && newProps.attemptingerror === null) {
        console.log('유효한 회원가입')
        this.handleSignUpPasswordChecking()
        this.props.passwordScreenDispatcher(false)
        this.props.nicknameScreenDispatcher(true)

        this.scrollview.scrollTo({x: 5 * windowSize.width})
      } else if (!newProps.attempting && newProps.attemptingerror === 'WRONG') {
        console.log('유효하지 않은 회원가입')
        this.handleSignUpPasswordChecking()
      }
    } else if (this.isSignUpNicknameChecking) {
      console.log('닉네임 중복검사')
      if (!newProps.signUpChecking && newProps.signUpError === null) {
        console.log('유효한 닉네임')
        this.handleSignUpNicknameChecking()
        NavigationActions.tabBar({type: ActionConst.RESET})
        // NavigationActions.cameraTab()
      } else if (!newProps.signUpChecking && newProps.signUpError === 'VACANT') {
        console.log('유효하지 않은 닉네임(공백)')
        this.handleSignUpNicknameChecking()
        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['이름을 입력해주세요.']
        })
      } else if (!newProps.signUpChecking && newProps.signUpError === 'DUPLICATED') {
        console.log('유효하지 않은 닉네임(중복)')
        this.handleSignUpNicknameChecking()
        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['이미 사용 중인 이름입니다.', '다른 이름을 사용해주세요.']
        })
      } else if (!newProps.signUpChecking && newProps.signUpError === 'INVALID_FORMAT') {
        console.log('유효하지 않은 닉네임(닉네임 형식)')
        this.handleSignUpNicknameChecking()
        this.setState({
          error: newProps.signUpError,
          alertVisible: true,
          alertTextArray: ['한글과 영문대소문자 숫자만', '사용 가능합니다.', '다시 한번 확인해주세요.']
        })
      }
    } else if (this.isSignInAttempting) {
      console.log('로그인 시도')
      if (!newProps.fetching && newProps.signInError === null && newProps.token !== null) {
        console.log('로그인 성공')
        // const { token, accountId } = newProps

        // this.props.requestUserEpisodes(token, accountId, true)
        // this.props.requestUserEpisodesWithFalse(token, accountId, false)
        NavigationActions.tabBar({type: ActionConst.RESET})
      } else if (!newProps.fetching && newProps.signInError === 'INVALID_FORMAT') {
        console.log('유효하지 않은 형식')
        this.handleSignInAttempting()
        this.setState({
          error: newProps.signInError,
          alertVisible: true,
          alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
        })
      } else if (!newProps.fetching && newProps.signInError === 'VACANT_EMAIL') {
        console.log('이메일을 입력해주세요')
        this.handleSignInAttempting()
        this.setState({
          error: newProps.signInError,
          alertVisible: true,
          alertTextArray: ['이메일을 입력해주세요.']
        })
      } else if (!newProps.fetching && newProps.signInError === 'VACANT_PASSWORD') {
        console.log('비밀번호를 입력해주세요')
        this.handleSignInAttempting()
        this.setState({
          error: newProps.signInError,
          alertVisible: true,
          alertTextArray: ['비밀번호를 입력해주세요.']
        })
      } else if (!newProps.fetching && newProps.signInError === 'INVALID_EMAIL') {
        console.log('유효하지 않은 이메일')
        this.handleSignInAttempting()
        this.setState({
          error: newProps.signInError,
          alertVisible: true,
          alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
        })
      } else if (!newProps.fetching && newProps.signInError === 'INVALID_PASSWORD') {
        console.log('유효하지 않은 비밀번호')
        this.handleSignInAttempting()
        this.setState({
          error: newProps.signInError,
          alertVisible: true,
          alertTextArray: ['이메일 혹은 비밀번호가', '바르지 않습니다.', '다시 한 번 확인해주세요.']
        })
      }
    }
  }

  onDecline () {
    this.setState({
      alertVisible: false,
      alertTextArray: []
    })
  }

  handleScrollview (x = 1) {
    this.scrollview.scrollTo({x: x * windowSize.width})
  }

  handleSignUpEmailChecking () {
    this.isSignUpEmailChecking = !this.isSignUpEmailChecking
  }

  handleSignUpPasswordChecking () {
    this.isSignUpPasswordChecking = !this.isSignUpPasswordChecking
  }

  handleSignUpNicknameChecking () {
    this.isSignUpNicknameChecking = !this.isSignUpNicknameChecking
  }
  handleSignInAttempting () {
    this.isSignInAttempting = !this.isSignInAttempting
  }

  handleSignUpPress () {
    this.setState({
      signUpScreen: true,
      signInScreen: false,
      scrollEnabled: true
    })
  }

  handleSignInPress () {
    this.setState({
      signUpScreen: false,
      signInScreen: true,
      scrollEnabled: true
    })
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
      this.scrollview.scrollTo({x: 0})
      this.props.emailPasswordScreenDispatcher(false)
      this.setState({ scrollEnabled: false })
    } else if (this.state.signInScreen &&
        this.props.emailPasswordScreen &&
        !this.props.lostPasswordScreen &&
        direction === 'right') {
      console.log('사인인에서 로스트패스워드로')
      this.scrollview.scrollTo({x: windowSize.width})
    } else if (this.props.lostPasswordScreen &&
      !this.props.emailPasswordScreen &&
      direction === 'left') {
      console.log('로스트패스워드에서 사인인으로')
      this.scrollview.scrollTo({x: windowSize.width})
      this.props.emailPasswordScreenDispatcher(true)
      this.props.lostPasswordScreenDispatcher(false)
    } else if (this.state.signUpScreen &&
        !this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'left') {
      console.log('사인업에서 첫화면으로')
      this.scrollview.scrollTo({x: 0})
      this.setState({ scrollEnabled: false })
    } else if (this.state.signUpScreen &&
        !this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'right') {
      console.log('사인업에서 패스워드로')
      this.scrollview.scrollTo({x: windowSize.width})
    } else if (this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'left') {
      console.log('패스워드에서 사인업으로')
      this.scrollview.scrollTo({x: windowSize.width})
      this.props.passwordScreenDispatcher(false)
    } else if (this.props.passwordScreen &&
        !this.props.nicknameScreen &&
        direction === 'right') {
      console.log('패스워드에서 닉네임으로')
      this.scrollview.scrollTo({x: 3 * windowSize.width})
    } else if (!this.props.passwordScreen &&
        this.props.nicknameScreen &&
        direction === 'left') {
      console.log('닉네임에서 패스워드로')
      this.scrollview.scrollTo({x: 3 * windowSize.width})
      this.props.passwordScreenDispatcher(true)
      this.props.nicknameScreenDispatcher(false)
    } else if (!this.props.passwordScreen &&
        this.props.nicknameScreen &&
        direction === 'right') {
      console.log('닉네임에서 오른쪽으로')
      this.scrollview.scrollTo({x: 5 * windowSize.width})
    }
  }

  handleMomentumScrollEnd (event) {
  }

  _onStartShouldSetResponderCapture (e) {
    const target = e.nativeEvent.target
    console.log(this.textRefs)

    for (let i = 0; i < this.textRefs.length; i++) {
      if (target !== findNodeHandle(this.textRefs[i])) {
        this.textRefs[i].blur()
      }
    }
  }

  renderSubGreetingScreen () {
    if (this.state.signInScreen &&
        !this.state.signUpScreen) {
      return (
        [
          <View key='1' style={{width: windowSize.width}}>
            <SignInScreen
              parentHandler={this}
              handler={this.handleSignInAttempting.bind(this)}
              fetching={this.props.fetching}
              scrollViewHandler={this.handleScrollview.bind(this)}
              lostPasswordScreenDispatcher={this.props.lostPasswordScreenDispatcher}
              emailPasswordScreenDispatcher={this.props.emailPasswordScreenDispatcher}
              attemptLogin={this.props.attemptLogin} />
          </View>,
          <View key='2' style={{width: windowSize.width}} />,
          <View key='3' style={{width: windowSize.width}}>
            <LostPasswordScreen
              parentHandler={this}
              scrollViewHandler={this.handleScrollview.bind(this)} />
          </View>
        ]
      )
    } else {
      return (
        [
          <View key='4' style={{width: windowSize.width}}>
            <SignUpEmailScreen
              parentHandler={this}
              handler={this.handleSignUpEmailChecking.bind(this)}
              checking={this.props.signUpChecking}
              checkEmail={this.props.checkEmail} />
          </View>,
          <View key='5' style={{width: windowSize.width}} />,
          <View key='6' style={{width: windowSize.width}}>
            <SignUpPasswordScreen
              parentHandler={this}
              handler={this.handleSignUpPasswordChecking.bind(this)}
              email={this.props.email}
              checking={this.props.signUpChecking}
              checkPassword={this.props.checkPassword} />
          </View>,
          <View key='7' style={{width: windowSize.width}} />,
          <View key='8' style={{width: windowSize.width}}>
            <SignUpNicknameScreen
              parentHandler={this}
              handler={this.handleSignUpNicknameChecking.bind(this)}
              checking={this.props.signUpChecking}
              token={this.props.token}
              accountId={this.props.accountId}
              checkNickname={this.props.checkNickname}
              requestProfileImage={this.props.requestProfileImage} />
          </View>
        ]
      )
    }
  }

  render () {
    return (
      <View style={{flex: 1}}
        // onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
      >
        <ConfirmError
          visible={this.state.alertVisible}
          TextArray={this.state.alertTextArray}
          onAccept={this.onDecline.bind(this)} />
        <Video source={Videos.backgroundVideo}   // Can be a URL or a local file.
          muted
          ref={(ref) => {
            this.player = ref
          }}                             // Store reference
          paused={false}                 // Pauses playback entirely.
          resizeMode='cover'             // Fill the whole screen at aspect ratio.
          repeat                         // Repeat forever.
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
        <View
          style={{backgroundColor: 'rgba(0,0,0,0.5)', height: windowSize.height}}
          // style={{backgroundColor: 'rgba(0,0,0,0.5)', height: windowSize.height}}
          // onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
          >
          <ScrollView
            ref={(component) => { this.scrollview = component }}
            horizontal
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps='always'
            pagingEnabled
            scrollEnabled={this.state.scrollEnabled}
            onScroll={this.handleScroll.bind(this)}
            onScrollBeginDrag={this.handleBeginDrag.bind(this)}
            onScrollEndDrag={this.handleEndDrag.bind(this)}
            onMomentumScrollBegin={() => {}}
            onMomentumScrollEnd={this.handleMomentumScrollEnd.bind(this)}
            scrollEventThrottle={10}
            snapToAlignment={'center'} >
            <FirstScreen
              scrollViewHandler={this.handleScrollview.bind(this)}
              signInHandler={this.handleSignInPress.bind(this)}
              signUpHandler={this.handleSignUpPress.bind(this)}
              emailPasswordScreenDispatcher={this.props.emailPasswordScreenDispatcher}
              nicknameScreenDispatcher={this.props.nicknameScreenDispatcher}
              lostPasswordScreenDispatcher={this.props.lostPasswordScreenDispatcher}
              passwordScreenDispatcher={this.props.passwordScreenDispatcher} />
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
    nicknameScreen: state.greeting.nicknameScreen,

    token: state.token.token,
    accountId: state.token.id,

    email: state.signup.email,
    signUpChecking: state.signup.checking,
    signUpError: state.signup.error,

    attempting: state.signup.attempting,
    attemptingerror: state.signup.attemptingerror,

    fetching: state.login.fetching,
    signInError: state.login.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    emailPasswordScreenDispatcher: (emailPasswordScreen) => dispatch(GreetingActions.emailPasswordScreenDispatcher(emailPasswordScreen)),
    lostPasswordScreenDispatcher: (lostPasswordScreen) => dispatch(GreetingActions.lostPasswordScreenDispatcher(lostPasswordScreen)),

    passwordScreenDispatcher: (passwordScreen) => dispatch(GreetingActions.passwordScreenDispatcher(passwordScreen)),
    nicknameScreenDispatcher: (nicknameScreen) => dispatch(GreetingActions.nicknameScreenDispatcher(nicknameScreen)),

    checkEmail: (email) => dispatch(SignupActions.emailCheck(email)),
    checkPassword: (email, password, passwordCheck) => dispatch(SignupActions.passwordRequest(email, password, passwordCheck)),
    checkNickname: (nickname, token, accountId) => dispatch(SignupActions.nicknameCheck(nickname, token, accountId)),

    requestProfileImage: (photoSource, token, accountId) => dispatch(SignupActions.profileRequest(photoSource, token, accountId)),

    requestUserEpisodes: (token, accountId, active) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, active)),
    requestUserEpisodesWithFalse: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesWithFalseRequest(token, accountId, withFollowing)),
    attemptLogin: (email, password) => dispatch(LoginActions.loginRequest(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GreetingScreen)
