import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import { Client } from 'bugsnag-react-native'

import RootContainer from './Containers/RootContainer'
import createStore from './Redux'
import applyConfigSettings from './Config'
import ExecutorPool from './Common/ExecutorPool'

// const bugsnag = new Client()

// Apply config overrides
applyConfigSettings()
ExecutorPool()

// create our store
const store = createStore()

class App extends Component {
  componentDidMount () {
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
