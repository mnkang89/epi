// import React, { Component } from 'react'
// import { AppRegistry, View, Text, TouchableOpacity } from 'react-native'
import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/App'

// const Realm = require('realm')
// const realm = new Realm({
//   schema: [{name: 'Dog', properties: {name: 'string'}}]
// })
//
// class ck extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       rendering: realm.objects('Dog').length
//     }
//   }
//
//   componentDidMount () {
//     realm.addListener('change', () => {
//       this.setState({
//         rendering: realm.objects('Dog').length
//       })
//     })
//   }
//
//   componentWillMount () {
//   }
//
//   _buttonPress = () => {
//     realm.write(() => {
//       realm.create('Dog', {name: 'Rex'})
//     })
//   }
//
//   render () {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <TouchableOpacity onPress={this._buttonPress}>
//           <Text>버튼</Text>
//         </TouchableOpacity>
//         <Text>
//           {this.state.rendering}
//         </Text>
//       </View>
//     )
//   }
// }

AppRegistry.registerComponent('Episode', () => App)
