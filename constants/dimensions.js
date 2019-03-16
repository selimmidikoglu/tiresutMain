import React, {Component} from 'react';
import {Dimensions} from 'react-native';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var design = {
    width: width,
    tabBarHeight : height * 1/14,
    mapViewHeight : height * 5/14,
    productViewHeight : height * 7 / 14,
    navBarHeight : height*1/14,
    basketHeight: height*12/14,
    adressSelectPage: {
        map : height*5/14,
        adresses:height*5/14,
        orderType : height*2/14,
        giveOrder : height*1/14,
    },
    addAdressPage: {
        backButton: height*1/14,
        district : height *1/14,
        neighborhood: height *1/14,
        no: height*1/14,
        buildingName: height*1/14,
        floor: height*1/14,
        description: height* 4/14,
        textInputLongWidth: width -30,
    }

}

export default design;