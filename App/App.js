import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import '../I18n/I18n' // keep before root container
import RootContainer from './Containers/RootContainer'
import createStore from './Redux'
import applyConfigSettings from './Config'
import ExecutorPool from './Common/ExecutorPool'

// Apply config overrides
applyConfigSettings()
ExecutorPool()

// create our store
const store = createStore()

class App extends Component {

  render () {
    return (
      <Provider store={store} >
        <RootContainer />
      </Provider>
    )
  }
}

export default App
