// @flow
// EPISODE

import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  AppRegistry,
  TextInput,
  TouchableHighlight,
  Keyboard,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux';
import CommentList from '../Components/common/CommentList';
import { Card, CardSection, Input, Button, Spinner } from '../Components/common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Styles
import styles from './Styles/FeedScreenStyle'

const windowSize = Dimensions.get('window');
const myprops={ offset:34 }


class CommentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleHeight: 0
    };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow (e) {
    const newSize = e.endCoordinates.height
    this.setState({
      visibleHeight: newSize
    })
  }

  keyboardDidHide (e) {
    this.setState({
      visibleHeight: 0
    })
  }

  render () {
    return (
        <View style={styles.mainContainer}>

          <View style={{flex:8, backgroundColor: 'black'}}>
            <CommentList />
          </View>

          <KeyboardAwareScrollView>
            <View style={{flexDirection:'row'}}>
              <View style={styles2.textContainer}>
                <TextInput
                  placeholder="댓글 쓰기.."
                  style={styles2.input}/>
              </View>
              <View style={styles2.sendContainer}>
                <TouchableHighlight>
                  <Text style={styles2.sendButton}>게시</Text>
                </TouchableHighlight>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={{height:40}}></View>
        </View>

    )
  }
}

styles2 = {
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
export default CommentScreen;
