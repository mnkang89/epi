import React, { Component, PropTypes } from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import CommentList from '../CommentList'

const windowSize = Dimensions.get('window')

class CommentModal extends Component {

  static propTypes = {
    token: PropTypes.string,
    screen: PropTypes.string,
    contentId: PropTypes.number,
    episodeId: PropTypes.number,

    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func,
    postComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 5,
      inputBottom: 40,
      modalVisible: false
    }
  }

  componentDidMount () {
    // this.props.resetCommentModal()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      if (nextProps.commentPosting) {
        console.log('아직 코멘트 포스팅중')
        return
      } else if (
        this.props.commentPosting === true &&
        nextProps.commentPosting === false) {
        console.log('코멘트 포스팅 끝')
      } else if (!_.isEqual(this.props.comments, nextProps.comments)) {
        console.log('코멘트 포스팅 후 새로고침')
      } else {
        console.log('코멘트 첫 진입')
        const modalVisible = nextProps.visible

        this.setState({
          modalVisible
        })
      }
    }
  }
/*
shouldComponentUpdate (nextProps, nextState) {
  if (nextState.message !== this.state.message) {
    console.log('메세지값 변경')
    return false
  }
  return true
}
*/

  resetCommentModal () {
    this.setState({modalVisible: false})

    setTimeout(() => {
      this.props.resetCommentModal()
    }, 500)
  }

  handleChangeMessage = (text) => {
    this.message = text
  }

  onCommentButtonPress () {
    const { token, episodeId, contentId } = this.props
    const message = this.message

    if (message !== '') {
      this.message = ''
      this.refs.commentInput.clear()

      this.props.postComment(token, episodeId, contentId, message)
    } else {
      this.message = ''
      this.refs.commentInput.clear()
    }
  }

  render () {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.state.modalVisible}>
        <View style={styles2.containerStyle}>
          <View style={{backgroundColor: 'white', flex: 1, marginTop: 151, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
            <View style={{flexDirection: 'row', height: 42.5, marginRight: 4.5, marginLeft: 4.5, borderBottomWidth: 0.5, borderBottomColor: 'rgb(204, 204, 204)'}}>
              <TouchableOpacity
                onPress={() => {
                  this.resetCommentModal()
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
            <CommentList
              screen={this.props.screen}
              token={this.props.token}
              comments={this.props.comments}
              episodeId={this.props.episodeId}
              contentId={this.props.contentId}
              resetCommentModal={this.resetCommentModal.bind(this)}
              getComment={this.props.getComment} />
            <View style={{flexDirection: 'row', backgroundColor: 'rgb(236, 236, 236)'}}>
              <View style={styles2.textContainer}>
                <AutoGrowingTextInput
                  ref='commentInput'
                  style={styles2.input}
                  placeholder={'댓글을 입력하세요...'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={this.handleChangeMessage.bind(this)}
                  maxHeight={70} />
              </View>
              <View>
                <TouchableOpacity
                  style={styles2.sendContainer}
                  onPress={this.onCommentButtonPress.bind(this)}>
                  <Text style={styles2.sendButton}>게시</Text>
                </TouchableOpacity>
              </View>
            </View>
            <KeyboardSpacer style={{backgroundColor: 'black'}} />
          </View>
        </View>
      </Modal>
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
    height: 35,
    width: 43,
    marginTop: 4,
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

export default CommentModal
