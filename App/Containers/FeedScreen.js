import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ListView,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Actions as NavigationActions } from 'react-native-router-flux'

import EpisodeDetail from '../Components/common/EpisodeDetail'
import CommentModal from '../Components/common/CommentModal'
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
    getComment: PropTypes.func,
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

    this.props.requestInfo(token, accountId)
    this.props.resetCommentModal()
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.items, nextProps.items)) {
      console.log('아이템같음')
    } else {
      console.log('아이템다름')
    }
    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }
  }

  onRefresh () {
    const { token, accountId } = this.props
    const withFollowing = true

    this.setState({refreshing: true})
    this.props.requestUserEpisodes(token, accountId, withFollowing)
  }

  renderListView (dataSource) {
    if (dataSource._cachedRowCount === 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
            } >
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
              <Text style={{fontSize: 60, fontWeight: 'bold', color: 'white'}}>안녕하세요!</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
              <Text style={{fontSize: 16, color: 'white'}}>다른 사람들의 에피소드를 구경하고</Text>
              <Text style={{fontSize: 16, color: 'white'}}>팔로우 해보세요!</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
              <TouchableOpacity onPress={NavigationActions.searchTab}>
                <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: 'white'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>에피소드 탐색</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )
    } else {
      return (
        <ListView
          removeClippedSubviews
          pageSize={1}
          enableEmptySections
          dataSource={dataSource}
          renderRow={(item) =>
            <EpisodeDetail
              key={item.episode.id}
              episode={item.episode}
              account={item.account} />
            }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
            } />
      )
    }
  }

  render () {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataSource = ds.cloneWithRows(this.props.items.slice())

    return (
      <View style={styles.mainContainer}>
        {this.renderListView(dataSource)}
        <View style={{height: 48.5}} />
        <CommentModal
          screen={'FeedScreen'}
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
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId)),
    postComment: (token, episodeId, contentId, message) => dispatch(CommentActions.commentPost(token, episodeId, contentId, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
