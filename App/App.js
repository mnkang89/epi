import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import '../I18n/I18n' // keep before root container
import RootContainer from './Containers/RootContainer'
import createStore from './Redux'
import applyConfigSettings from './Config'

// Apply config overrides
applyConfigSettings()

// create our store
const store = createStore()

class App extends Component {
  render () {
    console.tron.log('app')
    return (
      <Provider store={store} >
        <RootContainer />
      </Provider>
    )
  }
}

export default App
