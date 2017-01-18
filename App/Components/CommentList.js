import React, { Component, PropTypes } from 'react'
import { ScrollView } from 'react-native'

import CommentDetail from './CommentDetail'

class CommentList extends Component {

  static propTypes = {
    comments: PropTypes.array.isRequired
  }

  renderComments () {
    return this.props.comments.map(comment =>
      <CommentDetail key={comment.id} comment={comment} />)
  }

  render () {
    return (
      <ScrollView>
        {this.renderComments()}
      </ScrollView>
    )
  }

}

export default CommentList
