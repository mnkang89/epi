import React, { Component, PropTypes } from 'react'
import { View, TouchableOpacity, ActivityIndicator, Image, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import { getAccountId } from '../Services/Auth'
import { getObjectDiff, getArrayDiff } from '../Lib/Utilities'

import styles from './Styles/FeedScreenStyle'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModalContainer from './common/CommentModalContainer'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'
import { Images } from '../Themes'

const windowSize = Dimensions.get('window')
const ITEM_HEIGHT = 56 + (windowSize.width - 30) + 60 + 10

class SingleEpisodeScreen extends Component {
  static navigationOptions = {
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    header: ({ navigation }) => {
      return (
        <View style={{flexDirection: 'row', backgroundColor: 'white', height: 60}}>
          <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10, paddingTop: 10}}>
            <TouchableOpacity onPress={() => { navigation.goBack(null) }} >
              <Image style={{width: 16, height: 20}} source={Images.backChevron} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10}} >
            <Image
              source={Images.episodeLogo}
              style={{width: 82, height: 16}} />
          </View>
          <View style={{flex: 1}} />
        </View>
      )
    }
  }

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
      spinner: false,
      refreshing: false,
      commentModalVisible: false
    }
    this.episodeRefs = {}
    this.viewableItemsArray = []
  }

  componentDidMount () {
    // const { episodeId } = this.props
    const { episodeId } = this.props.navigation.state.params

    setTimeout(() => { this.props.requestSingleEpisode(null, episodeId) }, 300)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.singleEpisodeRequesting && !this.state.refreshing) {
      this.setState({spinner: true})
    } else {
      this.setState({
        spinner: false
      })
    }

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
    const { screen } = this.props.navigation.state.params

    if (this.state.spinner) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color='gray'
            size='small' />
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <View style={{height: 1}} />
          <FlatList
            removeClippedSubviews={false}
            viewabilityConfig={{viewAreaCoveragePercentThreshold: 51}}
            windowSize={3}
            style={{ flex: 1 }}
            ref={this._captureRef}
            renderItem={this._renderItemComponent}
            data={this.props.items}
            disableVirtualization={false}
            getItemLayout={undefined}
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
            navigation={this.props.navigation}
            commentModalVisible={this.state.commentModalVisible}
            commentModalHandler={this._toggleCommentModal.bind(this)}
            screen={screen} />
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
    const { account, detailType, singleType, pressedEpiIndex } = this.props.navigation.state.params
    // const { contentId, account, detailType, singleType } = this.props

    return (
      <EpisodeDetail
        navigation={this.props.navigation}
        type={detailType}
        singleType={singleType}
        xPosition={pressedEpiIndex}
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

      if (this.episodeRefs[index] !== null && this.episodeRefs[index] !== undefined) {
        this.episodeRefs[index].playEpisodeVideo()
      }
    }
  }

  _onRefresh = () => {
    const { episodeId } = this.props.navigation.state.params
    // const { episodeId } = this.props

    this.setState({refreshing: true}, () => {
      this.props.requestSingleEpisode(null, episodeId)
    })
  }

  _toggleCommentModal = () => {
    this.setState({
      commentModalVisible: !this.state.commentModalVisible
    })
  }

}

const mapStateToProps = (state) => {
  return {
    singleEpisodeRequesting: state.episode.singleEpisodeRequesting,
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
