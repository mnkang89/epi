import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator,
  ListView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text
  // Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  getItemLayout
} from '../Experimental/ListExampleShared_e'
import FlatListE from '../Experimental/FlatList_e'

import { getAccountId } from '../Services/Auth'

import styles from './Styles/FeedScreenStyle'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

// const windowSize = Dimensions.get('window')
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
    this.state = {
      refreshing: false,
      footer: false,
      before: null,

      data: [],
      init: true
    }
    this.episodeRefs = {}
    this.viewableItemsArray = []
  }

  componentWillMount () {
    // const { token, accountId } = { token: '$2a$10$ii4p8jv8XDsAT4i4/TbnlOoNLcXpXvmmQ8koDKSfy2PJVsCe1IgEu', accountId: 1 }
    // const { token, accountId } = this.props
    const token = null
    const withFollowing = true
    const accountId = getAccountId()

    this.props.resetCommentModal()
    this.props.requestUserEpisodes(token, accountId, withFollowing)
    this.props.requestUserEpisodesWithFalse(token, accountId, false)
  }

  componentDidMount () {
    // const { token, accountId } = this.props
    const token = null
    const accountId = getAccountId()

    this.props.requestInfo(token, accountId)
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))

    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      if (this.state.init && this.props.items.length !== 0) {
        this.setState({
          data: this.props.items,
          init: false
        })
      }
    } else {
      console.log('아이템다름')
    }

    if (this.state.refreshing) {
      console.log('리프레시인 피드1')
      this.setState({
        // data: this.props.items,
        refreshing: false
      })
    }

    if (this.state.footer) {
      console.log('리프레시인 피드2')
      // deprecated되어 redux스토어를 업데이트 하는 방식으로 변경할 예정
      this.setState({
        footer: false
        // data: this.state.data.concat(nextProps.items)
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log(this.props.items !== nextProps.items)
    return this.props.items !== nextProps.items
  }

  _onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  _onEndReached () {
    console.log('onEndReached fired')
    this.setState({footer: true})
    const { token, accountId } = this.props
    // const { before } = this.state
    const withFollowing = true

    this.props.requestUserEpisodes(token, accountId, withFollowing)
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
                onRefresh={this._onRefresh.bind(this)} />
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
            enableEmptySections={false}
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
                onRefresh={this._onRefresh.bind(this)} />
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

// this.props.items
  render () {
    console.log('데이터길이: ' + this.props.items.length)
    return (
      <View style={styles.mainContainer}>
        <FlatListE
          keyExtractor={(item, index) => index}
          style={{ flex: 1 }}
          ref={this._captureRef}
          FooterComponent={this._renderFooter.bind(this)}
          ItemComponent={this._renderItemComponent.bind(this)}
          disableVirtualization={false}
          getItemLayout={undefined}
          horizontal={false}
          data={this.props.items}
          key={'vf'}
          legacyImplementation={false}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onViewableItemsChanged={this._onViewableItemsChanged}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0}
          shouldItemUpdate={this._shouldItemUpdate} />
        <View style={{height: 48.5}} />
        <CommentModalContainer screen={'FeedScreen'} token={this.props.token} />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
  }

  _renderItemComponent = (episode) => {
    const index = episode.index

    return (
      <EpisodeDetail
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        token={this.props.token}
        key={index}
        index={index}
        parentHandler={this}
        episode={episode.item.episode}
        account={episode.item.account}
        // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
        requestNewEpisode={this.props.requestNewEpisode} />
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
    // console.log(prev)
    // console.log(next)
    // console.log(prev.item !== next.item)
    // console.log(getObjectDiff(prev.item, next.item))
    return prev.item !== next.item
  }

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }
  ) => {
    /* info오브젝트에서 뷰어블인 에피소드의 인덱스 추출하고 해당 에피소드를 제외한 에피소드는 모두 stopEpisodeVideo()호출 */

    const viewableItemsArray = []
    const episodeRefsArray = Object.keys(this.episodeRefs).map(Number)

    for (let i = 0; i < info.viewableItems.length; i++) {
      viewableItemsArray.push(info.viewableItems[i].index)
    }

    this.viewableItemsArray = viewableItemsArray

    const inViewableItemsArray = getArrayDiff(episodeRefsArray, viewableItemsArray)

    for (let i in inViewableItemsArray) {
      const index = inViewableItemsArray[i]

      if (this.episodeRefs[index] !== null) {
        this.episodeRefs[index].stopEpisodeVideo()
      } else {
        // console.log('null인놈들')
        // console.log(index)
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
    // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeRequest(token, episodeId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),
    requestUserEpisodesWithFalse: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesWithFalseRequest(token, accountId, withFollowing)),

    resetCommentModal: () => dispatch(CommentActions.resetComment())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)

/*
*/
