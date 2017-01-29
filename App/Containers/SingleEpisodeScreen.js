// TODO: 싱글에피소드 api 리스펀스 오브젝트의 경우 피드와는 다른 형태를 가진다. 때문에, EpisdoeList(현재는 피드에 맞추어 설계되어 있음) 말고 EpisodeDetail을 직접 사용한다.

import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getObjectDiff } from '../Lib/Utilities'
import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModal from '../Components/common/CommentModal'
// import EpisodeList from '../Components/common/EpisodeList'
import styles from './Styles/FeedScreenStyle'

import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

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

    requestSingleEpisode: PropTypes.func,
    getComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
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
    // 상관없는 하위 컴포넌트들이 리 렌더링되는 문제를 막기위함
    if (nextProps.items === this.props.items) {
      return false
    }
    return true
  }

  onRefresh () {
    const { token, episodeId } = this.props
    this.setState({refreshing: true})

    this.props.requestSingleEpisode(token, episodeId)
  }

  renderEpisodes () {
    const account = this.props.account
    const { contentId } = this.props
    let xPosition = 0

    return this.props.items.map(item => {
      let contents = item.contents
      if (contentId) {
        xPosition = contents.map((content) => { return content.id }).indexOf(contentId) * (windowSize.width - 22)
      }

      return (
        <EpisodeDetail
          key={item.id}
          episode={item}
          account={account}
          type={this.props.detailType}
          singleType={this.props.singleType}
          xPosition={xPosition} />
      )
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
          } >
          {this.renderEpisodes()}
        </ScrollView>
        <CommentModal
          screen={this.props.screen}
          token={this.props.token}
          contentId={this.props.contentId}
          episodeId={this.props.episodeId}
          visible={this.props.visible}
          comments={this.props.comments}
          commentPosting={this.props.commentPosting}
          resetCommentModal={this.props.resetCommentModal}
          getComment={this.props.getComment}
          postComment={this.props.postComment} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    items: state.episode.singleEpisode,

    visible: state.comment.visible,
    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestSingleEpisode: (token, episodeId) => dispatch(EpisodeActions.singleEpisodeRequest(token, episodeId)),

    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleEpisodeScreen)
