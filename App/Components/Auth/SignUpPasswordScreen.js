import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'

class SignUpPasswordScreen extends Component {
  static propTypes = {
    email: PropTypes.string,
    checking: PropTypes.bool,

    checkPassword: PropTypes.func,
    handler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      password: '',
      passwordCheck: ''
    }
    this.isAttempting = false
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.password !== this.state.password ||
      nextState.passwordCheck !== this.state.passwordCheck) {
      return false
    }
    return true
  }

  handleChangePassword (text) {
    this.setState({ password: text })
  }

  handleChangePasswordCheck (text) {
    this.setState({ passwordCheck: text })
  }

  handlePressPassword () {
    const { email } = this.props
    const { password, passwordCheck } = this.state

    this.props.handler()
    this.props.checkPassword(email, password, passwordCheck)
  }

  render () {
    const { checking } = this.props
    const editable = !checking

    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 57, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='password'
            editable={editable}
            secureTextEntry
            keyboardType='default'
            returnKeyType='next'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangePassword.bind(this)}
            onSubmitEditing={() => this.refs.passwordCheck.focus()}
            placeholder='비밀번호 (최소 8자, 최대 12자)'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={{fontWeight: 'bold', color: 'white', height: 20}} />
        </View>
        <View style={{marginTop: 23, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0)'}}>
          <TextInput
            ref='passwordCheck'
            editable={editable}
            secureTextEntry
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangePasswordCheck.bind(this)}
            onSubmitEditing={this.handlePressPassword.bind(this)}
            placeholder='비밀번호 확인'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={{fontWeight: 'bold', color: 'white', height: 20}} />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressPassword.bind(this)} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default SignUpPasswordScreen
