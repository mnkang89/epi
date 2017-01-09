import { Component } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

class LoginController extends Component {
}

const mapStateToProps = (state) => {
  if (state.token.token === null && state.token.id === null) {
    Actions.GreetingScreen
  } else {
    Actions.root
  }
}

export default connect(mapStateToProps)(LoginController)
