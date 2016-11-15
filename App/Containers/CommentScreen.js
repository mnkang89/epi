// @flow
// EPISODE

import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import CommentList from '../Components/common/CommentList'

// Styles
import styles from './Styles/FeedScreenStyle'

const windowSize = Dimensions.get('window')

class CommentScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 25,
      inputBottom: 40
    }
  }

  onTextChange (event) {
    const { contentSize, text } = event.nativeEvent
    this.setState({
      text: text,
      height: contentSize.height > 80 ? 80 : contentSize.height
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <CommentList />
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={styles2.textContainer}>
            <TextInput
              placeholder='댓글 쓰기..'
              style={[styles2.input, {paddingTop: 5, marginBottom: 10, height: this.state.height}]}
              multiline
              onFocus={() => { this.setState({inputBottom: 0}) }}
              onBlur={() => { this.setState({inputBottom: 40}) }}
              onChange={this.onTextChange.bind(this)}
              value={this.state.text} />
          </View>
          <View style={styles2.sendContainer}>
            <TouchableHighlight>
              <Text style={styles2.sendButton}>게시</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{
          backgroundColor: 'black',
          height: this.state.inputBottom
        }} />
        <KeyboardSpacer style={{backgroundColor: 'black'}} />
      </View>
    )
  }
}

const styles2 = {
  textContainer: {
    paddingLeft: 10,
    justifyContent: 'center'
  },
  sendContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButton: {
    paddingLeft: 10,
    fontSize: 14
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    fontSize: 14,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  }
}
export default CommentScreen
