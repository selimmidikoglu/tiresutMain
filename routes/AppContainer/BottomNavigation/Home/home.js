import React,{Component} from 'react';
import { Text, View,Button } from 'react-native';
import { createBottomTabNavigator,createStackNavigator } from 'react-navigation';


//screens
import AddAdressOrChoose from './addAdresOrChoose';
import AddAdress from './addAdress';
import Basket from './basket';
import Products from './products';

const Home = createStackNavigator({
    Products:Products,
    Basket:Basket,
    AddAdressOrChoose:AddAdressOrChoose,
    /*AddAdress:{
        screen:AddAdress,
        navigationOptions: { tabBarVisible: false}
    }*/
},{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});

export default Home;