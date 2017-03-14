import React, { Component, PropTypes } from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { Images } from '../../Themes'
import { connect } from 'react-redux'
import CameraScreenActions from '../../Redux/CameraScreenRedux'
import ConfirmError from '../common/ConfirmError'

class EpisodeControllerButton extends Component {
  static PropTypes = {
    activeEpisodeId: PropTypes.number,
    getActiveUserEpisode: PropTypes.func,
    endEpisode: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      visibleEndEpisodeAlert: false,
      visibleEpisodeControllerButton: this.props.activeEpisodeId !== null
    }
  }

  componentDidMount () {
    this.props.getActiveEpisode()
  }

  componentWillReceiveProps (nextProps) {
    console.tron.log('episode active ? :' + nextProps.activeEpisodeId !== null)
    this.setState({visibleEpisodeControllerButton: nextProps.activeEpisodeId !== null})
  }

  pressEndEpisodeButton () {
    this.setState({ visibleEndEpisodeAlert: true })
  }

  openAlert () {
    this.setState({ visibleEndEpisodeAlert: true })
  }

  acceptEndEpisode () {
    this.props.endEpisode(this.props.activeEpisodeId)
    this.hiddenEndEpisodeAlert()
  }

  hiddenEndEpisodeAlert () {
    this.setState({ visibleEndEpisodeAlert: false })
  }

  render () {
    if (this.state.visibleEpisodeControllerButton) {
      return (
        <View>
          <TouchableOpacity
            onPress={this.openAlert.bind(this)}>
            <Image style={{width: 28.5, height: 28.5}} source={Images.endEpBtn} />
          </TouchableOpacity>
          <ConfirmError
            confirmStyle={'setting'}
            TextArray={['에피소드가 종료됩니다.', '정말 종료하실거예요?😢']}
            onAccept={this.acceptEndEpisode.bind(this)}
            onSetting={this.hiddenEndEpisodeAlert.bind(this)}
            AcceptText={'네'}
            SettingText={'아니요'}
            visible={this.state.visibleEndEpisodeAlert} />
        </View>
      )
    } else {
      return false
    }
  }
}

const episdoeControllerMapToProps = (state) => {
  return ({
    activeEpisodeId: state.cameraScreen.activeEpisodeId
  })
}

const episodeControllerMapToDispatch = (dispatch) => {
  return {
    endEpisode: (activeEpisodeId) => dispatch(CameraScreenActions.deactiveEpisode(activeEpisodeId)),
    getActiveEpisode: () => dispatch(CameraScreenActions.getActiveEpisode())
  }
}

export default connect(episdoeControllerMapToProps, episodeControllerMapToDispatch)(EpisodeControllerButton)
