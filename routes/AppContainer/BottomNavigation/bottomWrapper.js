import React,{Component,PureComponent} from 'react';
import { Text, View,Button,Keyboard } from 'react-native';
import BottomNavigation from './bottomNavigation';
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation';

class BottomWrapper extends PureComponent {

    constructor(props) {
      super(props)
  
      this.keyboardWillShow = this.keyboardWillShow.bind(this)
      this.keyboardWillHide = this.keyboardWillHide.bind(this)
  
      this.state = {
        isVisible: true
      }
    }
  
    componentWillMount() {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }
  
    componentWillUnmount() {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    }
  
    keyboardWillShow = event => {
      this.setState({
        isVisible: false
      })
    }
  
    keyboardWillHide = event => {
      this.setState({
        isVisible: true
      })
    }
  
    render() {
      return this.state.isVisible ?
        <BottomNavigation {...this.props} />
        :
        null
    }
  }
  
  export default BottomWrapper


