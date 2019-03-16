
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,KeyboardAvoidingView} from 'react-native';
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation';
import Entry from './routes/AppContainer/entry';
import BottomNavigation from './routes/AppContainer/BottomNavigation/bottomNavigation';
import AddAdress from './routes/AppContainer/BottomNavigation/Home/addAdress';
//store
import GlobalStore from './store/globalStore';
import { observer } from "mobx-react/native";
//constants
import hostURL from './constants/hostURL';
@observer class App extends Component {
  componentDidMount(){
    fetch (hostURL+'products')
      .then (response => response.json ())
      .then (responseJson => {
        GlobalStore.showProducts = responseJson;
      })
      .catch (error => {
        console.error (error);
      });
  }
  render() {
    return (
      <AppContainerOne/>
    );
  }
}

const AppContainerOne = createStackNavigator({
  Entry:Entry,
  BottomNavigation:BottomNavigation,
  AddAdress:AddAdress
},
{
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
});

export default App;