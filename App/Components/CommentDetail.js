import React, { Component, PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity, Modal, Animated, PanResponder } from 'react-native'
// import CachableImage from '../Common/CachableImage'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { Colors, Images, Metrics } from '../Themes/'
import { convert2TimeDiffString } from '../Lib/Utilities'
import { getAccountId } from '../Services/Auth'

const accountId = getAccountId()

class CommentDetail extends Component {

  static propTypes = {
    token: PropTypes.string,
    episodeId: PropTypes.number,
    contentId: PropTypes.number,
    comment: PropTypes.object.isRequired,
    screen: PropTypes.string,

    resetCommentModal: PropTypes.func,
    deleteComment: PropTypes.func,
    popHandler: PropTypes.func,
    pushHandler: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      settingModal: false
    }

    this.animatedValue = new Animated.Value(-200)
    this._wrapperPanResponder = {}
  }

  componentWillMount () {
    this._wrapperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        return true
      },
      onPanResponderGrant: () => {
        this.cancelPress()
      }
    })
  }

  componentWillReceiveProps (nextProps) {
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.resetCommentModal !== this.props.resetCommentModal) {
      return false
    }
    return true
  }

  commentSetting () {
    this.setState({
      settingModal: true
    }, () => {
      Animated.timing(this.animatedValue, {
        toValue: 10,
        duration: 150
      }).start()
    })
  }

  cancelPress () {
    Animated.timing(this.animatedValue, {
      toValue: -200,
      duration: 150
    }).start()
    setTimeout(() => {
      this.setState({
        settingModal: false
      })
    }, 200)
  }

  removeCommentPress () {
    const { token, episodeId, contentId } = this.props
    const commentId = this.props.comment.id

    this.props.deleteComment(token, episodeId, contentId, commentId)

    Animated.timing(this.animatedValue, {
      toValue: -200,
      duration: 150
    }).start()
    setTimeout(() => {
      this.setState({
        settingModal: false
      })
    }, 200)
  }

  onProfilePress () {
    const accountId = this.props.comment.account.id
    this.props.resetCommentModal()

    if (this.props.screen === 'FeedScreen') {
      this.props.pushHandler()
      setTimeout(() => {
        NavigationActions.feedTouserProfileScreen({
          type: 'push',
          id: accountId,
          screen: 'FeedScreen',
          popHandler: this.props.popHandler,
          onBack: () => {
            this.props.popHandler()
            NavigationActions.pop()
          }
        })
      }, 500)
    } else if (this.props.screen === 'NotiScreen') {
      NavigationActions.notiTouserProfileScreen({
        type: 'push',
        id: accountId
      })
    } else if (this.props.screen === 'SearchScreen') {
      NavigationActions.searchTouserProfileScreen({
        type: 'push',
        id: accountId
      })
    } else if (this.props.screen === 'ProfileScreen') {
      NavigationActions.profileTouserProfileScreen({
        type: 'push',
        id: accountId
      })
    }
  }

  renderProfileImage () {
    const { profileImagePath } = this.props.comment.account
    const randomTime = new Date().getTime()
    const uri = `${profileImagePath}?random_number=${randomTime}`

    if (profileImagePath) {
      return (
        <Image
          style={styles.imageStyle}
          source={{uri: uri}} />
      )
    } else {
      return (
        <Image
          style={styles.imageStyle}
          source={Images.profileImage} />
      )
    }
  }

  renderCommentOption () {
    if (this.props.comment.account.id === accountId) {
      return (
        <TouchableOpacity
          style={{width: 20, height: 20, marginTop: 20, marginLeft: 11}}
          onPress={this.commentSetting.bind(this)} >
          <View style={{flexDirection: 'row'}}>
            <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
            <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
            <View style={{width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
          </View>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  render () {
    const { message } = this.props.comment
    const { nickname } = this.props.comment.account
    const timeDiffString = convert2TimeDiffString(this.props.comment.createDateTime)
    const {
            headerContentStyle,
            userTextStyle,
            dateTextStyle
          } = styles

    return (
      <View style={{marginLeft: 14.25, marginRight: 14.25}}>
        <View style={headerContentStyle}>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={this.onProfilePress.bind(this)} >
            {this.renderProfileImage()}
          </TouchableOpacity>
          <View style={{width: 250, marginLeft: 5, marginRight: 11}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={userTextStyle}>{nickname}</Text>
            </View>
            <View style={{flex: 2, marginTop: 3, marginBottom: 10}}>
              <Text style={{color: 'rgb(53, 53, 53)', fontSize: 15}}>{message}</Text>
              <Text style={dateTextStyle}>{timeDiffString}</Text>
            </View>
          </View>
          <View style={{marginTop: 14, marginLeft: 11}}>
            {this.renderCommentOption()}
          </View>
        </View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.settingModal}>
          <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)'}} >
            <View
              style={{flex: 82}}
              {...this._wrapperPanResponder.panHandlers} />
            <Animated.View
              style={{
                flex: 18,
                width: 355,
                marginBottom: this.animatedValue,
                alignSelf: 'center',
                backgroundColor: 'rgba(252,252,252,0.8)',
                borderRadius: 12}} >
              <TouchableOpacity onPress={this.removeCommentPress.bind(this)}>
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
                  <Text style={{fontSize: 20, color: 'rgb(254,56,36)'}}>댓글 삭제</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.cancelPress.bind(this)}>
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, color: 'rgb(0,118,255)'}}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = {
  headerContentStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: 'rgb(231, 231, 231)'
  },
  userTextStyle: {
    paddingTop: 10,
    color: 'rgb(53, 53, 53)',
    fontSize: 12.5,
    fontWeight: 'bold',
    justifyContent: 'flex-start'
  },
  dateTextStyle: {
    color: 'rgb(145, 145, 145)',
    fontSize: 9,
    paddingTop: 4
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    width: Metrics.icons.large,
    height: Metrics.icons.large,
    borderRadius: Metrics.icons.large / 2
  },
  textStyle: {
    backgroundColor: '#000000',
    flex: 1,
    height: 113
  },
  textContainerStyle: {
    color: Colors.snow,
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
}

export default CommentDetail
//
//
//
// import React, { Component, PropTypes } from 'react'
// import { Text, View, Image, TouchableOpacity, Modal, Animated, Easing } from 'react-native'
// import CachableImage from '../Common/CachableImage'
//
// import { Actions as NavigationActions } from 'react-native-router-flux'
// import { Colors, Images, Metrics } from '../Themes/'
// import { getObjectDiff, convert2TimeDiffString } from '../Lib/Utilities'
// import { getAccountId } from '../Services/Auth'
//
// const accountId = getAccountId()
//
// class CommentDetail extends Component {
//
//   static propTypes = {
//     token: PropTypes.string,
//     episodeId: PropTypes.number,
//     contentId: PropTypes.number,
//     comment: PropTypes.object.isRequired,
//     screen: PropTypes.string,
//
//     resetCommentModal: PropTypes.func,
//     deleteComment: PropTypes.func
//   }
//
//   constructor (props) {
//     super(props)
//     this.state = {
//       settingModal: false
//     }
//
//     this.animatedValue = new Animated.Value(600)
//   }
//
//   componentWillMount () {
//   }
//
//   componentWillReceiveProps (nextProps, nextState) {
//     console.log(this.state)
//     console.log(nextState)
//     // if (nextState.visible) {
//     //   const modalVisible = nextState.settingModal
//     //
//     //   this.setState({
//     //     modalVisible
//     //   }, () => {
//     //     Animated.timing(this.animatedValue, {
//     //       toValue: 0,
//     //       duration: 300,
//     //       easing: Easing.in(Easing.quad)
//     //     }).start()
//     //     setTimeout(() => {
//     //       this.setState({commentContainerRender: true})
//     //     }, 500)
//     //   })
//     // }
//   }
//
//   shouldComponentUpdate (nextProps, nextState) {
//     if (nextProps.resetCommentModal !== this.props.resetCommentModal) {
//       return false
//     }
//     return true
//   }
//
//   commentSetting () {
//     this.setState({
//       settingModal: true
//     }, () => {
//       Animated.timing(this.animatedValue, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.in(Easing.quad)
//       }).start()
//     })
//   }
//
//   cancelPress () {
//     this.setState({
//       settingModal: false
//     })
//   }
//
//   removeCommentPress () {
//     const { token, episodeId, contentId } = this.props
//     const commentId = this.props.comment.id
//
//     this.props.deleteComment(token, episodeId, contentId, commentId)
//
//     this.setState({
//       settingModal: false
//     }, () => {
//       Animated.timing(this.animatedValue, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.in(Easing.quad)
//       }).start()
//     })
//   }
//
//   onProfilePress () {
//     const accountId = this.props.comment.account.id
//     this.props.resetCommentModal()
//
//     console.log('코멘트 프로필 클릭')
//
//     if (this.props.screen === 'FeedScreen') {
//       NavigationActions.feedTouserProfileScreen({
//         type: 'push',
//         id: accountId
//       })
//     } else if (this.props.screen === 'NotiScreen') {
//       NavigationActions.notiTouserProfileScreen({
//         type: 'push',
//         id: accountId
//       })
//     } else if (this.props.screen === 'SearchScreen') {
//       NavigationActions.searchTouserProfileScreen({
//         type: 'push',
//         id: accountId
//       })
//     } else if (this.props.screen === 'ProfileScreen') {
//       NavigationActions.profileTouserProfileScreen({
//         type: 'push',
//         id: accountId
//       })
//     }
//   }
//
//   renderProfileImage () {
//     const { profileImagePath } = this.props.comment.account
//     if (profileImagePath) {
//       return (
//         <CachableImage
//           style={styles.imageStyle}
//           source={{uri: profileImagePath}} />
//       )
//     } else {
//       return (
//         <Image
//           style={styles.imageStyle}
//           source={Images.profileImage} />
//       )
//     }
//   }
//
//   renderCommentOption () {
//     if (this.props.comment.account.id === accountId) {
//       return (
//         <TouchableOpacity
//           style={{width: 20, height: 20, marginTop: 20, marginLeft: 11}}
//           onPress={this.commentSetting.bind(this)} >
//           <View style={{flexDirection: 'row'}}>
//             <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
//             <View style={{marginRight: 3, width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
//             <View style={{width: 3, height: 3, backgroundColor: 'rgb(198,198,198)'}} />
//           </View>
//         </TouchableOpacity>
//       )
//     } else {
//       return null
//     }
//   }
//
//   render () {
//     const { message } = this.props.comment
//     const { nickname } = this.props.comment.account
//     const timeDiffString = convert2TimeDiffString(this.props.comment.createDateTime)
//     const {
//             headerContentStyle,
//             userTextStyle,
//             dateTextStyle
//           } = styles
//
//     return (
//       <View style={{marginLeft: 14.25, marginRight: 14.25}}>
//         <View style={headerContentStyle}>
//           <TouchableOpacity
//             style={{alignItems: 'center', justifyContent: 'center'}}
//             onPress={this.onProfilePress.bind(this)} >
//             {this.renderProfileImage()}
//           </TouchableOpacity>
//           <View style={{width: 250, marginLeft: 5, marginRight: 11}}>
//             <View style={{flex: 1, flexDirection: 'row'}}>
//               <Text style={userTextStyle}>{nickname}</Text>
//             </View>
//             <View style={{flex: 2, marginTop: 3, marginBottom: 10}}>
//               <Text style={{color: 'rgb(53, 53, 53)', fontSize: 15}}>{message}</Text>
//               <Text style={dateTextStyle}>{timeDiffString}</Text>
//             </View>
//           </View>
//           <View style={{marginTop: 14, marginLeft: 11}}>
//             {this.renderCommentOption()}
//           </View>
//         </View>
//         <Modal
//           animationType={'fade'}
//           transparent
//           visible={this.state.settingModal}>
//           <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
//             {/* <Animated.View style={{transform: [{translateY: this.animatedValue}]}}> */}
//               <View>
//                 <TouchableOpacity onPress={this.removeCommentPress.bind(this)}>
//                   <View style={{height: 60, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
//                     <Text style={{fontSize: 20, color: 'rgb(254,56,36)'}}>댓글 삭제</Text>
//                   </View>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.cancelPress.bind(this)}>
//                   <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
//                     <Text style={{fontSize: 20, color: 'rgb(0,118,255)'}}>Cancel</Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             {/* </Animated.View> */}
//           </View>
//         </Modal>
//       </View>
//     )
//   }
// }
//
// const styles = {
//   headerContentStyle: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderBottomWidth: 0.5,
//     borderColor: 'rgb(231, 231, 231)'
//   },
//   userTextStyle: {
//     paddingTop: 10,
//     color: 'rgb(53, 53, 53)',
//     fontSize: 12.5,
//     fontWeight: 'bold',
//     justifyContent: 'flex-start'
//   },
//   dateTextStyle: {
//     color: 'rgb(145, 145, 145)',
//     fontSize: 9,
//     paddingTop: 4
//   },
//   thumbnailStyle: {
//     height: 50,
//     width: 50
//   },
//   thumbnailContainerStyle: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10,
//     marginRight: 10
//   },
//   imageStyle: {
//     width: Metrics.icons.large,
//     height: Metrics.icons.large,
//     borderRadius: Metrics.icons.large / 2
//   },
//   textStyle: {
//     backgroundColor: '#000000',
//     flex: 1,
//     height: 113
//   },
//   textContainerStyle: {
//     color: Colors.snow,
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   text: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold'
//   }
// }
//
// export default CommentDetail
