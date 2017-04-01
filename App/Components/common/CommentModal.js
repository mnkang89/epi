import React, { Component, PropTypes } from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Keyboard,
  PanResponder
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import Icon from 'react-native-vector-icons/FontAwesome'
// import _ from 'lodash'

import CommentContainer from '../../Containers/common/CommentContainer'

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
    commentDeleting: PropTypes.bool,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func,
    postComment: PropTypes.func,
    deleteComment: PropTypes.func,

    pushHandler: PropTypes.func,
    popHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      text: '',
      height: 5,
      inputBottom: 40,
      modalVisible: false,
      commentContainerRender: false
    }

    this.message
    this.animatedValue = new Animated.Value(600)
    this._wrapperPanResponder = {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      const modalVisible = nextProps.visible
      console.log('모달비저블하게윌리시브프랍스')
      console.log(modalVisible)
      console.log('모달비저블하게윌리시브프랍스')

      this.setState({
        modalVisible
      }, () => {
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad)
        }).start()
        setTimeout(() => {
          this.setState({commentContainerRender: true})
        }, 500)
      })
    }
  }

  componentWillMount () {
    this._wrapperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        return true
      },
      onPanResponderGrant: () => {
        console.log('팬리스폰더 뷰 그랜트')
        this.resetCommentModal()
      }
    })
  }

  resetCommentModal () {
    if (this.refs.commentInput.isFocused()) {
      Keyboard.dismiss()
    }
    Animated.timing(this.animatedValue, {
      toValue: 600,
      duration: 250
    }).start()

    setTimeout(() => {
      this.setState({
        modalVisible: false,
        commentContainerRender: false
      })
      this.props.resetCommentModal()
    }, 250)
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

  renderCommentContainer () {
    if (this.state.commentContainerRender) {
      return (
        <CommentContainer
          screen={this.props.screen}
          token={this.props.token}
          popHandler={this.props.popHandler}
          pushHandler={this.props.pushHandler}
          resetCommentModal={this.resetCommentModal.bind(this)} />
      )
    } else {
      return (
        <View style={{flex: 1}} />
      )
    }
  }

  render () {
    return (
      <Modal
        style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
        animationType={'fade'}
        transparent
        visible={this.state.modalVisible} >
        <View
          ref={(ref) => { this.contentRef = ref }}
          style={styles2.containerStyle} >
          <View
            style={{flex: 1}} >
            <View
              style={{flex: 18}}
              {...this._wrapperPanResponder.panHandlers} />
            <Animated.View
              style={{transform: [{translateY: this.animatedValue}], backgroundColor: 'white', flex: 82, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
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
              {this.renderCommentContainer()}
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
            </Animated.View>
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
