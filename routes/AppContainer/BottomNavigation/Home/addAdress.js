import React,{Component} from 'react';
import {Platform, Image,StyleSheet,Picker, Dimensions,TextInput,Text, ScrollView,Button,Keyboard,Animated,TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, View,ActivityIndicator} from 'react-native';
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


//keyboard avoid
import {KeyboardAvoidingView} from 'react-native';

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
       selectedAddress : ''
    }
    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(200);
}
componentDidMount(){
    

  
        navigator.geolocation.getCurrentPosition(
            (position) => {
                GlobalStore.changeCoordinates(position.coords.latitude,position.coords.longitude);
                console.log("Global latitude " + GlobalStore.latitude + "Global longitude "+ GlobalStore.longitute );
                console.log(GlobalStore.addressComponent);
                console.log( GlobalStore.addressComponent[0])
                adresses[0] = GlobalStore.addressComponent[0];
                adresses[1] = GlobalStore.addressComponent[1];   
                adresses[2] = GlobalStore.addressComponent[2];
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
componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
}

keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: 75,
      }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: 200,
      }),
    ]).start();
  };

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
        <View style={{flex:1,backgroundColor:'red'}}>
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
            {!!GlobalStore.latitude &&
              !!GlobalStore.longitute &&
              <MapView.Marker
                coordinate={{
                  latitude: GlobalStore.latitude,
                  longitude: GlobalStore.longitute,
                }}
                title={'Şu anki konumunuz'}
              />}
          </MapView>
          <View style={{width:40,height:40,marginTop:5,marginLeft:5, borderRadius:20,position:'absolute'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
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
/*renderMain(){
    return(

          <View style={{flex:1}}>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.backButton,backgroundColor:'green'}}>
                <View style={{width:50,height:'100%',marginLeft:10,alignItems:'center',justifyContent: 'center',}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                        <View style={{width:50,height:'100%'}}>
                            <Icon name="ios-arrow-back" color="white" size={32}/>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Adres Adı:</Text>
                </View>
                <View style={{flex:9,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "Ev, İşyeri, Yazlık vb." style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}} 
                    onChangeText={(text) => GlobalStore.addAdressName=text} />
                </View>
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Semt/İlçe:</Text>
                </View>
                <View style={{flex:9,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "Bornova, Karşıyaka vb." style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                    onChangeText={(text) => GlobalStore.newAdress.district=text} />
                </View>
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Mahalle:</Text>
                </View>
                <View style={{flex:9,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "Gül Mahallesi, Gazi Sokak vb." style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                    onChangeText={(text) => GlobalStore.newAdress.neighborhood=text}/>
                </View>
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>No:</Text>
                </View>
                <View style={{flex:9,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "14 4/1 vb." style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                    onChangeText={(text) => GlobalStore.newAdress.no=text}/>
                </View>
                
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Bina Adı:</Text>
                </View>
                <View style={{flex:9,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "Tarla Apartman, Bulgar İş Hanı vb." style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                    onChangeText={(text) => GlobalStore.newAdress.buildingName=text}/>
                </View>
                
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Kat:</Text>
                </View>
                <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1}}>
                    <TextInput placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                     onChangeText={(text) => GlobalStore.newAdress.floor=text}/>
                </View>
                <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:30}}>
                    <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Daire:</Text>
                </View>
                <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                    <TextInput placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                     onChangeText={(text) => GlobalStore.newAdress.apartment=text}/>
                </View>
                
            </View>
            <View style={{flexDirection:'row',width:design.width,height:design.addAdressPage.district}}>
            <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:10}}>
                <Text style={{color:'white',fontSize:15,textAlign:'left'}}>No:</Text>
            </View>
            <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1}}>
                <TextInput placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                 onChangeText={(text) => GlobalStore.newAdress.no=text}/>
            </View>
            <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:30}}>
                <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Pos.Kodu:</Text>
            </View>
            <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                <TextInput  placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                 onChangeText={(text) => GlobalStore.newAdress.postalCode=text}/>
            </View>
            <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:30}}>
                <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Pos.Kodu:</Text>
            </View>
            <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                <TextInput  placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                 onChangeText={(text) => GlobalStore.newAdress.postalCode=text}/>
            </View>
            <View style={{flex:3,alignItems:'flex-start',justifyContent:'flex-end',marginLeft:30}}>
                <Text style={{color:'white',fontSize:15,textAlign:'left'}}>Pos.Kodu:</Text>
            </View>
            <View style={{flex:3,width:200,alignItems:'flex-start',justifyContent:'flex-end',borderBottomColor: 'white',borderBottomWidth:1,marginRight:20}}>
                <TextInput  placeholder = "" style={{width:'100%',color:'white',marginBottom:0,textAlignVertical:'bottom'}}
                 onChangeText={(text) => GlobalStore.newAdress.postalCode=text}/>
            </View>
            
        </View>
        </View>
        
        
    );
}
renderMapView(){
  if(this.state.addButtonClicked){
    if (this.state.loadingMap) {
      return <ActivityIndicator size="large" color="yellow" />;
    } else {
      return (
        <View style={styles.container}>
          
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map1}
            initialRegion={{
              latitude: GlobalStore.newAdress.location.latitude,
              longitude: GlobalStore.newAdress.location.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            }}
            showUserLocation
          > 
            {!!this.state.latitude &&
              !!this.state.longitude &&
              <MapView.Marker
                coordinate={{
                  latitude: GlobalStore.newAdress.location.latitude,
                  longitude: GlobalStore.newAdress.location.longitude,
                }}
                title={'Şu anki konumunuz'}
              />}
          </MapView>
        </View>
      );
    }
  } else {
    return null;
  }
}*/
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
      <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss()}>
        <View style={{flex:1}}>
         
            <View style={{flex:1}}>
            {this.renderMain1()}
            </View>
            <View style={{flex:2,marginTop:10,alignItems:'center'}}>
              <View  style={{borderColor:'green',borderWidth:1, borderRadius:25,height: 50, width: design.width-30}}>
              <Picker
                selectedValue={this.state.selectedAddress}
                itemStyle={{fontSize:13,color:'green'}}
                style={{borderColor:'green',borderWidth:2,fontSize:13, borderRadius:25,height: 50, width: design.width-30}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({selectedAddress: itemValue})}
                >
                <Picker.Item style={{fontSize:13}} label = {GlobalStore.addressComponent[0].formatted_address} value = {GlobalStore.addressComponent[0].formatted_address}/>
                <Picker.Item style={{fontSize:13}} label = {GlobalStore.addressComponent[1].formatted_address} value = {GlobalStore.addressComponent[1].formatted_address}/>
                
              </Picker>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between', width: design.width-30,marginTop:10}}>
                <View style={{flex:1,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:25,height: 50}}>
                  <TextInput style={{color:'black',fontSize:15}}  placeholder = "Bina Adı"></TextInput>
                </View>
                <View style={{flex:1,borderColor:'green',borderWidth:2,fontSize:13, borderRadius:25,height: 50}}>
                  <TextInput textContentType="location" style={{color:'black',fontSize:15}} placeholder = "Kat/Daire"></TextInput>
                </View>
              </View>
            </View>
            
        </View>
        </TouchableWithoutFeedback>
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