import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'

const windowSize = Dimensions.get('window')

class FirstScreen extends Component {
  static propTypes = {
    scrollViewHandler: PropTypes.object,

    signInHandler: PropTypes.func,
    signUpHandler: PropTypes.func,

    emailPasswordScreenDispatcher: PropTypes.func,
    nicknameScreenDispatcher: PropTypes.func,
    lostPasswordScreenDispatcher: PropTypes.func,
    passwordScreenDispatcher: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  onSignInPress () {
    this.props.signInHandler()
    this.props.emailPasswordScreenDispatcher(true)
    this.props.lostPasswordScreenDispatcher(false)
    this.props.scrollViewHandler.scrollTo({x: windowSize.width})
  }

  onSignUpPress () {
    this.props.signUpHandler()
    this.props.passwordScreenDispatcher(false)
    this.props.nicknameScreenDispatcher(false)
    this.props.scrollViewHandler.scrollTo({x: windowSize.width})
  }

  render () {
    return (
      <View>
        <View style={{width: windowSize.width, marginTop: 433}}>
          <View style={{marginLeft: 22.5, marginRight: 72, backgroundColor: 'rgba(0,0,0,0)'}}>
            <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 72}}>episode</Text>
          </View>
          <TouchableOpacity
            style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 32, marginLeft: 22.5, marginRight: 22.5}}
            onPress={this.onSignUpPress.bind(this)} >
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginTop: 20, marginLeft: 162.7, marginRight: 162.5}}
            onPress={this.onSignInPress.bind(this)} >
            <Text style={{textDecorationLine: 'underline', backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 15, alignSelf: 'center'}}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default FirstScreen
