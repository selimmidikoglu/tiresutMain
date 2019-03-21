import React,{Component} from 'react';
import {Platform, Image,StyleSheet,Picker, Alert,Dimensions,TextInput,Text, ScrollView,Button,Keyboard,Animated,TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, View,ActivityIndicator} from 'react-native';
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
//keyboard dismiss
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//keyboard avoid
import {KeyboardAvoidingView} from 'react-native';
var newAdress = {addressName: '',addressDescription:'',addressMainDescription: '',city:'İzmir',district:'',neighborhood:'',streetNumber:'',no:'',buildingName: '',floor:'',apartment:'',postalCode:'',coordinates:{latitude:0,longitude:0},country:'Turkey'}
var adresses = [];
adresses[0] = GlobalStore.addressComponent[0];
adresses[1] = GlobalStore.addressComponent[1];
console.log(adresses);
@observer class AddAdress extends Component{
    navigationOptions = {
        tabBarVisible: false,
    };
  constructor(props){
    super(props);
    this.state = {
       alert  :false,
       addButtonClicked: false,
       loadingMap : true,
       viewHeight: 500,
       buttonHeight: 200,
       selectedAddress : GlobalStore.addressComponent[0].address_components[2].long_name + ", " + GlobalStore.addressComponent[0].address_components[1].long_name + ", No: " + GlobalStore.addressComponent[0].address_components[0].long_name,
    }
}
componentDidMount(){
        

  
        navigator.geolocation.getCurrentPosition(
            (position) => {

                GlobalStore.changeCoordinates(position.coords.latitude,position.coords.longitude);
                Geocoder.from (GlobalStore.latitude, GlobalStore.longitute)
                .then (json => {
                  var addressComponent = json; //s[0].address_components[0];
                  console.log(addressComponent.results);
                  GlobalStore.addressComponent = addressComponent.results;
                  console.log(GlobalStore.addressComponent);
                  GlobalStore.addressComponent.map((a) => {
                    console.log( "Hyadar" + a.formatted_address)
                  })
                  console.log("Ev");
                  console.log (addressComponent);
                })
                .catch (error => console.warn (error));
                console.log("Global latitude " + GlobalStore.latitude + "Global longitude "+ GlobalStore.longitute );
                console.log(GlobalStore.addressComponent);
                console.log( GlobalStore.addressComponent[0])
                adresses[0] = GlobalStore.addressComponent[0];
                adresses[1] = GlobalStore.addressComponent[1];   
                adresses[2] = GlobalStore.addressComponent[2];
                this.setState({selectedAddress: GlobalStore.addressComponent[1].address_components[2].long_name + ", "+ GlobalStore.addressComponent[1].address_components[1].long_name + ", No:" + GlobalStore.addressComponent[1].address_components[0].long_name});
                console.log(adresses);
                this.setState({loadingMap:false});
                //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidHide',this.keyboardWillShow);
                //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidShow',this.keyboardWillHide);
                
                error: null; 
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 5000000, maximumAge: 1000 },
            
        );
    
}

changeAlert(){
    if(!this.state.alert){
        this.setState({alert:true});
    }else {
        this.setState({alert:false});
    }
}
getCurrentLocation(){
  console.log("lokasyon almaya girdi");
  console.log(GlobalStore.getNewAdressText());
  Geocoder.from(GlobalStore.getNewAdressText())
		.then(json => {
      console.log(json.results)
			var location = json.results
      console.log(location);
      Geocoder.from (location.lat,location.lng)
      .then (json => {
        var addressComponent = json; //s[0].address_components[0];
        console.log("Adresi Alıyor aha burada");
        console.log (addressComponent);
      })
      .catch (error => console.warn (error));
		})
		.catch(error => console.warn(error));

    
}
renderPickerLabels(){
  let pickerlabels = GlobalStore.addressComponent.map((adress) => (
    <Picker.Item style={{fontSize:13}} label = {adress.formatted_address} value = {adress.formatted_address}/>
  ));
  return pickerlabels;
}
renderAlert(){
    if(this.state.alert){
        return(
            
                <View style={{height:200,width:300,backgroundColor:'green',alignItems:'center',justifyContent:'center',borderRadius:25,borderWidth:2,borderColor:'green'}}>
                    <View style={{flex:3,width:'100%',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'black',fontSize:17}}> Gerekli olan alanları doldurun</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginBottom:10}}>
                        <View style={{height:50,width:75,alignItems:'center',justifyContent:'center',backgroundColor:'green',borderRadius:5,marginBottom:10}}>
                            <TouchableOpacity onPress={()=> this.changeAlert()}>
                                <View style={{height:50,width:75,alignItems:'center',justifyContent:'center',backgroundColor:'green',borderRadius:5,marginBottom:10}}>
                                    <Text style={{color:'white',fontSize:15}}> Tamam </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            
        )
    }
}
renderMain1(){
    if(!this.state.loadingMap){
      return(
        <View style={{flex:1,backgroundColor:'red', position:'relative'}}>
        <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            //style={styles.map1}
            /*showsScale
            showsCompass
            showsPointsOfInterest
            showsBuildings*/
  
            style={styles.map1}
            initialRegion={{
              latitude: GlobalStore.latitude,
              longitude: GlobalStore.longitute,
              latitudeDelta: 0.0009,
              longitudeDelta: 0.0009,
            }}
            showUserLocation
          > 
            {GlobalStore.latitude != null && GlobalStore.longitude != null &&
              <MapView.Marker
                coordinate={{
                  latitude: GlobalStore.latitude,
                  longitude: GlobalStore.longitute,
                }}
                title={'Şu anki konumunuz'}
              />}
          </MapView>
          <View style={{width:40,height:40,marginTop:5,marginLeft:5, borderRadius:20,position:'absolute'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('AddAdressOrChoose')}>
                        <View style={{width:40,backgroundColor:'rgba(28,222,92,0.4)',height:40,borderRadius:20, alignItems:'center',justifyContent:'center'}}>
                            <Icon name="ios-arrow-back" color="white" size={25}/>
                        </View>
                    </TouchableOpacity>
          </View> 
          </View>
      );
    }
    else{
      return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size="large"></ActivityIndicator>
        </View>
        )
      
    }
}
getModalWindow(){
  if(newAdress.no == '' || newAdress.floor == '' || newAdress.addressName == '')
  {
  Alert.alert(
    'Dikkat!',
    'Gerekli alanları doldurun!',
    [ {
        text: 'Tamam',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }
    ],
    {cancelable: false},
  );
  }
  newAdress.coordinates.latitude = GlobalStore.latitude;
  newAdress.coordinates.longitude = GlobalStore.longitute;
  newAdress.addressMainDescription = this.state.selectedAddress;
  newAdress.streetNumber =  GlobalStore.addressComponent[0].address_components[1].long_name;
  newAdress.neighborhood = GlobalStore.addressComponent[0].address_components[2].long_name;
  newAdress.district =  GlobalStore.addressComponent[0].address_components[3].long_name;
  newAdress.postalCode =  GlobalStore.addressComponent[0].address_components[6].long_name;
  console.log(this.state.selectedAddress);
  console.log(newAdress);
  
}

