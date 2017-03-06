import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image
} from 'react-native'
import { Images } from '../../Themes'

const windowSize = Dimensions.get('window')

class FirstScreen extends Component {
  static propTypes = {
    scrollViewHandler: PropTypes.func,
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

    this.props.scrollViewHandler()
    // this.scrollview.scrollTo({x: windowSize.width})
  }

  onSignUpPress () {
    this.props.signUpHandler()
    this.props.passwordScreenDispatcher(false)
    this.props.nicknameScreenDispatcher(false)

    this.props.scrollViewHandler()
    // this.scrollview.scrollTo({x: windowSize.width})
  }

  render () {
    console.log('퍼스트 스크린')
    return (
      <View style={{flex: 1, width: windowSize.width}} >
        <View style={{flex: 1}} >
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 30}}>
            <View style={{marginLeft: 20, backgroundColor: 'rgba(0,0,0,0)'}}>
              {/* <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 72}}>episode</Text> */}
              <Image style={{width: 246, height: 48}} source={Images.whiteEpisodeLogo} />
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={{width: windowSize.width - 40, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 32}}
                onPress={this.onSignUpPress.bind(this)} >
                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>회원가입</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: 20, alignItems: 'center'}}
                onPress={this.onSignInPress.bind(this)} >
                <Text style={{textDecorationLine: 'underline', backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 15}}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default FirstScreen
