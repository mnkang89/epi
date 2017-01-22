import React, { Component, PropTypes } from 'react'
import {
  View,
  ListView,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModal from '../Components/common/CommentModal'
// import FeedList from '../Components/FeedList'
import styles from './Styles/FeedScreenStyle'

import AccountActions from '../Redux/AccountRedux'
import EpisodeActions from '../Redux/EpisodeRedux'
import CommentActions from '../Redux/CommentRedux'

class FeedScreen extends Component {

  static propTypes = {
    token: PropTypes.string,
    accountId: PropTypes.number,
    items: PropTypes.array.isRequired,

    contentId: PropTypes.number,
    episodeId: PropTypes.number,

    visible: PropTypes.bool,
    comments: PropTypes.array,
    commentPosting: PropTypes.bool,

    requestInfo: PropTypes.func,
    requestUserEpisodes: PropTypes.func,

    resetCommentModal: PropTypes.func,
    postComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount () {
    const { token, accountId } = this.props
    this.isAttempting = true

    this.props.requestInfo(token, accountId)
    this.props.resetCommentModal()

    console.log('디드마운트')
    console.log(this.props.items)
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
      if (this.state.refreshing) {
        this.setState({refreshing: false})
      }
    }
  }

  onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  render () {
    console.log(this.props.items)
    console.log(this.state.dataSource)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.dataSource = ds.cloneWithRows(this.props.items.slice())
    return (
      <View style={styles.mainContainer}>
        <ListView
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={(item) =>
            <EpisodeDetail
              key={item.episode.id}
              episode={item.episode}
              account={item.account} />
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />}
        />
        <View style={{height: 50}} />
        <CommentModal
          token={this.props.token}
          contentId={this.props.contentId}
          episodeId={this.props.episodeId}
          visible={this.props.visible}
          comments={this.props.comments}
          commentPosting={this.props.commentPosting}
          resetCommentModal={this.props.resetCommentModal}
          postComment={this.props.postComment} />
      </View>
    )
  }
/*
render () {
  return (
    <View style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} />}
      >
        <FeedList
          items={this.props.items} />
        <View style={{height: 50}} />
      </ScrollView>
      <CommentModal
        token={this.props.token}
        contentId={this.props.contentId}
        episodeId={this.props.episodeId}
        visible={this.props.visible}
        comments={this.props.comments}
        commentPosting={this.props.commentPosting}
        resetCommentModal={this.props.resetCommentModal}
        postComment={this.props.postComment} />
    </View>
  )
}
*/
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    accountId: state.token.id,

    items: state.episode.episodes,

    contentId: state.comment.contentId,
    episodeId: state.comment.episodeId,

    visible: state.comment.visible,

    comments: state.comment.comments,
    commentPosting: state.comment.commentPosting
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestInfo: (token, accountId) => dispatch(AccountActions.infoRequest(token, accountId)),
    requestUserEpisodes: (token, accountId, withFollowing) => dispatch(EpisodeActions.userEpisodesRequest(token, accountId, withFollowing)),

    resetCommentModal: () => dispatch(CommentActions.resetComment()),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
