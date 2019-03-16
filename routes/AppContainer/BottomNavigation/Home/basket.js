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



@observer class Basket extends Component{
  goNewPage(){
      console.log("Haydar");
      console.log(this.props.navigation);
      //console.log(this.props.navigation.navigate('AdrressAdd'));
      
  }
  alertOnRemove(){
    alert.alert
  }
  renderProductCell(){
      let productCells = [];
      if(GlobalStore.clone.length == 0)
      {
          return <Text style={{color:'#76ff03',marginTop:16,fontFamily:'Aleo-BoldItalic'}}>Eklenmiş bir ürününüz bulunmamaktadır!</Text>
      }else{
          productCells = GlobalStore.clone.map( product =>
              (<View key ={product.name} style={{height:125,width:design.width-20,flexDirection:'row',borderRadius:25,borderColor:'white', borderWidth:3,marginTop:20}}>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center',borderRadius:25}}>
                      <Image source={{uri:product.imageUrl}} style={{height:50,width:50,borderRadius:25}}/>
                      <Text  style={{color:'white',fontFamily:'Courgette-Regular', fontSize:15, textAlign:'center'}}>
                          {product.name}
                      </Text>
      
                   
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center',borderRadius:25}}>
                      <Text  style={{color:'#76ff03',fontFamily:'Courgette-Regular', fontSize:15, textAlign:'center'}}>
                          {product.quantity} Adet
                      </Text>
                      <Text  style={{color:'#76ff03',fontFamily:'Courgette-Regular', fontSize:15, textAlign:'center'}}>
                          {product.finalPrice} Tl.
                      </Text>
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center',borderRadius:25}}>
                      <View>
                          <TouchableOpacity style={{backgroundColor:'#76ff03',borderRadius:25,height:25,width:75}} onPress={()=>GlobalStore.removeProduct(product.name)}>
                              <Text style={{color:'#e65100',fontFamily:'Courgette-Regular', fontSize:15, textAlign:'center'}}>
                                  Kaldır
                              </Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
              ));
      }
      return productCells;
  }
  render(){
      return(
          <View style={{flex:1,height:design.basketHeight,width:design.width,alignItems:'center',justifyContent:'center', backgroundColor:'green'}}>
              <View style={{height: 40,width:design.width,alignItems:'center',justifyContent:'center',borderBottomWidth:2,borderBottomColor: 'white',}}>
                  <Text style={{color:'white',fontFamily:'Courgette-Regular',fontSize:27}}>Sepetiniz</Text>
              </View>
              <View style={{height:50,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'blue'}}>
                 
                      <Button title="Pass" onPress={()=>this.props.navigation.navigate('AddAdressOrChoose')}>
                      
                          <Text>Adres Seç veya Ekle</Text>
                      
                      </Button>
                      <View style={{height:50,width:100,alignItems:'center',justifyContent:'center'}}>
                          <TouchableOpacity onPress = {()=> this.props.navigation.navigate('AddAdressOrChoose')}>
                          <Icon name="md-basket" size={30} color="white" />
                              
                          </TouchableOpacity>
                      </View>
                      
                  </View>
                  <ScrollView alwaysBounceVertical={true} showsVerticalScrollIndicator={false}>
                  {this.renderProductCell()}
                  </ScrollView>
                  {/*<View style={{height:100,width:design.width,backgroundColor:'orange',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:'#1b0000',fontFamily:'Courgette-Regular', fontSize:15, textAlign:'center'}}>
                          Ücret {GlobalStore.totalPrice} Tl.
                      </Text>
                      
                  </View>*/}
                  
          </View>
      
      )
  }

}

export default Basket;