renderMainOrAlert(){
    if(!this.state.alert){
        return (
            <View style={{flex:1,width:design.width,alignSelf: 'stretch', alignItems:'center',justifyContent:'center'}}>
                {this.renderMain1()}
            </View>
        )
            
       
    }
    else {
        return(
            <View style={{height:design.height,width:design.width,alignItems:'center',justifyContent:'center'}}>
                {this.renderAlert()}
            </View>
        )
            
    }
}
render(){
    return (
      <KeyboardAwareScrollView>
      <TouchableWithoutFeedback onPress={ () => {Keyboard.dismiss()}}>
          <View style={{flex:1}}>
            <View style={{height: design.addAdressPage.tabBar, width: design.width}}>
              <View style={{alignItems:'center',justifyContent:'center',width:design.width,backgroundColor:'green'}}>
                <Text style={{alignSelf:'center' ,textAlign:'center',fontFamily:'Courgette-Regular',fontSize:design.addAdressPage.tabBar-10,color:'white'}}>Adres Ekle</Text>
              </View>
            </View>
            <View style={{height: design.addAdressPage.mapView, width: design.width}}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map1}
                initialRegion={{
                  latitude: GlobalStore.latitude,
                  longitude: GlobalStore.longitute,
                  latitudeDelta: 0.0009,
                  longitudeDelta: 0.0009,
                }}
                showUserLocation
              > 
                {this.state.loadingMap == false &&
                  <MapView.Marker
                    coordinate={{
                      latitude: GlobalStore.latitude,
                      longitude: GlobalStore.longitute,
                    }}
                    title={'Şu anki konumunuz'}
                  />}
              </MapView>
              <View style={{width:40,height:40,marginTop:5,marginLeft:5, borderRadius:20,position:'absolute'}}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('AddAdressOrChoose')}>
                    <View style={{width:40,backgroundColor:'rgba(28,222,92,0.4)',height:40,borderRadius:20, alignItems:'center',justifyContent:'center'}}>
                        <Icon name="ios-arrow-back" color="white" size={25}/>
                    </View>
                </TouchableOpacity>
              </View> 
            </View>
            <View style={{height: design.addAdressPage.formView, width: design.width,alignItems:'center'}}>
              {/*<Text style={{alignSelf:'center' ,textAlign:'center',fontSize:12,color:'green'}}>Şu anki konumuzla ilişkilendirilmiş adres bilgileri doğru is geri kalan bilgileri doldurun, değilse yeni bir adres ekleyin.</Text>*/}
              <View  style={{marginTop:5,borderColor:'green',borderWidth:2, borderRadius:5,height: design.addAdressPage.formView/5-5, width: design.width-30}}>
                <Picker
                  mode = "dropdown"
                  selectedValue={this.state.selectedAddress}
                  itemStyle={{fontSize:13,color:'green'}}
                  //style={{borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height: 50, width: design.width-30}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({selectedAddress: itemValue})}
                  >
                  <Picker.Item style={{fontSize:13}} label = {GlobalStore.addressComponent[1].address_components[2].long_name + ", "+ GlobalStore.addressComponent[1].address_components[1].long_name + ", No: "+ GlobalStore.addressComponent[1].address_components[0].long_name} value = {GlobalStore.addressComponent[1].address_components[2].long_name + ", "+ GlobalStore.addressComponent[1].address_components[1].long_name + ", No:" + GlobalStore.addressComponent[1].address_components[0].long_name}/>
                  <Picker.Item style={{fontSize:13}} label = {GlobalStore.addressComponent[0].address_components[2].long_name + ", " + GlobalStore.addressComponent[0].address_components[1].long_name + ", No: " + GlobalStore.addressComponent[0].address_components[0].long_name} value = {GlobalStore.addressComponent[0].address_components[2].long_name + ", "+ GlobalStore.addressComponent[0].address_components[1].long_name +", No:" + GlobalStore.addressComponent[0].address_components[0].long_name}/>
                  
                </Picker>
              </View>
              <View style={{marginTop:5,width: (design.width-30),borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height:design.addAdressPage.formView/5-5}}>
                <TextInput style={{color:'black',fontSize:15}} 
                onChangeText={(text) => {
                  this.setState({selectedAddress:text});
                  newAdress.addressMainDescription = this.state.selectedAddress;
                }} 
                value={this.state.selectedAddress} placeholder = {this.state.selectedAddress}></TextInput>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between', width: design.width-30,marginTop:5,height:design.addAdressPage.formView/5-5}}>
                <View style={{width: (design.width-30)/2-10,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height:design.addAdressPage.formView/5-5}}>
                  <TextInput  style={{color:'black',fontSize:15}} onChangeText = {(text) => newAdress.addressName= text} placeholder = "Adres Adı"></TextInput>
                </View>
                <View style={{width: (design.width-30)/2-10,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height:design.addAdressPage.formView/5-5}}>
                  <TextInput  style={{color:'black',fontSize:15}}  onChangeText = {(text) => newAdress.buildingName = text} placeholder = "Bina Adı"></TextInput>
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between', width: design.width-30,marginTop:5,height:design.addAdressPage.formView/5-5}}>
                <View style={{width: (design.width-30)/2-10,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height: design.addAdressPage.formView/5-5}}>
                  <TextInput  style={{color:'black',fontSize:15}}  onChangeText = {(text) => newAdress.no = text} placeholder = "No"></TextInput>
                </View>
                <View style={{width: (design.width-30)/2-10,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height: design.addAdressPage.formView/5-5}}>
                  <TextInput   textContentType="location" onChangeText = {(text) => newAdress.floor = text} style={{color:'black',fontSize:15}} placeholder = "Kat/Daire"></TextInput>
                </View>
              </View>
              <View style={{marginTop:5,width: (design.width-30),borderColor:'green',borderWidth:2,fontSize:13, borderRadius:5,height:design.addAdressPage.formView/5-5}}>
                <TextInput style={{color:'black',fontSize:15}} onChangeText = {(text) => newAdress.addressDescription = text} placeholder ="Adres Tarifi"></TextInput>
              </View>
              
            </View>
            <View style={{alignSelf:'center', width: design.width-30,height:design.addAdressPage.saveButton,alignItems:'center',justifyContent:'center',marginTop: 5}}>
                <TouchableOpacity onPress = {() => this.getModalWindow()}>
                    <View style={{width: design.width-30,height:design.addAdressPage.saveButton,backgroundColor:'green',borderRadius:5, alignItems:'center',justifyContent:'center'}}>
                      <Text style={{textAlign:'center',color:'white',fontWeight: 'bold', }}>Kaydet</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>

      
            
            

        
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      
      
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

export default  AddAdress;