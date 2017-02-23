// TODO: 싱글에피소드 api 리스펀스 오브젝트의 경우 피드와는 다른 형태를 가진다. 때문에, EpisdoeList(현재는 피드에 맞추어 설계되어 있음) 말고 EpisodeDetail을 직접 사용한다.

import React, { Component, PropTypes } from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import styles from './Styles/FeedScreenStyle'
import { getObjectDiff } from '../Lib/Utilities'

import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import {
  getItemLayout
} from '../Experimental/ListExampleShared_e'
import FlatListE from '../Experimental/FlatList_e'

import EpisodeActions from '../Redux/EpisodeRedux'

const windowSize = Dimensions.get('window')
// contentId받아서 어떻게 할 것인지 정하기

class SingleEpisodeScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    items: PropTypes.array,

    account: PropTypes.object,
    screen: PropTypes.string,
    episodeId: PropTypes.number,
    contentId: PropTypes.number,
    detailType: PropTypes.string,
    singleType: PropTypes.string,

    requestSingleEpisode: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
    this.episodeRefs = {}
    this.viewableItemsArray = []
  }

  componentDidMount () {
    const { token, episodeId } = this.props

    this.props.requestSingleEpisode(token, episodeId)
  }

  componentWillReceiveProps (nextProps) {
    console.log(getObjectDiff(this.props, nextProps))
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
      this.setState({refreshing: false})
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.items === this.props.items) {
      return false
    }
    return true
  }

  _onRefresh () {
    const { token, episodeId } = this.props
    this.setState({refreshing: true})

    this.props.requestSingleEpisode(token, episodeId)
  }

  render () {
    console.log('데이터길이: ' + this.props.items.length)
    return (
      <View style={styles.mainContainer}>
        <FlatListE
          keyExtractor={(item, index) => index}
          style={{ flex: 1 }}
          ref={this._captureRef}
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
          shouldItemUpdate={this._shouldItemUpdate} />
        <View style={{height: 48.5}} />
        <CommentModalContainer
          screen={this.props.screen}
          token={this.props.token}
          contentId={this.props.contentId}
          episodeId={this.props.episodeId} />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
  }

  _renderItemComponent = (episode) => {
    console.log(episode)
    const index = episode.index
    const { contentId, account } = this.props
    let xPosition = 0
    let contents = episode.item.contents

    if (contentId) {
      xPosition = contents.map((content) => { return content.id }).indexOf(contentId) * (windowSize.width - 22)
    }

    return (
      <EpisodeDetail
        key={index}
        token={this.props.token}
        episode={episode.item}
        account={account}
        type={this.props.detailType}
        singleType={this.props.singleType}
        xPosition={xPosition}
        requestNewEpisode={this.props.requestSingleEpisode} />
    )
  }

  _shouldItemUpdate (prev, next) {
    return prev.item !== next.item
  }

  // _onViewableItemsChanged = (info: {
  //     changed: Array<{
  //       key: string, isViewable: boolean, item: any, index: ?number, section?: any
  //     }>
  //   }
  // ) => {
  //   /* info오브젝트에서 뷰어블인 에피소드의 인덱스 추출하고 해당 에피소드를 제외한 에피소드는 모두 stopEpisodeVideo()호출 */
  //
  //   const viewableItemsArray = []
  //   const episodeRefsArray = Object.keys(this.episodeRefs).map(Number)
  //
  //   for (let i = 0; i < info.viewableItems.length; i++) {
  //     viewableItemsArray.push(info.viewableItems[i].index)
  //   }
  //
  //   this.viewableItemsArray = viewableItemsArray
  //
  //   const inViewableItemsArray = getArrayDiff(episodeRefsArray, viewableItemsArray)
  //
  //   for (let i in inViewableItemsArray) {
  //     const index = inViewableItemsArray[i]
  //
  //     if (this.episodeRefs[index] !== null) {
  //       this.episodeRefs[index].stopEpisodeVideo()
  //     } else {
  //       // console.log('null인놈들')
  //       // console.log(index)
  //     }
  //   }
  //   // 뷰어블한 아이템이 3개이면 중간 아이템만 play
  //   if (viewableItemsArray.length === 3) {
  //     if (this.episodeRefs[viewableItemsArray[0]] !== null) {
  //       this.episodeRefs[viewableItemsArray[0]].stopEpisodeVideo()
  //     }
  //     if (this.episodeRefs[viewableItemsArray[2]] !== null) {
  //       this.episodeRefs[viewableItemsArray[2]].stopEpisodeVideo()
  //     }
  //   } else {
  //     for (let j in viewableItemsArray) {
  //       const index = viewableItemsArray[j]
  //
  //       if (this.episodeRefs[index] !== null && this.episodeRefs[index] !== undefined) {
  //         this.episodeRefs[index].playEpisodeVideo()
  //       }
  //     }
  //   }
  // }

}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    items: state.episode.singleEpisode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestSingleEpisode: (token, episodeId) => dispatch(EpisodeActions.singleEpisodeRequest(token, episodeId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleEpisodeScreen)
