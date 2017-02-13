import React, { Component, PropTypes } from 'react'
import {
  View,
  ActivityIndicator
  // Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
// import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  getItemLayout
} from '../Experimental/ListExampleShared_e'
import FlatListE from '../Experimental/FlatList_e'

import styles from './Styles/FeedScreenStyle'
import { getObjectDiff } from '../Lib/Utilities'
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
  }

  componentWillMount () {
    const { token, accountId } = { token: '$2a$10$RrUeAlbcR35gAWRcQFfQMejdRmcvMLtrE2y4BrCDSXuPv0IeRucDu', accountId: 1 }
    const withFollowing = true

    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  componentDidMount () {
    const { token, accountId } = this.props

    this.props.requestInfo(token, accountId)
    this.props.resetCommentModal()
    this.props.requestUserEpisodes(token, accountId, true)
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
      this.setState({
        data: this.props.items,
        refreshing: false
      })
    }

    if (this.state.footer) {
      this.setState({
        footer: false,
        data: this.state.data.concat(nextProps.items)
      })
    }
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
// this.props.items
  render () {
    console.log('데이터길이: ' + this.state.data.length)
    return (
      <View style={styles.mainContainer}>
        <FlatListE
          ref={this._captureRef}
          FooterComponent={this._renderFooter.bind(this)}
          ItemComponent={this._renderItemComponent}
          disableVirtualization={false}
          getItemLayout={undefined}
          horizontal={false}
          data={this.state.data}
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
          this.episodeRefs[index] = component
        }}
        key={index}
        episode={episode.item.episode}
        account={episode.item.account} />
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

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }
  ) => {
    const changedItemsArray = []
    let centerIndex = 0
    // console.log(info)
    if (info.viewableItems.length === 1) {
      centerIndex = info.viewableItems[0].index
    } else if (info.viewableItems.length === 2) {
      if (info.viewableItems[0].index === 0) {
        // 첫 2개 에피소드일 경우
        // console.log('첫 2개')
        centerIndex = info.viewableItems[0].index
      } else if (info.viewableItems[1].index === Object.keys(this.episodeRefs).length) {
        // 마지막 2개 에피소드일 경우
        // console.log('마지막 2개')
        centerIndex = info.viewableItems[1].index
      } else {
        // changedItemsArray 삽입
        // console.log('체인지드 케이스')
        for (let i = 0; i < info.changed.length; i++) {
          changedItemsArray.push(info.changed[i].index)
        }
        // console.log(changedItemsArray)
        // changedItemsArray에 없고 viewableItems에 있으면 centerIndex
        for (let i = 0; i < info.viewableItems.length; i++) {
          if (!changedItemsArray.includes(info.viewableItems[i].index)) {
            centerIndex = info.viewableItems[i].index
          }
        }
      }
    } else if (info.viewableItems.length === 3) {
      centerIndex = info.viewableItems[1].index
    }
    // console.log('centerIndex: ' + centerIndex)

    for (let i = 0; i < Object.keys(this.episodeRefs).length; i++) {
      if (
          // i === centerIndex면 중간에 온 비디오 컨텐츠이므로 stop할 필요가 없음.
          i !== centerIndex &&
          // undefined일 경우, 아직 episodeRefs오브젝트에 추가되지 않은, 즉 아직 렌더링 되지 않은 컨텐츠이다.
          // this.episodeRefs[i] !== undefined &&
          // null일 경우, flatList최적화 기능에 의해 메모리에서 내려간 컨텐츠에 해당한다.
          this.episodeRefs[i] !== null) {
        // console.log('Index: ' + i)
        this.episodeRefs[i].stopEpisodeVideo()
      }
    }
    if (this.episodeRefs[centerIndex] !== null) {
      // console.log('play')
      this.episodeRefs[centerIndex].playEpisodeVideo()
    }
  }

/*
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
                onRefresh={this.onRefresh.bind(this)} />
              } />
        )
      }
    }
  }

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
