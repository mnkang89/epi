import React, { PropTypes, Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome'
import { Images } from '../../Themes'

class TabIcon extends Component {

  static propTypes = {
    selectedTabIcon: PropTypes.string.isRequired,
    tabIcon: PropTypes.string.isRequired
  }

  // render () {
  //   return (
  //     <View style={styles.container}>
  //       <Icon
  //         name={this.props.selected ? this.props.selectedTabIcon : this.props.tabIcon}
  //         size={20}
  //         color={this.props.selected ? '#66b2ff' : '#FFFFFF'}
  //         style={{width: 22, height: 22, alignSelf: 'center', fontWeight: '300'}}
  //       />
  //     </View>
  //   )
  // }

  render () {
    if (this.props.tabIcon === 'home') {
      return (
        <View style={styles.container}>
          <Image style={{width: 22, height: 23}} source={Images.tabHome} />
        </View>
      )
    } else if (this.props.tabIcon === 'bell') {
      return (
        <View style={styles.container}>
          <Image style={{width: 20, height: 23}} source={Images.tabAlarm} />
        </View>
      )
    } else if (this.props.tabIcon === 'camera') {
      return (
        <View style={styles.container}>
          <Image style={{width: 51, height: 51}} source={Images.tabPhoto} />
        </View>
      )
    } else if (this.props.tabIcon === 'search') {
      return (
        <View style={styles.container}>
          <Image style={{width: 23, height: 23}} source={Images.tabFind} />
        </View>
      )
    } else if (this.props.tabIcon === 'user') {
      return (
        <View style={styles.container}>
          <Image style={{width: 20, height: 23}} source={Images.tabUser} />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default TabIcon
