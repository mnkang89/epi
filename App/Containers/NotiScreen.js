import React, { Component, PropTypes } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import _ from 'lodash'

import {
  getItemLayout
} from '../Experimental/ListExampleShared_e'
import FlatListE from '../Experimental/FlatList_e'
// import NotiList from '../Components/NotiList'
import NotiDetail from '../Components/NotiDetail'
import styles from './Styles/FeedScreenStyle'

import NotiActions from '../Redux/NotiRedux'
import CommentActions from '../Redux/CommentRedux'
import PushConfig from '../Config/PushConfig'

const windowSize = Dimensions.get('window')

class NotiScreen extends Component {
  static propTypes = {
    token: PropTypes.string,
    myAccount: PropTypes.object,
    notiesRequesting: PropTypes.bool,
    noties: PropTypes.array,

    requestNoties: PropTypes.func,
    openComment: PropTypes.func,
    getComment: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount () {
    const { token } = this.props
    PushConfig()
    this.props.requestNoties(token)
  }

  componentWillReceiveProps (nextProps) {
    if (_.isEqual(this.props.noties, nextProps.noties)) {
      console.log('노티같음')
    } else {
      console.log('노티다름')
    }
    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }
  }

  componentWillUnmount () {
    // clearInterval(this.autoRefresher)
  }

  _onRefresh () {
    const { token } = this.props

    this.setState({refreshing: true})
    this.props.requestNoties(token)
  }

  renderScrollview (noties) {
    if (this.props.notiesRequesting) {
      console.log('노티 리퀘스팅중')
      return
    } else {
      if (noties.length === 0) {
        console.log('노티 없음')
        return (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)} />
              } >
            <View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: windowSize.height - 410}}>
                <Text style={{fontSize: 16, color: '#626262'}} >아직은 전해드릴 소식이 없네요.</Text>
                <Text style={{fontSize: 16, color: '#626262'}} >에피소드를 공유하고 소식을 받아보세요:)</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 18}}>
                <TouchableOpacity onPress={NavigationActions.cameraTab}>
                  <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: '#626262'}}>
                    <Text style={{fontSize: 16, color: '#626262'}}>에피소드 공유</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )
      } else {
        return (
          <FlatListE
            keyExtractor={(item, index) => index}
            style={{ flex: 1, backgroundColor: 'rgb(241, 241, 241)', paddingTop: 10 }}
            ref={this._captureRef}
            ItemComponent={this._renderItemComponent.bind(this)}
            disableVirtualization={false}
            getItemLayout={undefined}
            horizontal={false}
            data={this.props.noties}
            key={'vf'}
            legacyImplementation={false}
            onRefresh={this._onRefresh.bind(this)}
            refreshing={this.state.refreshing}
            shouldItemUpdate={this._shouldItemUpdate} />
        )
      }
    }
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
  }

  _renderItemComponent = ({item}) => {
    const noti = item
    return (
      <NotiDetail
        key={noti.id}
        token={this.props.token}
        noti={noti}
        myAccount={this.props.myAccount}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  _shouldItemUpdate (prev, next) {
    return prev.item !== next.item
  }

  render () {
    const { noties } = this.props

    return (
      <View style={styles.mainContainer}>
        <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
          {this.renderScrollview(noties)}
          <View style={{height: 48.5}} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token.token,
    myAccount: state.account,

    notiesRequesting: state.noti.notiesRequesting,
    noties: state.noti.noties
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNoties: (token) => dispatch(NotiActions.notiesRequest(token)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen)

/*
return (
  <ScrollView
    refreshControl={
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh.bind(this)} />
    }
  >
    <NotiList
      token={this.props.token}
      noties={this.props.noties}
      myAccount={this.props.myAccount}
      openComment={this.props.openComment}
      getComment={this.props.getComment} />
  </ScrollView>
)
*/
