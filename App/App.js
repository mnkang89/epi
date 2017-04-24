import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import '../I18n/I18n' // keep before root container
import RootContainer from './Containers/RootContainer'
import createStore from './Redux'
import applyConfigSettings from './Config'
import { Client } from 'bugsnag-react-native'

const bugsnag = new Client()

// import { Navigation } from 'react-native-navigation'
// import FeedScreen from './Containers/FeedScreen'

// Apply config overrides
applyConfigSettings()

// create our store
const store = createStore()

class App extends Component {
  componentDidMount () {
    bugsnag.notify(new Error('Test Error'))
  }
  render () {
    return (
      <Provider store={store} >
        <RootContainer />
      </Provider>
    )
  }
}

export default App
