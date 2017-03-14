import React, { Component, PropTypes } from 'react'
import {
  View,
  // ScrollView,
  // RefreshControl,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

// import ExploreList from '../Components/ExploreList'
import ExploreDetail from '../Components/ExploreDetail'
import styles from './Styles/FeedScreenStyle'
import { getObjectDiff } from '../Lib/Utilities'
import FlatListE from '../Experimental/FlatList_e'

import FeedActions from '../Redux/FeedRedux'
import AccountActions from '../Redux/AccountRedux'

const ITEM_HEIGHT = 233.5

class ExploreScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    items: PropTypes.array.isRequired,

    requestBestFeeds: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      footer: false
    }
    this.before
  }

  componentDidMount () {
    const { token } = this.props

    this.props.requestBestFeeds(token)
    // this.autoRefresher = setInterval(() => {
    //   this.props.requestBestFeeds(token)
    // }, 60000)
  }

  componentWillUnmount () {
    // clearInterval(this.autoRefresher)
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))
    // TODO: 결국엔 스테이트를 false로 바꾸는 것이므로 통일하기.
    const { token } = this.props

    if (nextProps.items.length !== 0) {
      this.before = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
    }

    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
    }

    if ((this.props.followPosting === true && nextProps.followPosting === false) ||
        (this.props.followDeleting === true && nextProps.followDeleting === false)) {
      this.props.requestBestFeeds(token)
    }

    if (nextProps.beforeScreen === 'searchTab') {
      if (nextProps.beforeScreen === nextProps.pastScreen) {
        this._listRef.scrollToIndex({index: 0})
      }
    }

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log(this.props.items !== nextProps.items)
    return this.props.items !== nextProps.items
  }

  _onRefresh () {
    const { token } = this.props

    this.setState({refreshing: true})
    this.props.requestBestFeeds(token)
  }

  _onEndReached () {
    console.log('onEndReached fired')
    this.setState({footer: true})
    if (this.props.items.length !== 0) {
      this.before = this.props.items[this.props.items.length - 1].episode.updatedDateTime
    }

    const { token, id } = this.props
    const before = this.before

    this.props.requestMoreBestFeeds(token, id, before)
  }

  render () {
    console.log('데이터길이: ' + this.props.items.length)
    return (
      <View style={styles.mainContainer}>
        <FlatListE
          keyExtractor={(item, index) => index}
          style={{ flex: 1, backgroundColor: 'rgb(241, 241, 241)' }}
          ref={this._captureRef}
          HeaderComponent={this._renderHeader.bind(this)}
          FooterComponent={this._renderFooter.bind(this)}
          ItemComponent={this._renderItemComponent.bind(this)}
          disableVirtualization={false}
          horizontal={false}
          data={this.props.items}
          key={'vf'}
          legacyImplementation={false}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          // onViewableItemsChanged={this._onViewableItemsChanged}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0}
          shouldItemUpdate={this._shouldItemUpdate} />
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
    console.log(index)

    return (
      <ExploreDetail
        key={noti.item.episode.id}
        length={length}
        number={index}
        token={this.props.token}
        following={noti.item.following}
        episode={noti.item.episode}
        account={noti.item.account}
        postFollow={this.props.postFollow}
        deleteFollow={this.props.deleteFollow} />
    )
  }

  _renderHeader () {
    return (
      <View style={{height: 10, backgroundColor: 'rgb(241, 241, 241)'}} />
    )
  }

  _renderFooter () {
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
    return prev.item !== next.item
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    items: state.feed.bestFeeds,

    followPosting: state.account.followPosting,
    followDeleting: state.account.followDeleting,

    trigger: state.screen.trigger,
    beforeScreen: state.screen.beforeScreen,
    pastScreen: state.screen.pastScreen
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

/*
  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: 'black', flex: 1}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />}
          >
            <ExploreList
              token={this.props.token}
              items={this.props.items}
              requestBestFeeds={this.props.requestBestFeeds}
              postFollow={this.props.postFollow}
              deleteFollow={this.props.deleteFollow} />
          </ScrollView>
          <View style={{height: 48.5}} />
        </View>
      </View>
    )
  }
*/
