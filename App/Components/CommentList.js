import React, { Component, PropTypes } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

import CommentDetail from './CommentDetail'

class CommentList extends Component {

  static propTypes = {
    screen: PropTypes.string,
    comments: PropTypes.array.isRequired,
    episodeId: PropTypes.number,
    contentId: PropTypes.number,

    commentPosting: PropTypes.bool,
    commentDeleting: PropTypes.bool,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func,
    deleteComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.comments, nextProps.comments)) {
      console.log('코멘트같음')
    } else {
      console.log('코멘트다름')
    }
    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }

    if (nextProps.commentPosting) {
      console.log('아직 코멘트 포스팅중')
      return
    } else if (
      this.props.commentPosting === true &&
      nextProps.commentPosting === false) {
      console.log('코멘트 포스팅 끝')
    } else if (!_.isEqual(this.props.comments, nextProps.comments)) {
      console.log('코멘트 포스팅 후 새로고침')
    }
  }

  onRefresh () {
    const { episodeId, contentId } = this.props

    this.setState({refreshing: true})
    this.props.getComment(null, episodeId, contentId)
  }

  componentWillMount () {
  }

  renderComments () {
    const unsortedComments = Immutable.asMutable(this.props.comments)
    const sortedComments = unsortedComments.sort(function (a, b) {
      return new Date(a.createDateTime) - new Date(b.createDateTime)
    })

    return sortedComments.map(comment =>
      <CommentDetail
        navigation={this.props.navigation}
        key={comment.id}
        episodeId={this.props.episodeId}
        contentId={this.props.contentId}
        comment={comment}
        screen={this.props.screen}
        resetCommentModal={this.props.resetCommentModal}
        deleteComment={this.props.deleteComment} />
    )
  }

  render () {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} />
        } >
        {this.renderComments()}
      </ScrollView>
    )
  }

}

export default CommentList
