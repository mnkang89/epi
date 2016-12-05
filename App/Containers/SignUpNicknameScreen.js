import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image
} from 'react-native'
import { connect } from 'react-redux'
// import LoginActions from '../Redux/LoginRedux'
import { Images } from '../Themes'

class SignUpPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render () {
    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>고마워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 86, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>에피소드에서 사용할 프로필사진과 이름을 설정해주세요 😀</Text>
        </View>
        <View style={{marginTop: 18, marginBottom: 28}}>
          <Image source={Images.profileIcon} style={{alignSelf: 'center'}} />
        </View>
        <View style={{marginTop: 0, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            placeholder='이름 (한글과 영문대소문자, 숫자만가능)'
            placeholderTextColor='white'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={
            () => { this.props.signUpNickname() }
          } >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>가입</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    error: state.login.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPasswordScreen)
