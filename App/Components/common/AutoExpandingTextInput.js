import React, { Component } from 'react'
import { TextInput } from 'react-native'

export default class AutoExpandingTextInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 0
    }
  }
  render () {
    return (
      <TextInput
        {...this.props}
        multiline
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height})
        }}
        onChangeText={(text) => {
          this.setState({text})
        }}
        style={{height: Math.max(35, this.state.height)}}
        value={this.state.text}
      />
    )
  }
}
