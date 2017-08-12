import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'

import { logGenerator } from '../Services/Logger/LogGenerator'
import { insertToLogQueue } from '../Services/Logger/LogSender'

import ExploreDetail from '../Components/ExploreDetail'
import FeedActions from '../Redux/FeedRedux'
import AccountActions from '../Redux/AccountRedux'

import { Images } from '../Themes'
import styles from './Styles/FeedScreenStyle'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 57.5 + (windowSize - 220)

class ExploreScreen extends Component {
  static navigationOptions = {
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    header: () => (
      <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 60, paddingTop: 10}}>
        <Image
          source={Images.episodeLogo}
          style={{
            width: 82,
            height: 16}} />
      </View>
    ),
    tabBarIcon: ({focused}) => {
      if (focused) {
        return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image style={{width: 23, height: 23}} source={Images.tabFind} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
              <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
            </View>
          </View>
        )
      } else {
        return (
          <Image style={{width: 23, height: 23}} source={Images.tabFind} />
        )
      }
    }
  }

  static propTypes = {
    items: PropTypes.array.isRequired,

    requestBestFeeds: PropTypes.func,
    postFollow: PropTypes.func,
    deleteFollow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      spinner: false,
      data: [],
      refreshing: false,
      footer: false
    }
    this.updatedDateTime
    this.profileModifiedFlag = false
    this.episodeRefs = {}
  }

  componentDidMount () {
    this.props.requestBestFeeds(null)
    setTimeout(() => {
      this.props.navigation.setParams({
        function: this.scrollsToTop
      })
    }, 1000)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.feedRequesting && !this.state.refreshing) {
      this.setState({spinner: false})
    } else {
      this.setState({ spinner: false })
    }

    if (nextProps.items.length !== 0) {
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }

    this.setState({data: nextProps.items})

    if (this.state.refreshing) {
      this.setState({
        refreshing: false,
        footer: false
      })
    }
  }

  scrollsToTop = () => {
    this._listRef.scrollToOffset({x: 0, y: 0})
  }

  render () {
    if (this.state.spinner) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            style={{marginTop: 20, marginBottom: 30}}
            color='gray'
            size='small' />
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <FlatList
            removeClippedSubviews={false}
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
            onViewableItemsChanged={this._onViewableItemsChanged}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0}
            shouldItemUpdate={this._shouldItemUpdate.bind(this)} />
        </View>
      )
    }
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
        index={index}
        navigation={this.props.navigation}
        key={noti.item.episode.id}
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 60}}>
          <ActivityIndicator
            color='gray'
            size='small' />
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

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }) => {
    // Logging
    if (info.changed.length !== 0) {
      for (let changed in info.changed) {
        if (info.changed[changed].isViewable) {
          const viewableIndex = info.changed[changed].index
          const logBundle = logGenerator(this.episodeRefs, viewableIndex, 'explore', 'Impression')

          for (let logIndex in logBundle) {
            const log = logBundle[logIndex]

            console.log(log)
            insertToLogQueue(log)
          }
        }
      }
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.props.requestBestFeeds(null)
    })
  }

  _onEndReached = () => {
    const updatedDateTime = this.updatedDateTime

    this.setState({footer: true})
    this.props.requestMoreBestFeeds(null, null, updatedDateTime)
  }
}

const mapStateToProps = (state) => {
  return {
    feedRequesting: state.feed.bestFeedsRequesting,

    items: state.feed.bestFeeds,

    followPosting: state.account.followPosting,
    followDeleting: state.account.followDeleting
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
