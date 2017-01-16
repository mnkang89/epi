// @flow
// EPISODE

import React, { Component } from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import FeedList from '../Components/FeedList'
import CommentList from '../Components/CommentList'
import styles from './Styles/FeedScreenStyle'

import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')

class FeedScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 5,
      inputBottom: 40,
      modalVisible: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.resetCommentModal()
  }

  componentWillReceiveProps (nextProps) {
    console.log('* --- componentWillReceiveProps --- *')
    console.log(this.props)
    console.log(nextProps)

    if (nextProps.visible) {
      // TODO: comment쪽에 두어도 좋지 않을지? 고민해보기.
      // const { token } = this.props
      // const { episodeId } = nextProps
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

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.message !== this.state.message) {
      console.log('메세지값 변경')
      return false
    }
    return true
  }

  resetCommentModal () {
    console.log('modalVisible리프레쉬')
    this.setState({modalVisible: false})
    setTimeout(() => {
      this.props.resetCommentModal()
    }, 500)
  }

  handleChangeMessage = (text) => {
    this.setState({ message: text })
  }

  onCommentButtonPress () {
    const { token, episodeId, contentId } = this.props
    const message = this.state.message
    this.setState({message: ''})
    this.refs.commentInput.clear()

    this.props.postComment(token, episodeId, contentId, message)
  }

  render () {
    return (
      <View style={styles.mainContainer}>
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
              <CommentList comments={this.props.comments} />
              <View style={{flexDirection: 'row', backgroundColor: 'rgb(236, 236, 236)'}}>
                <View style={styles2.textContainer}>
                  <AutoGrowingTextInput
                    ref='commentInput'
                    style={styles2.input}
                    placeholder={'댓글을 입력하세요...'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={this.handleChangeMessage}
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

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    visible: state.comment.visible,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message)),
    getComment: (token, episodeId) => dispatch(CommentActions.commentGet(token, episodeId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
