import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  // FlatList,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { getAccountId, getToken } from '../Services/Auth'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'
import FlatListE from '../Experimental/FlatList0.44/FlatList_E44'
import PushConfig from '../Config/PushConfig'

import styles from './Styles/FeedScreenStyle'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'
import AccountActions from '../Redux/AccountRedux'
import { Images } from '../Themes'
import { getRealm } from '../Services/RealmFactory'

import _ from 'lodash'

const windowSize = Dimensions.get('window')
const realm = getRealm()
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class FeedScreen extends Component {
  static navigationOptions = ({ ...props, navigation, screenProps }) => {
    return ({
      header: () => (
        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 60, paddingTop: 10}}>
          <Image source={Images.episodeLogo} style={{width: 82, height: 16}} />
        </View>
      ),
      // tabBarOnPress: (scene, jumpToIndex) => {
      //   if (scene.focused) {
      //     if (navigation.state.params === undefined) {
      //       return
      //     } else {
      //       navigation.state.params.function()
      //     }
      //   } else {
      //     jumpToIndex(scene.index)
      //   }
      // },
      tabBarIcon: ({focused}) => {
        if (focused) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 22, height: 23}} source={Images.tabHome} />
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
              </View>
            </View>
          )
        } else {
          return (
            <Image style={{width: 22, height: 23}} source={Images.tabHome} />
          )
        }
      }
    })
  }
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
      data: [],
      stopOnEndReached: false
    }

    this.updatedDateTime
    this.beforeUpdatedDateTime
    this.profileModifiedFlag = false
    this.viewableItemsArray = []
    this.episodeRefs = {}
    this.hide = []
  }

  componentWillMount () {
    // this.props.navigation.setParams({
    //   function: this.scrollsToTop
    // })
  }

  componentDidMount () {
    setTimeout(() => {
      PushConfig()
    }, 1000)

    const accountId = getAccountId()
    const withFollowing = true

    this.props.requestUserEpisodes(null, accountId, withFollowing)
    // this.props.requestUserEpisodesTest(null, accountId, withFollowing)
    this.props.requestInfo(null, accountId)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.episodesRequesting && !this.state.refreshing) {
      this.setState({spinner: true})
    } else {
      if (nextProps.items.length === 0) {
        this.setState({
          nothing: true,
          spinner: false
        })
      } else {
        this.setState({
          nothing: false,
          spinner: false
        })
      }
    }
/* 새로들어오는 props의 아이템과 기존 props의 아이템을 비교하여 업데이트 시간을 저장함 */
    if (nextProps.items.length !== 0 &&
        getObjectDiff(this.props, nextProps).includes('items')) {
      if (nextProps.items[nextProps.items.length - 1].episode.updatedDateTime !== undefined) {
        this.beforeUpdatedDateTime = this.updatedDateTime
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.updatedDateTime
      } else {
        this.beforeUpdatedDateTime = this.updatedDateTime
        this.updatedDateTime = nextProps.items[nextProps.items.length - 1].episode.createDateTime
      }
    }
