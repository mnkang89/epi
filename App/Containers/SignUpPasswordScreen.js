import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
// import LoginActions from '../Redux/LoginRedux'

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
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 57, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            placeholder='비밀번호 (최소 8자, 최대 12자)'
            placeholderTextColor='white'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'white', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            placeholder='비밀번호 확인'
            placeholderTextColor='white'
            style={{fontWeight: 'bold', color: 'white', height: 20}}
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'white', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={
            () => { this.props.signUpPassword() }
          } >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
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
