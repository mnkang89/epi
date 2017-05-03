import React, { Component, PropTypes } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import { getAccountId } from '../Services/Auth'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'

import styles from './Styles/FeedScreenStyle'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class SingleEpisodeScreen extends Component {

  static propTypes = {
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
      refreshing: false,
      commentModalVisible: false
    }
    this.episodeRefs = {}
    this.viewableItemsArray = []
  }

  componentDidMount () {
    const { episodeId } = this.props
    this.props.requestSingleEpisode(null, episodeId)
  }

  componentWillReceiveProps (nextProps) {
    // console.log(getObjectDiff(this.props, nextProps))
    // if (_.isEqual(this.props.items, nextProps.items)) {
    //   console.log('아이템같음')
    //   this.setState({refreshing: false})
    // } else {
    //   console.log('아이템다름')
    //   if (this.state.refreshing) {
    //     this.setState({refreshing: false})
    //   }
    // }
    if (this.state.refreshing) {
      this.setState({ refreshing: false })
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
    // if (this.state.commentModalVisible !== nextState.commentModalVisible) {
    //   return true
    // }
    // if (_.isEqual(this.props.items, nextProps.items)) {
    //   return false
    // } else {
    //   return true
    // }
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 51}}
          style={{ flex: 1 }}
          ref={this._captureRef}
          renderItem={this._renderItemComponent}
          data={this.props.items}
          disableVirtualization={false}
          key={'vf'}
          keyExtractor={(item, index) => index}
          horizontal={false}
          legacyImplementation={false}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          onViewableItemsChanged={this._onViewableItemsChanged}
          shouldItemUpdate={this._shouldItemUpdate} />
        <View style={{height: 48.5}} />
        <CommentModalContainer
          commentModalVisible={this.state.commentModalVisible}
          commentModalHandler={this._toggleCommentModal.bind(this)}
          screen={this.props.screen} />
      </View>
    )
  }

/* FlatList helper method */
  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index
  })

  _renderItemComponent = ({item, index}) => {
    const { contentId, account } = this.props
    let xPosition = 0
    let contents = item.contents

    if (contentId) {
      xPosition = contents.map((content) => { return content.id }).indexOf(contentId) * (windowSize.width - 22)
    }
    return (
      <EpisodeDetail
        type={this.props.detailType}
        singleType={this.props.singleType}
        xPosition={xPosition}
        index={index}
        ref={(component) => {
          if (component !== null) {
            this.episodeRefs[index] = component
          }
        }}
        parentHandler={this}
        episode={item}
        account={account}
        commentModalHandler={this._toggleCommentModal}
        requestNewEpisode={this.props.requestSingleEpisode}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
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
      }
    }

    for (let j in viewableItemsArray) {
      const index = viewableItemsArray[j]
      console.log('//j출력')
      console.log(this.episodeRefs)
      console.log(index)
      console.log('j출력//')
      if (this.episodeRefs[index] !== null && this.episodeRefs[index] !== undefined) {
        console.log('플레이 에피소드 비디오')
        this.episodeRefs[index].playEpisodeVideo()
      }
    }
  }

  _onRefresh = () => {
    const { episodeId } = this.props

    this.setState({refreshing: true})
    this.props.requestSingleEpisode(null, episodeId)
  }

  _toggleCommentModal = () => {
    this.setState({
      commentModalVisible: !this.state.commentModalVisible
    })
  }

}

const mapStateToProps = (state) => {
  return {
    items: state.episode.singleEpisode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestSingleEpisode: (token, episodeId) => dispatch(EpisodeActions.singleEpisodeRequest(token, episodeId)),
    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleEpisodeScreen)
