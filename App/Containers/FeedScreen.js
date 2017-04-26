// TODO
// 1) 탭버튼 클릭시 초기화 되는 문제해결
// DONE
// 1) S2리팩에서 디바이스에 따라 유동적이게 바꾸기

import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import { getAccountId } from '../Services/Auth'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'

import styles from './Styles/FeedScreenStyle'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class FeedScreen extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,

    contentId: PropTypes.number,
    episodeId: PropTypes.number,

    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    requestUserEpisodes: PropTypes.func,
    requestMoreFeeds: PropTypes.func,
    requestNewEpisode: PropTypes.func,

    getComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      footer: false,
      commentModalVisible: false
    }
    this.updatedDateTime
    this.profileModifiedFlag = false
    this.viewableItemsArray = []
    this.episodeRefs = {}
  }

  componentDidMount () {
    const accountId = getAccountId()
    const withFollowing = true

    this.props.requestUserEpisodes(null, accountId, withFollowing)
  }

  componentWillReceiveProps (nextProps, nextState) {
    console.log('componentWillReceiveProps in FeedScreen')
    console.log(getObjectDiff(this.props, nextProps))

    if (nextProps.items.length !== 0) {
      this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
    }

    // if (nextProps.beforeScreen === 'homeTab') {
    //   console.log('홈탭클릭1')
    //   if (nextProps.beforeScreen === nextProps.pastScreen) {
    //     if (this.props.items.length === 0) {
    //     } else {
    //       console.log('홈탭클릭2')
    //       this._listRef.scrollToIndex({index: 0})
    //     }
    //   }
    // }

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.profileModified !== nextProps.profileModified) {
  //     this.profileModifiedFlag = true
  //     return true
  //   }
  //   if (_.isEqual(this.props.items, nextProps.items) &&
  //       !getObjectDiff(this.props, nextProps).includes('newEpisodeRequesting')) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          windowSize={7}
          style={{flex: 1}}
          renderItem={this._renderItemComponent}
          FooterComponent={this._renderFooterComponent}
          data={this.props.items} // state로 받아서 concat하기
          disableVirtualization={false}
          getItemLayout={this._getItemLayout}
          key={'vf'}
          keyExtractor={(item, index) => index}
          horizontal={false}
          legacyImplementation={false}
          onRefresh={this._onRefresh}
          // onViewableItemsChanged={this._onViewableItemsChanged}
          ref={this._captureRef}
          refreshing={this.state.refreshing}
          shouldItemUpdate={this._shouldItemUpdate}
          scrollsToTop
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0} />
        <View style={{height: 60}} />
        <CommentModalContainer
          commentModalVisible={this.state.commentModalVisible}
          commentModalHandler={this._toggleCommentModal}
          screen={'FeedScreen'} />
      </View>
    )
  }

/* FlatList helper method */
  _captureRef = (ref) => { this._listRef = ref } //

  _renderItemComponent = ({item, index}) => {
   /* DONE
    * EpisodeDetail컴포넌트의 PureComponent화를 통한 리렌더링 최소화
    * shouldItemUpdate옵션은 deprecated될 예정
    */
    return (
      <EpisodeDetail
        index={index}
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        parentHandler={this}
        episode={item.episode}
        account={item.account}
        commentModalHandler={this._toggleCommentModal}
        requestNewEpisode={this.props.requestNewEpisode}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderFooterComponent = () => { //
    if (this.state.footer) {
      return (
        <View>
          <ActivityIndicator
            color='white'
            style={{marginBottom: 50}}
            size='large' />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

/* 0.44에서 derpecated될 예정 */
  _shouldItemUpdate = (prev, next) => {
    if (this.profileModifiedFlag) {
      this.profileModifiedFlag = false
      return true
    }
    return prev.item !== next.item
  }

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }) => {
    const viewableItemsArray = []
    const episodeRefsArray = Object.keys(this.episodeRefs).map(Number)

    for (let i = 0; i < info.viewableItems.length; i++) {
      viewableItemsArray.push(info.viewableItems[i].index)
    }
    // 보이는 아이템들 어레이
    this.viewableItemsArray = viewableItemsArray
    // 보이지않는 아이템들 어레이
    const inViewableItemsArray = getArrayDiff(episodeRefsArray, viewableItemsArray)

    for (let i in inViewableItemsArray) {
      const index = inViewableItemsArray[i]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].stopEpisodeVideo()
      }
    }
    // 뷰어블한 아이템이 3개이면 중간 아이템만 play
    if (viewableItemsArray.length === 3) {
      if (this.episodeRefs[viewableItemsArray[0]] !== null) {
        this.episodeRefs[viewableItemsArray[0]].stopEpisodeVideo()
      }
      if (this.episodeRefs[viewableItemsArray[2]] !== null) {
        this.episodeRefs[viewableItemsArray[2]].stopEpisodeVideo()
      }
    } else {
      for (let j in viewableItemsArray) {
        const index = viewableItemsArray[j]
        if (this.episodeRefs[index] !== null) {
          this.episodeRefs[index].playEpisodeVideo()
        }
      }
    }
  }

  _toggleCommentModal = () => {
    this.setState({
      commentModalVisible: !this.state.commentModalVisible
    })
  }

  _onRefresh = () => {
    const accountId = getAccountId()
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(null, accountId, withFollowing)
  }

  _onEndReached = () => {
    const accountId = getAccountId()
    const withFollowing = true
    const updatedDateTime = this.updatedDateTime

    this.setState({footer: true})
    this.props.requestMoreFeeds(null, accountId, withFollowing, updatedDateTime)
  }
}

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    newEpisodeRequesting: state.episode.newEpisodeRequesting,
    items: state.episode.episodes
    // trigger: state.screen.trigger,
    // beforeScreen: state.screen.beforeScreen,
    // pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeRequest(token, episodeId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),
    requestMoreFeeds: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreFeedsRequest(token, accountId, withFollowing, before)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
