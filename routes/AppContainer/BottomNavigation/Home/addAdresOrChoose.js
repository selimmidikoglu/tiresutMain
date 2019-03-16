import React,{Component} from 'react';
import {Platform, Image,StyleSheet, Dimensions,TextInput,Text, ScrollView,Button, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, View,ActivityIndicator} from 'react-native';
//icons
import Icon from 'react-native-vector-icons/Ionicons';
//map packages
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
//mobx
import GlobalStore from '../../../../store/globalStore';
import { observer } from "mobx-react/native";
//constants
import hostURL from '../../../../constants/hostURL';
import design from '../../../../constants/dimensions';

@observer class AddAdressOrChoose extends Component{
  constructor(props){
    super(props);
    this.state = {
        loadingMap : true,
        buttonBackgroundColors : ["white","white"],
        buttonTextColors : ["black","black"]
    }
}
componentDidMount(){
    console.log(GlobalStore.adresses);
    if(GlobalStore.latitude != 0 && GlobalStore.longitute != 0)
    {
        this.setState({loadingMap:false});
    }
    Geocoder.from (GlobalStore.latitude, GlobalStore.longitute)
    .then (json => {
      var addressComponent = json; //s[0].address_components[0];
      console.log (addressComponent);
    })
    .catch (error => console.warn (error));
}
changeAdressButtonColor(){

}
changePaymentButtonandTextColors(index){
    if(index == 0){
        this.setState({buttonBackgroundColors:["green","white"],buttonTextColors:["white","black"]});
    }
    else{
        this.setState({buttonBackgroundColors:["white","green"],buttonTextColors:["black","white"]});
    }
}
renderOrderButton(){
    return(
        <View style={{height:design.adressSelectPage.giveOrder,width:design.width}}>
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('HomePage')}>
                <View style={{flexDirection:'row',height:design.adressSelectPage.giveOrder,width:design.width}}>
                    <Text style={{alignSelf:'center' ,textAlign:'left',fontFamily:'Courgette-Regular',fontSize:20,color:'green'}}>Sipariş Ver</Text>
                    <Icon name="md-arrow-round-forward" size={20} color="green"></Icon>
                </View>
            </TouchableHighlight> 
        </View>    
    );
}
renderPayment(){
    return (
        <View style={{height:design.adressSelectPage.orderType,width:design.width,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
            <View style={{ width:design.width/2-20,height:design.adressSelectPage.orderType/2}}>
                <TouchableOpacity onPress={()=>this.changePaymentButtonandTextColors(0)}>
                    <View style={{backgroundColor:this.state.buttonBackgroundColors[0],width:design.width/2-20,height:design.adressSelectPage.orderType/2,borderRadius:10,borderColor:'green',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center',fontFamily:'Courgette-Regular',fontSize:15,color:this.state.buttonTextColors[0]}}>Nakit</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{width:design.width/2-20,height:design.adressSelectPage.orderType/2}}>
                <TouchableOpacity onPress={()=>this.changePaymentButtonandTextColors(1)}>
                    <View style={{backgroundColor:this.state.buttonBackgroundColors[1],width:design.width/2-20,height:design.adressSelectPage.orderType/2,borderRadius:10,borderColor:'green',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center',fontFamily:'Courgette-Regular',fontSize:15,color:this.state.buttonTextColors[1]}}>Kredi kartı</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
renderAdressesView(){
    let adresses = [];

        adresses = GlobalStore.adresses.map(address => (
            <View key ={address.no} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:design.width-20,alignSelf:'center',height:75,borderBottomColor:'gray',borderBottomWidth:1}}>
                <TouchableOpacity onPress={()=>this.changeAdressButtonColor()}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:design.width-20,alignSelf:'center',height:75,borderBottomColor:'gray',borderBottomWidth:1}}>
                <View style={{height:30,width:30,borderRadius:15,backgroundColor:'green'}}>
                        <View style={{height:30,width:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                            <Icon name="md-arrow-round-forward" size={20} color="white"></Icon>
                        </View>
                </View>
                <View style={{flexDirection:'row', height:50,width:design.width-80,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{alignSelf:'center', textAlign:'justify',fontFamily:'Courgette-Regular',fontSize:15,color:'green'}}>{address.addressName}:  </Text>
                        <Text style={{textAlign:'left',fontFamily:'Courgette-Regular',fontSize:15,color:'black'}}>{address.neighborhood}  </Text>
                        <Text style={{textAlign:'left',fontFamily:'Courgette-Regular',fontSize:15,color:'black'}}>No:{address.no}  </Text>
                        <Text style={{textAlign:'left',fontFamily:'Courgette-Regular',fontSize:15,color:'black'}}>{address.district}/</Text>
                        <Text style={{textAlign:'left',fontFamily:'Courgette-Regular',fontSize:15,color:'black'}}>{address.city}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        ))
    
    return adresses;
}
renderMapView(){
    if (this.state.loadingMap) {
        return <ActivityIndicator size="large" color="yellow" />;
      } else {
        return (
            
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map1}
              initialRegion={{
                latitude: GlobalStore.latitude,
                longitude: GlobalStore.longitute,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showUserLocation
            > 
              {GlobalStore.latitude != 0 &&
                GlobalStore.longitute != 0 &&
                <MapView.Marker
                  coordinate={{
                    latitude: GlobalStore.latitude,
                    longitude: GlobalStore.longitute,
                  }}
                  title={'Şu anki konumunuz'}
                />}
            </MapView>
       
        );
      }
}
render(){
    return(
        <View style={{flex:1,height:design.basketHeight,width:design.width,alignItems:'center',justifyContent:'center'}}>
           
            <View style={{height:design.adressSelectPage.adresses,width:design.width}}>
                <ScrollView>
                    
                    <TouchableOpacity onPress= { () => this.props.navigation.navigate('AddAdress')}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:design.width-20,alignSelf:'center',height:75,borderBottomColor:'gray',borderBottomWidth:1}}>
                            <View style={{height:30,width:30,borderRadius:15,backgroundColor:'red'}}>
                                
                                    <View style={{height:30,width:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                                        <Icon name="ios-add" size={20} color="white"></Icon>
                                    </View>
                               
                            </View>
                            <View style={{flexDirection:'row', height:50,width:design.width-80,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{textAlign:'left',fontFamily:'Courgette-Regular',fontSize:15,color:'red'}}>Yeni Adres Ekle </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {this.renderAdressesView()}
                </ScrollView>
            </View>
            <View style={{height:design.adressSelectPage.orderType,width:design.width}}>{this.renderPayment()}</View>
            <View style={{height:design.adressSelectPage.giveOrder,width:design.width}}>
                {this.renderOrderButton()}
            </View>
            <View style={{height:design.adressSelectPage.map,backgroundColor:'red',width:design.width}}>{this.renderMapView()}</View>
        </View>
        
    )
}

}

const styles = StyleSheet.create ({

map1: {
  ...StyleSheet.absoluteFillObject,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  
},

});


export default AddAdressOrChoose;