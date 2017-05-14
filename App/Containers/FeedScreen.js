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
import AccountActions from '../Redux/AccountRedux'

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
      commentModalVisible: false,
      data: []
    }
    this.updatedDateTime
    this.profileModifiedFlag = false
    this.viewableItemsArray = []
    this.episodeRefs = {}
    this.hide = []
  }

  componentDidMount () {
    const accountId = getAccountId()
    const withFollowing = true

    this.props.requestUserEpisodes(null, accountId, withFollowing)
    this.props.requestInfo(null, accountId)
  }

  componentWillReceiveProps (nextProps, nextState) {
    console.log('componentWillReceiveProps in FeedScreen')
    console.log(getObjectDiff(this.props, nextProps))

    if (nextProps.items.length !== 0) {
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }
    const data = nextProps.items.filter(item => {
      return !this.hide.includes(item.episode.id)
    })

    this.setState({data: data})

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }

    if (nextProps.beforeScreen === 'feedTab') {
      if (nextProps.beforeScreen !== nextProps.pastScreen) {
        for (let i in this.viewableItemsArray) {
          const index = this.viewableItemsArray[i]
          if (index !== undefined) {
            if (this.episodeRefs[index] !== null) {
              this.episodeRefs[index].stopEpisodeVideo()
            }
          }
        }
      }
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // if (this.props.profileModified !== nextProps.profileModified) {
  //   //   this.profileModifiedFlag = true
  //   //   return true
  //   // }
  //   if (this.props.items === nextProps.items) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          removeClippedSubviews={false}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 51}}
          windowSize={3}
          style={{flex: 1}}
          renderItem={this._renderItemComponent}
          ListFooterComponent={this._renderFooterComponent}
          data={this.state.data} // state로 받아서 concat하기
          disableVirtualization={false}
          getItemLayout={undefined}
          // getItemLayout={this._getItemLayout}
          key={'vf'}
          keyExtractor={(item, index) => index}
          horizontal={false}
          legacyImplementation={false}
          onRefresh={this._onRefresh}
          onViewableItemsChanged={this._onViewableItemsChanged}
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
  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

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

  _renderFooterComponent = () => {
    if (this.state.footer) {
      return (
        <View>
          <ActivityIndicator
            color='gray'
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

    for (let j in viewableItemsArray) {
      const index = viewableItemsArray[j]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].playEpisodeVideo()
      }
    }
  }

  removeEpisodeFromData = (episode) => {
    this.hide = [...this.hide, episode.id]
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
    items: state.episode.episodes,

    // trigger: state.screen.trigger,
    beforeScreen: state.screen.beforeScreen,
    pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeRequest(token, episodeId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),
    requestMoreFeeds: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreFeedsRequest(token, accountId, withFollowing, before)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
