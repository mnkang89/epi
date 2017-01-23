import React, { Component, PropTypes } from 'react'
import {
  View,
  // Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native'
// import { connect } from 'react-redux'
// import ConfirmError from '../../Components/common/ConfirmError'
// import SignupActions from '../../Redux/SignupRedux'
// import GreetingActions from '../../Redux/GreetingRedux'

// const windowSize = Dimensions.get('window')

class SignUpEmailScreen extends Component {

  static propTypes = {
    checking: PropTypes.bool,

    checkEmail: PropTypes.func,
    handler: PropTypes.func
  }

  constructor (props) {
    super(props)
// REFAC --DONE--
    this.state = {
      email: ''
    }
//  this.isAttempting = false
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      return false
    }
    return true
  }

/* REFAC
  1) 위로 올리기 -> inprogress
  componentWillReceiveProps (newProps) {
    console.log(newProps)
    this.forceUpdate()
    // console.log('이메일 중복검사')
    if (this.isAttempting && !newProps.checking && newProps.error === null) {
      console.log('유효한 이메일')
      this.props.scrollViewHandler.scrollTo({x: 2 * windowSize.width})
      // this.props.passwordScreenDispatcher(true)
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'VACANT') {
      console.log('유효하지 않은 이메일(공백)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일을 입력해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'DUPLICATED') {
      console.log('유효하지 않은 이메일(중복)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이미 사용 중인 이메일입니다.', '다시 한 번 확인해주세요.']
      })
    } else if (this.isAttempting && !newProps.checking && newProps.error === 'INVALID_FORMAT') {
      console.log('유효하지 않은 이메일(이메일 형식)')
      this.setState({
        error: newProps.error,
        alertVisible: true,
        alertTextArray: ['이메일 형식이 맞지 않습니다.', '다시 한 번 확인해주세요.']
      })
    }
  }
REFAC  */

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  handlePressEmail () {
    const { email } = this.state
    this.props.handler()

    this.props.checkEmail(email)
  }

/* REFAC
onDecline () {
  this.setState({
    alertVisible: false,
    alertTextArray: []
  })
}
1) 위로올리기 -> DONE
REFAC */

  render () {
    const { checking } = this.props
    const editable = !checking
/* REFAC
1) 컨펌에러 올리기 --> DONE
REFAC */
    return (
      <View style={{marginTop: 44, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style={{marginLeft: 21, marginRight: 70.5, marginBottom: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 60, marginBottom: 0}}>반가워요!</Text>
        </View>
        <View style={{marginTop: 8, marginLeft: 23, marginRight: 114, backgroundColor: 'rgba(0,0,0,0)'}}>
          <Text style={{color: 'white', opacity: 0.9, fontSize: 16}}>앞으로 더 자주 볼 수 있도록 이메일과 비밀번호를 등록해주세요 🙂</Text>
        </View>
        <View style={{marginTop: 111, marginLeft: 23, marginRight: 23, paddingBottom: 7.5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
          <TextInput
            ref='emailCheck'
            style={{fontWeight: 'bold', height: 20, color: 'white'}}
            editable={editable}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeEmail}
            onSubmitEditing={this.handlePressEmail.bind(this)}
            placeholder='이메일'
            placeholderTextColor='rgba(255,255,255,0.5)'
          />
        </View>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255,255,255,0.9)', paddingTop: 10, paddingBottom: 10, marginTop: 22, marginLeft: 22.5, marginRight: 22.5}}
          onPress={this.handlePressEmail.bind(this)} >
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>다음</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

/* REFAC
const mapStateToProps = (state) => {
  return {
    checking: state.signup.checking,
    error: state.signup.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkEmail: (email) => dispatch(SignupActions.emailCheck(email)),
    passwordScreenDispatcher: (passwordScreen) => dispatch(GreetingActions.passwordScreenDispatcher(passwordScreen))
  }
}

1) 통째로 날리기 --> DONE
REFAC */

export default SignUpEmailScreen
