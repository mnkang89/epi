import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import {
  getItemLayout
} from '../Experimental/ListExampleShared_e'
import FlatListE from '../Experimental/FlatList_e'
import NotiDetail from '../Components/NotiDetail'
import styles from './Styles/FeedScreenStyle'

import NotiActions from '../Redux/NotiRedux'
import CommentActions from '../Redux/CommentRedux'
import PushConfig from '../Config/PushConfig'
import { Images } from '../Themes'
import { getObjectDiff } from '../Lib/Utilities'

const windowSize = Dimensions.get('window')

class NotiScreen extends React.PureComponent {
  static navigationOptions = {
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    header: () => (
      <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 60, paddingTop: 10}}>
        <Image
          source={Images.episodeLogo}
          style={{
            width: 82,
            height: 16}} />
      </View>
    ),
    tabBarIcon: ({focused}) => {
      if (focused) {
        return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image style={{width: 22, height: 25}} source={Images.tabAlarm} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
              <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
            </View>
          </View>
        )
      } else {
        return (
          <Image style={{width: 22, height: 25}} source={Images.tabAlarm} />
        )
      }
    }
  }

  static propTypes = {
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
      spinner: false,
      data: [],
      refreshing: false
    }

    this.profileModifiedFlag = false
    this.page = 0
  }

  componentDidMount () {
    PushConfig()
    this.props.requestNoties(null, 0)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.notiesRequesting && !this.state.refreshing) {
      this.setState({spinner: true})
    } else {
      if (nextProps.noties.length === 0) {
        this.setState({
          nothing: true,
          spinner: false
        })
      } else {
        this.setState({
          nothing: false,
          spinner: false
        })
      }
    }

    if (nextProps.noties.length !== 0) {
      this.page = this.page + 1
    }

    if (this.state.refreshing) {
      this.setState({refreshing: false})
    }

    this.setState({ data: nextProps.noties })
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.profileModified !== nextProps.profileModified) {
  //     this.profileModifiedFlag = true
  //     return true
  //   }
  //   if (_.isEqual(this.props.noties, nextProps.noties)) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  renderScrollview (noties) {
    if (noties.length === 0) {
      return (
        <View style={styles.mainContainer}>
          <View style={{height: 1}} />
          <ScrollView
            style={{flex: 1, backgroundColor: 'white'}}
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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')}>
                  <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: '#626262'}}>
                    <Text style={{fontSize: 16, color: '#626262'}}>에피소드 공유</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <FlatListE
          keyExtractor={(item, index) => index}
          style={{ flex: 1, backgroundColor: 'rgb(241, 241, 241)', paddingTop: 10 }}
          ref={this._captureRef}
          ItemComponent={this._renderItemComponent.bind(this)}
          disableVirtualization={false}
          horizontal={false}
          data={this.state.data}
          key={'vf'}
          legacyImplementation={false}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          // shouldItemUpdate={this._shouldItemUpdate.bind(this)}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0} />
      )
    }
  }

  _captureRef = (ref) => { this._listRef = ref }

  _getItemLayout = (data: any, index: number) => {
    return getItemLayout(data, index, this.state.horizontal)
  }

  _renderItemComponent = ({item}) => {
    const noti = item
    const account = {
      profileImagePath: this.props.myProfileImagePath,
      nickname: this.props.myNickname
    }

    return (
      <NotiDetail
        navigation={this.props.navigation}
        key={noti.id}
        noti={noti}
        myAccount={account}
        openComment={this.props.openComment}
        getComment={this.props.getComment} />
    )
  }

  // _shouldItemUpdate (prev, next) {
  //   if (this.profileModifiedFlag) {
  //     this.profileModifiedFlag = false
  //     return true
  //   }
  //   return prev.item !== next.item
  // }

  _onRefresh = () => {
    this.page = 0

    this.setState({refreshing: true}, () => {
      this.props.requestNoties(null, this.page)
    })
  }

  _onEndReached = () => {
    const page = this.page

    this.setState({footer: true})
    this.props.requestMoreNoties(null, page)
  }

  _renderFooterComponent = () => {
    if (this.state.footer) {
      return (
        <View>
          <ActivityIndicator
            color='gray'
            style={{marginBottom: 50}}
            size='small' />
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  render () {
    if (this.state.spinner) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color='gray'
            size='small' />
        </View>
      )
    } else if (this.state.nothing) {
      return (
        <View style={styles.mainContainer}>
          <View style={{height: 1}} />
          <ScrollView
            style={{flex: 1, backgroundColor: 'white'}}
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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')}>
                  <View style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 7, paddingRight: 7, borderRadius: 4, borderWidth: 1, borderColor: '#626262'}}>
                    <Text style={{fontSize: 16, color: '#626262'}}>에피소드 공유</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
            <FlatListE
              keyExtractor={(item, index) => index}
              style={{ flex: 1, backgroundColor: 'rgb(241, 241, 241)', paddingTop: 10 }}
              ref={this._captureRef}
              ItemComponent={this._renderItemComponent.bind(this)}
              disableVirtualization={false}
              horizontal={false}
              data={this.state.data}
              key={'vf'}
              legacyImplementation={false}
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              // shouldItemUpdate={this._shouldItemUpdate.bind(this)}
              onEndReached={this._onEndReached}
              onEndReachedThreshold={0} />
          </View>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    // profileModified: state.signup.modified,
    myProfileImagePath: state.account.profileImagePath,
    myNickname: state.account.nickname,

    notiesRequesting: state.noti.notiesRequesting,
    noties: state.noti.noties
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNoties: (token, page) => dispatch(NotiActions.notiesRequest(token, page)),
    requestMoreNoties: (token, page) => dispatch(NotiActions.moreNotiesRequest(token, page)),

    openComment: (visible) => dispatch(CommentActions.openComment(visible)),
    getComment: (token, episodeId, contentId) => dispatch(CommentActions.commentGet(token, episodeId, contentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen)