/*
  TODO: 서버단에서 피드의 끝임을 알려주는 플래그데이터가 포함되서 오면 더욱 좋아보임.
  더 이상 업데이트할 것이 없을때는 기존 props의 아이템과 newProps의 아이템이 동일하므로 getObjectDiff의 결과는 아무것도 없는 어레이가 됨
*/
    if (getObjectDiff(this.props, nextProps).length === 0) {
      this.beforeUpdatedDateTime = this.updatedDateTime
    }

    if (this.beforeUpdatedDateTime !== undefined &&
        this.updatedDateTime !== undefined) {
      if (this.beforeUpdatedDateTime === this.updatedDateTime) {
        this.setState({
          stopOnEndReached: true,
          footer: false
        })
      }
    }

    const data = nextProps.items.filter(item => {
      return !this.hide.includes(item.episode.id)
    })
    this.setState({
      data: data
    })

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

  scrollsToTop = () => {
    this._listRef.scrollToOffset({x: 0, y: 0})
  }

  render () {
    if (this.state.spinner) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color='gray'
            size='small' />
        </View>
      )
    } else if (this.state.nothing) {
      return (
        <View style={styles.mainContainer}>
          <View style={{height: 1}} />
          <ScrollView
            style={{flex: 1, backgroundColor: 'white'}}
            refreshControl={
              <RefreshControl
                colors={['#ff0000', '#00ff00', '#0000ff']}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh} />
              } >
            <View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                <Text style={{fontSize: 60, fontWeight: 'bold', color: 'gray'}}>안녕하세요!</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
                <Text style={{fontSize: 16, color: 'gray'}}>다른 사람들의 에피소드를 구경하고</Text>
                <Text style={{fontSize: 16, color: 'gray'}}>팔로우 해보세요!</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Explore') }}>
                  <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: 'gray'}}>
                    <Text style={{fontSize: 16, color: 'gray'}}>에피소드 탐색</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <View style={{height: 1}} />
          <FlatListE
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
            // shouldItemUpdate={this._shouldItemUpdate}
            scrollsToTop
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0} />
          {/* <View style={{height: 60}} /> */}
          <CommentModalContainer
            navigation={this.props.navigation}
            commentModalVisible={this.state.commentModalVisible}
            commentModalHandler={this._toggleCommentModal}
            screen={'FeedScreen'} />
        </View>
      )
    }
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
    // const contentTypeArray = []
    //
    // for (let i = 0; i < item.episode.contents.length; i++) {
    //   contentTypeArray.push(item.episode.contents[i].type)
    // }
    let episode = realm.objects('episode').filtered('id = ' + item.episode.id)
    let xPosition = 0

    if (episode[0] === undefined) {
      xPosition = 0
    } else {
      xPosition = episode[0].offset
    }
    const currentCenterIndex = xPosition / (windowSize.width - 22) // 여기서도 문제 생길 수 있음(x)

    return (
      <EpisodeDetail
        navigation={this.props.navigation}
        index={index}
        currentCenterIndex={currentCenterIndex}
        ref={(ref) => { this.episodeRefs[index] = ref }}
        parentHandler={this}
        episode={item.episode}
        account={item.account}
        // contentTypeArray={contentTypeArray}
        commentModalHandler={this._toggleCommentModal}
        reportEpisode={this.props.reportEpisode}
        removeEpisode={this.props.removeEpisode}
        requestNewEpisode={this.props.requestNewEpisode}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _renderFooterComponent = () => {
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

/* 0.44에서 derpecated될 예정 */
  _shouldItemUpdate = (prev, next) => {
    // if (this.profileModifiedFlag) {
    //   this.profileModifiedFlag = false
    //   return true
    // }
    // return prev.item !== next.item
    // return true
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

    this.episodeRefs = {}
    this.setState({refreshing: true}, () => {
      this.props.requestUserEpisodes(null, accountId, withFollowing)
    })
  }

  _onEndReached = () => {
    const accountId = getAccountId()
    const withFollowing = true
    const updatedDateTime = this.updatedDateTime

    this.setState({footer: true})
    this.props.requestMoreFeeds(null, accountId, withFollowing, updatedDateTime)
    // if (this.state.stopOnEndReached) {
    //   return
    // } else {
    //   const accountId = getAccountId()
    //   const withFollowing = true
    //   const updatedDateTime = this.updatedDateTime
    //
    //   this.setState({footer: true})
    //   this.props.requestMoreFeeds(null, accountId, withFollowing, updatedDateTime)
    // }
  }
}

const mapStateToProps = (state) => {
  return {
    profileModified: state.signup.modified,

    episodesRequesting: state.episode.episodesRequesting,
    newEpisodeRequesting: state.episode.newEpisodeRequesting,
    items: state.episode.episodes,

    // trigger: state.screen.trigger,
    beforeScreen: state.screen.beforeScreen,
    pastScreen: state.screen.pastScreen,
    feedTrigger: state.screen.feedTrigger
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // EpisodeDetailContainer만들고 그쪽에서 넘겨주는 로직으로 변경할 예정
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestNewEpisode: (token, episodeId) => dispatch(EpisodeActions.newEpisodeRequest(token, episodeId)),
    requestUserEpisodesTest: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequestTest(token, accountId, withFollowing)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),
    requestMoreFeeds: (token, accountId, withFollowing, before) => dispatch(EpisodeActions.moreFeedsRequest(token, accountId, withFollowing, before)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),

    reportEpisode: (episodeId) => dispatch(EpisodeActions.reportEpisode(episodeId)),
    removeEpisode: (episodeId) => dispatch(EpisodeActions.removeEpisode(episodeId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
