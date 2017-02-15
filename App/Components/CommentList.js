import React, { Component, PropTypes } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

import CommentDetail from './CommentDetail'

class CommentList extends Component {

  static propTypes = {
    token: PropTypes.string,
    screen: PropTypes.string,
    comments: PropTypes.array.isRequired,
    episodeId: PropTypes.number,
    contentId: PropTypes.number,

    resetCommentModal: PropTypes.func,
    getComment: PropTypes.func
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
  }

  onRefresh () {
    const { token, episodeId, contentId } = this.props

    this.setState({refreshing: true})
    this.props.getComment(token, episodeId, contentId)
  }

  renderComments () {
    const unsortedComments = Immutable.asMutable(this.props.comments)
    const sortedComments = unsortedComments.sort(function (a, b) {
      return new Date(b.createDateTime) - new Date(a.createDateTime)
    })

    return sortedComments.map(comment =>
      <CommentDetail
        key={comment.id}
        comment={comment}
        screen={this.props.screen}
        resetCommentModal={this.props.resetCommentModal} />
    )
  }

  render () {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        } >
        {this.renderComments()}
      </ScrollView>
    )
  }

}

export default CommentList
