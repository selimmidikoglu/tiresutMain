import React,{Component} from 'react';
import { Text, View,Button } from 'react-native';
import { createBottomTabNavigator,createStackNavigator, BottomTabBar } from 'react-navigation';
import BottomWrapper from './bottomWrapper';

//screens
import Home from './Home/home';
import Adress from './Adress/adress';
import Orders from './Orders/orders';
import Profile from './Profile/profile';


const BottomNavigation = createBottomTabNavigator({
    Home:Home,
    Adress:Adress,
    Orders:Orders,
    Profile:Profile,
},/*{
    tabBarComponent: BottomWrapper,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      
    }
}*/);

export default BottomNavigation;