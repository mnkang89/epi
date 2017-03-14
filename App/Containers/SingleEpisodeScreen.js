
import React, { Component, PropTypes } from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import styles from './Styles/FeedScreenStyle'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'

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
    // this.autoRefresher = setInterval(() => {
    //   this.props.requestSingleEpisode(token, episodeId)
    // }, 60000)
  }

  componentWillUnmount () {
    // clearInterval(this.autoRefresher)
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
    return this.props.items !== nextProps.items
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
          // contentId={this.props.contentId}
          // episodeId={this.props.episodeId}
        />
      </View>
    )
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
  }

  _renderItemComponent = (episode) => {
    const index = episode.index
    const { contentId, account } = this.props
    let xPosition = 0
    let contents = episode.item.contents

    if (contentId) {
      xPosition = contents.map((content) => { return content.id }).indexOf(contentId) * (windowSize.width - 22)
    }
    console.log('xPosition: ' + xPosition)

    return (
      <EpisodeDetail
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        key={index}
        index={index}
        token={this.props.token}
        parentHandler={this}
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

  _onViewableItemsChanged = (info: {
      changed: Array<{
        key: string, isViewable: boolean, item: any, index: ?number, section?: any
      }>
    }
  ) => {
    /* info오브젝트에서 뷰어블인 에피소드의 인덱스 추출하고 해당 에피소드를 제외한 에피소드는 모두 stopEpisodeVideo()호출 */
    console.log('싱글에피소드 스크린 온뷰어블 아이템스 체인지드')

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

        if (this.episodeRefs[index] !== null && this.episodeRefs[index] !== undefined) {
          console.log('싱글에피소드스크린 비디오켜라')
          this.episodeRefs[index].playEpisodeVideo()
        }
      }
    }
  }

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
