import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'

import { getObjectDiff } from '../Lib/Utilities'
import styles from './Styles/FeedScreenStyle'
import ExploreDetail from '../Components/ExploreDetail'

import FeedActions from '../Redux/FeedRedux'
import AccountActions from '../Redux/AccountRedux'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 57.5 + (windowSize - 220)

class ExploreScreen extends Component {

  static propTypes = {
    items: PropTypes.array.isRequired,

    requestBestFeeds: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: false,
      footer: false
    }
    this.updatedDateTime
    this.profileModifiedFlag = false
  }

  componentDidMount () {
    this.props.requestBestFeeds(null)
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))
    // TODO: 결국엔 스테이트를 false로 바꾸는 것이므로 통일하기.
    if (nextProps.items.length !== 0) {
      console.log(nextProps.items[nextProps.items.length - 1].episode)
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        console.log('업데이티드')
        console.log(nextProps.items[nextProps.items.length - 1].episode.updatedDateTime)
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        console.log('크리에이트')
        console.log(nextProps.items[nextProps.items.length - 1].episode.createDateTime)
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }

    if ((this.props.followPosting === true && nextProps.followPosting === false) ||
        (this.props.followDeleting === true && nextProps.followDeleting === false)) {
      this.props.requestBestFeeds(null)
    }

    this.setState({data: nextProps.items})

    // if (nextProps.beforeScreen === 'searchTab') {
    //   if (nextProps.beforeScreen !== nextProps.pastScreen) {
    //     this._listRef.scrollToIndex({index: 0})
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
  //   if (_.isEqual(this.props.items, nextProps.items)) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          keyExtractor={(item, index) => index}
          style={{ flex: 1, backgroundColor: 'rgb(241, 241, 241)' }}
          ref={this._captureRef}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          renderItem={this._renderItemComponent}
          disableVirtualization={false}
          horizontal={false}
          data={this.state.data}
          key={'vf'}
          legacyImplementation={false}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          // onViewableItemsChanged={this._onViewableItemsChanged}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0}
          shouldItemUpdate={this._shouldItemUpdate.bind(this)} />
        <View style={{height: 60}} />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

  _renderItemComponent = (noti) => {
    const length = noti.item.episode.contents.length
    const index = noti.index

    return (
      <ExploreDetail
        key={noti.item.episode.id}
        length={length}
        number={index}
        following={noti.item.following}
        episode={noti.item.episode}
        account={noti.item.account}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow} />
    )
  }

  _renderHeader = () => {
    return (
      <View style={{height: 10, backgroundColor: 'rgb(241, 241, 241)'}} />
    )
  }

  _renderFooter = () => {
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

  _shouldItemUpdate (prev, next) {
    if (this.profileModifiedFlag) {
      this.profileModifiedFlag = false
      return true
    }
    return prev.item !== next.item
  }

  _onRefresh = () => {
    this.setState({refreshing: true})
    this.props.requestBestFeeds(null)
  }

  _onEndReached = () => {
    console.log('onEndReached fired')
    const updatedDateTime = this.updatedDateTime
    this.setState({footer: true})

    this.props.requestMoreBestFeeds(null, null, updatedDateTime)
  }
}

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    items: state.feed.bestFeeds,

    followPosting: state.account.followPosting,
    followDeleting: state.account.followDeleting

    // trigger: state.screen.trigger,
    // beforeScreen: state.screen.beforeScreen,
    // pastScreen: state.screen.pastScreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestBestFeeds: (token) => dispatch(FeedActions.bestFeedsRequest(token)),
    requestMoreBestFeeds: (token, id, before) => dispatch(FeedActions.moreBestFeedsRequest(token, id, before)),

    postFollow: (token, id) => dispatch(AccountActions.followPost(token, id)),
    deleteFollow: (token, id) => dispatch(AccountActions.followDelete(token, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
