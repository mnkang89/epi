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
      if (this.props.selected) {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabHome} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: -5, alignItems: 'center'}}>
              <View style={{width: 37, height: 3, backgroundColor: '#F85032'}} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabHome} />
          </View>
        )
      }
    } else if (this.props.tabIcon === 'bell') {
      if (this.props.selected) {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 25}} source={Images.tabAlarm} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: -5, alignItems: 'center'}}>
              <Image style={{width: 37, height: 3}} source={Images.menuon} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 25}} source={Images.tabAlarm} />
          </View>
        )
      }
    } else if (this.props.tabIcon === 'camera') {
      return (
        <View style={styles.container}>
          <Image style={{width: 51, height: 51}} source={Images.tabPhoto} />
        </View>
      )
    } else if (this.props.tabIcon === 'search') {
      if (this.props.selected) {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabFind} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: -5, alignItems: 'center'}}>
              <Image style={{width: 37, height: 3}} source={Images.menuon} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabFind} />
          </View>
        )
      }
    } else if (this.props.tabIcon === 'user') {
      if (this.props.selected) {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabUser} />
            <View style={{position: 'absolute', left: 0, right: 0, bottom: -5, alignItems: 'center'}}>
              <Image style={{width: 37, height: 3}} source={Images.menuon} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <Image style={{width: 22, height: 23}} source={Images.tabUser} />
          </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TabIcon
