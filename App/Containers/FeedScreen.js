import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  ListView,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavigationActions } from 'react-native-router-flux'

import styles from './Styles/FeedScreenStyle'
import { getObjectDiff } from '../Lib/Utilities'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')
const ITEM_SIZE = 440
const BUFFER_ITEMS = 0
const DISPLAY_ITEMS = 8

class FeedScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,

    episodesRequesting: PropTypes.bool,
    items: PropTypes.array.isRequired,

    contentId: PropTypes.number,
    episodeId: PropTypes.number,

    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    requestInfo: PropTypes.func,
    requestUserEpisodes: PropTypes.func,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func,
    postComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    let listItemHeight = ITEM_SIZE
    // Use contentOffset to calculate first visible dataItem as y-position / height of item
    // firstVisibleItem: 뷰포트에 비저블한 첫 아이템의 인덱스?
    let firstVisibleItem = 0
    let renderModelSize = BUFFER_ITEMS * 2 + DISPLAY_ITEMS
    // Calculate first y-position
    let nextPosition = (firstVisibleItem - BUFFER_ITEMS) * listItemHeight
    // Subset of dataModel to be rendered.
    let dataItems = this.props.items.slice(firstVisibleItem, firstVisibleItem + renderModelSize)
    let newRenderModel = dataItems.map((item, index) => {
      return {
        key: item.episode.id,
        item: item,
        position: nextPosition + index * listItemHeight
      }
    })
    this.state = {
      refreshing: false,
      dataModel: this.props.items,
      renderModel: newRenderModel,
      bodyHeight: 6 * 444
    }
  }

  componentDidMount () {
    const { token, accountId } = this.props

    this.props.requestInfo(token, accountId)
    this.props.resetCommentModal()
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))

    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
    }
    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }
  }

  onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  onScroll (e) {
    this.updateRenderModel(e.nativeEvent.contentOffset)
  }

  updateRenderModel (contentOffset) {
    let listItemHeight = ITEM_SIZE
    // Use contentOffset to calculate first visible dataItem as y-position / height of item
    // firstVisibleItem: 뷰포트에 비저블한 첫 아이템의 인덱스?
    let firstVisibleItem = Math.max(0, Math.floor(contentOffset.y / listItemHeight))
    let renderModelSize = BUFFER_ITEMS * 2 + DISPLAY_ITEMS
    // Calculate first y-position
    let nextPosition = (firstVisibleItem - BUFFER_ITEMS) * listItemHeight
    // Subset of dataModel to be rendered.
    let dataItems = this.state.dataModel.slice(firstVisibleItem, firstVisibleItem + renderModelSize)
    let newRenderModel = dataItems.map((item, index) => {
      return {
        key: item.episode.id,
        item: item,
        position: nextPosition + index * listItemHeight
      }
    })
    // update renderModel, as well as bodyHeight of scroll area to encompass the largest y value
    let state = {
      renderModel: newRenderModel,
      // dataModel: this.state.dataModel,
      bodyHeight: nextPosition + renderModelSize * listItemHeight
    }
    this.setState(state)
  }

  renderListView (dataSource) {
    if (this.props.episodesRequesting) {
      console.log('리퀘스팅중')
      return
    } else {
      if (dataSource._cachedRowCount === 0) {
        console.log('없음')
        return (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />
              } >
            <View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                <Text style={{fontSize: 60, fontWeight: 'bold', color: 'white'}}>안녕하세요!</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
                <Text style={{fontSize: 16, color: 'white'}}>다른 사람들의 에피소드를 구경하고</Text>
                <Text style={{fontSize: 16, color: 'white'}}>팔로우 해보세요!</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
                <TouchableOpacity onPress={NavigationActions.searchTab}>
                  <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: 'white'}}>
                    <Text style={{fontSize: 16, color: 'white'}}>에피소드 탐색</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )
      } else {
        return (
          <ListView
            removeClippedSubviews
            pageSize={1}
            enableEmptySections
            dataSource={dataSource}
            renderRow={(item) =>
              <EpisodeDetail
                key={item.episode.id}
                episode={item.episode}
                account={item.account} />
              }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />
              } />
        )
      }
    }
  }
/*
render () {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  const dataSource = ds.cloneWithRows(this.props.items.slice())

  return (
    <View style={styles.mainContainer}>
      {this.renderListView(dataSource)}
      <View style={{height: 48.5}} />
      <CommentModalContainer screen={'FeedScreen'} token={this.props.token} />
    </View>
  )
}
*/
  render () {
    var items = this.state.renderModel.map(renderItem => {
      const itemStyle = {
        position: 'absolute',
        width: windowSize.width,
        height: ITEM_SIZE,
        left: 0,
        top: renderItem.position,
        alignItems: 'center'
      }

      return (
        <View key={renderItem.key} style={itemStyle}>
          <EpisodeDetail
            key={renderItem.item.episode.id}
            episode={renderItem.item.episode}
            account={renderItem.item.account} />
        </View>
      )
    })
    return (
      <View style={styles.mainContainer}>
        <ScrollView ref='scrollView' style={{flex: 1}} scrollEventThrottle={1} onScroll={this.onScroll.bind(this)}>
          <View style={{height: this.state.bodyHeight, width: windowSize.width}}>
            {items}
          </View>
        </ScrollView>
        <View style={{height: 48.5}} />
        <CommentModalContainer screen={'FeedScreen'} token={this.props.token} />
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    episodesRequesting: state.episode.episodesRequesting,
    items: state.episode.episodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),

    resetCommentModal: () => dispatch(CommentActions.resetComment())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
