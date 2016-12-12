// @flow
// EPISODE

import React, { Component } from 'react'
import { Modal, Text, TouchableHighlight, TouchableOpacity, View, Dimensions } from 'react-native'
// import Actions from '../Actions/Creators'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Icon from 'react-native-vector-icons/FontAwesome'
import FeedList from '../Components/common/FeedList'
import CommentList from '../Components/common/CommentList'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'

const windowSize = Dimensions.get('window')
// Styles
import styles from './Styles/FeedScreenStyle'

export default class FeedScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 5,
      inputBottom: 40,
      modalVisible: false
    }
  }

  setModalVisible () {
    this.setState({modalVisible: false})
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black'}}>
          <TouchableOpacity onPress={() => { this.setState({modalVisible: true}) }}>
            <Text>ShowModal</Text>
          </TouchableOpacity>
        </View>
        <FeedList />
        <View style={{height: 50}} />
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}>
          <View style={styles2.containerStyle}>
            <View style={{backgroundColor: 'white', flex: 1, marginTop: 151, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
              <View style={{flexDirection: 'row', height: 42.5, marginRight: 4.5, marginLeft: 4.5, borderBottomWidth: 0.5, borderBottomColor: 'rgb(204, 204, 204)'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log(this.state.modalVisible)
                    this.setModalVisible()
                    console.log(this.state.modalVisible)
                  }}
                  style={{paddingTop: 10, paddingLeft: 16}}>
                  <Icon
                    name='chevron-down'
                    size={16}
                    style={{width: 16, height: 16, alignSelf: 'center', fontWeight: '300'}}
                  />
                </TouchableOpacity>
                <Text style={{left: 140, marginTop: 10, fontSize: 17, fontWeight: 'bold'}}>댓글</Text>
              </View>
              <CommentList />
              <View style={{flexDirection: 'row', backgroundColor: 'rgb(236, 236, 236)'}}>
                <View style={styles2.textContainer}>
                  <AutoGrowingTextInput style={styles2.input} placeholder={'댓글을 입력하세요...'} maxHeight={70} />
                </View>
                <View style={styles2.sendContainer}>
                  <TouchableHighlight>
                    <Text style={styles2.sendButton}>게시</Text>
                  </TouchableHighlight>
                </View>
              </View>
              <KeyboardSpacer style={{backgroundColor: 'black'}} />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles2 = {
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  },
  textContainer: {
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center'
  },
  sendContainer: {
    marginTop: 5,
    marginBottom: 5,
    width: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  sendButton: {
    fontSize: 13,
    color: 'white'
  },
  input: {
    width: windowSize.width - 60,
    paddingTop: 4,
    height: 20,
    color: '#555555',
    fontSize: 15,
    paddingLeft: 5,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  }
}

/*
const mapStateToProps = (state) => {
  return {
    // modalVisible: state.visible
    // comments: state.comments.items,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toComment: NavigationActions.comment,
    fetchComments: (articleId) => dispatch(Actions.fetchComments(articleId)),
    joinArticle: (data) => dispatch(Actions.joinArticle(data))
  }
}

*/
// export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
