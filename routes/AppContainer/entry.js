import React,{Component} from 'react';
import {Platform, Dimensions, StyleSheet,Keyboard,AsyncStorage, Alert, TextInput,Image,ActivityIndicator, Button,TouchableWithoutFeedback, TouchableOpacity, Text, View} from 'react-native';
import GlobalStore from '../../store/globalStore';
import { observer } from "mobx-react/native";
import hostURL from '../../constants/hostURL';

var DismissKeyboard = require('dismissKeyboard'); 
var dimensions = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
}

var userInfo = {
  phone_number: '',
  name: '',
  password: ''
}

@observer class Entry extends Component{
  constructor(props){
      super(props)
      this.state = {
        name:'',
        phone_number: '',
        infoTextColor: ['#040B10','#040B10','#040B10'],
        textInputLineColors: ['black','black','black'],
        signUpOrLogin : 'login',
        waitForLocation : true
        //waitForGeolocationAndAuthentication:
      }
      
  }  
  
  componentDidMount(){
    console.log("Haydar");
    navigator.geolocation.getCurrentPosition(
        (position) => {
            this.setState({waitForLocation:false});
            console.log("Haydar");
            GlobalStore.changeCoordinates(position.coords.latitude,position.coords.longitude);
            
            console.log("Global latitude " + GlobalStore.latitude + "Global longitude "+ GlobalStore.longitute );
            AsyncStorage.multiGet(["name", "phone_number","password","type"],(err,result) => {

                //Fetching data before app starts from local storage
                /*userInfo.name = result[0][1];
                userInfo.phone_number = result[1][1];
                userInfo.password = result[2][1];
                userInfo.type = result[3][1];*/
                userInfo.name = "İdris"
                userInfo.phone_number = "4567891524"
                userInfo.password = "Bb1.naber"
                userInfo.type = "user"
                console.log(userInfo.name + " " + userInfo.phone_number + " " + userInfo.password + " " +userInfo.type);
                if(userInfo.phone_number != null && userInfo.password != null){
                    console.log(JSON.stringify(userInfo));
                    fetch(hostURL+'customers/login', {
                      method: 'POST',
                      headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(userInfo),
                    }).then(result => {
                        console.log('------------------------------------------');
                        console.log(JSON.parse(result._bodyInit));
                        var responseResult = JSON.parse(result._bodyInit);
                        if(result.status == 200){
                            GlobalStore.phone_number=responseResult.result.phone_number;
                            GlobalStore.name = responseResult.result.name;
                            GlobalStore.password =responseResult.result.password;
                            GlobalStore.userID =responseResult.result._id;
                           
                            console.log(responseResult.result.adresses);
                            console.log(responseResult.result.orders);
                            GlobalStore.addAdresses(responseResult.result.adresses);
                            GlobalStore.addOrders(responseResult.result.orders);
                            if(userInfo.type == 'user' || userInfo.type == null){
                                //this.setState({signUpOrLogin:'goToBottomNav'})
                                this.props.navigation.navigate('BottomNavigation');
                            }
                            /*else if(type == 'admin'){
                                this.props.navigation.navigate('SecondPage')
                            }*/
                       }
                       else{
        
                       }
                    })
                    .catch(err => console.log(err));
                }
            })
           
            error: null;
            
        },
        (error) => this.setState({ error: error.message }),
    { enableHighAccuracy: false, timeout: 50000, maximumAge: 3000 },
        
    );
      
    
    
  }

  changeName(text){
      this.setState({name:text});
      
  }
  changeNumber(text){
      this.setState({phone_number:text});
  }
  changePassword(text){
      this.setState({password:text});
  }
  login(){
    let userInfo = {};
    userInfo.phone_number = this.state.phone_number;
    userInfo.password = this.state.password;
    if(this.state.phone_number.length<7 || this.state.phone_number.length>11)
    {
        Alert.alert(
            'Dikkat!',
            'Doğru Bir Telefon Numarası Girin',
            [
              {text: 'İptal Et', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Tamam', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
    }
    if( this.state.phone_number != '' && this.state.password != '')
    {
        console.log("fetche girdi")
          fetch(hostURL+'customers/login', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        }).then(result => {
            if(result.status == '200'){
                this.props.navigation.navigate('BottomNavigation');
            }
        })
        .catch(err => console.log(err));
    }
    else{
        console.log("bir boka girmedi")
      Alert.alert(
          'Dikkat!',
          'Gerekli Yerleri Doldurun',
          [
            {text: 'İptal Et', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Tamam', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    }
  }
  signUp(){
    //this.props.navigation.navigate('BottomNavigation');
      let userInfo = {};
      userInfo.name = this.state.name;
      userInfo.phone_number = this.state.phone_number;
      userInfo.password = this.state.password;
      if(this.state.phone_number.length != 11)
      {
          console.log("Telefon Numarasının uzunlugu" + this.state.phone_number.length);
        Alert.alert(
            'Dikkat!',
            'Doğru Bir Telefon Numarası Girin',
            [
              {text: 'İptal Et', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Tamam', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        return;
      }
      
      if(this.state.name != '' && this.state.phone_number != '' && this.state.password != '')
      {
          console.log("fetche girdi")
            fetch(hostURL+'customers/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          }).then(result => {
              
              
              
              if(result.status == 201){
                var bodyInit = JSON.parse(result._bodyInit);
                var type = bodyInit.result.type;
                  AsyncStorage.multiSet([['name',this.state.name],['phone_number',this.state.phone_number],['password',this.state.password],['type',type]],(err)=>{
                    if(err){
                        console.log("olmadı yüklemedi")
                    }
                  });
                     
                  GlobalStore.name = this.state.name;
                  GlobalStore.phone_number = this.state.phone_number;
                  GlobalStore.password = this.state.password;
                  console.log("name" + GlobalStore.name + "phone_number" + GlobalStore.phone_number + "password" + GlobalStore.password);
                  if(type == 'user'){
                    this.props.navigation.navigate('BottomNavigation')
                  }
                  else if( type == 'admin'){
                    this.props.navigation.navigate('SecondPage')
                  }
              }
              else if(result.status == 409){
                Alert.alert(
                    'Dikkat!',
                    'Kullanıcı mevcut!',
                    [
                      {text: 'Tamam', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                  )
              }
          })
          .catch(err => console.log(err));
      }
      else{
          console.log("bir boka girmedi")
        Alert.alert(
            'Dikkat!',
            'Gerekli Yerleri Doldurun',
            [
              {text: 'Tamam', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
      }
  }
  keyboardDismissAndChangeInputFieldLinesColor(){
        Keyboard.dismiss();
        this.setState({infoTextColor:['#040B10','#040B10','#040B10'], textInputLineColors:['black','black','black']});
  }
  changeLineColor(index){
      if(index == 0)
        this.setState({infoTextColor:['red','#040B10','#040B10'], textInputLineColors:['red','black','black']});
      else if(index == 1)
        this.setState({infoTextColor:['#040B10','red','#040B10'],textInputLineColors:['black','red','black']});
      else
      this.setState({infoTextColor:['#040B10','#040B10','red'],textInputLineColors:['black','black','red']});
  }
  
  renderSignup(){
      if(this.state.signUpOrLogin == 'signUp'){
        return(
            <View style={{flex:1}}>
                <View style = {{flex:3,alignItems:'center',justifyContent:'center'}}>
                    <Image style ={{height:200,width:200}}source={require('../../assets/images/inek.png')}></Image>
                    <View style={{width:dimensions.width-50}}>
                        <Text style={{color:'#6B4401',fontFamily:'Courgette-Regular',fontSize:15,textAlign:'center',textAlignVertical:'top'}}>Tiresüt'ün doğallığı, yeşil lezzeti bir tıklamayla evinize geliyor. 
                            Tamamen doğal, kimyasal süreç görmemiş süt, dondurma, yoğurt, peynir ve bir çok ürün için artık günlük teminat bir app kadar uzağınızda.
                        </Text>
                    </View>
                </View>
                <View style = {{flex:5,alignItems:'center',justifyContent:'center'}}>
                    <View style ={{alignItems:'center',justifyContent:'center',height: dimensions.height*1/4,width: dimensions.width*3/4,backgroundColor:'white',borderRadius: 16}}>
                        <View style={[styles.lineOfInput,{borderBottomColor:this.state.textInputLineColors[0]}]}>
                            <View style={styles.infoInput}>
                                <Text style={{color:this.state.infoTextColor[0],fontFamily:'Courgette-Regular',fontSize:15}}>İsim:</Text>
                            </View>
                            <View style={styles.infoText}>
                                <TextInput style={styles.textInputStyle} selectionColor={'red'} autoCorrect={false}  underlineColorAndroid='rgba(0,0,0,0)' 
                                    onFocus={() => this.changeLineColor(0)}  onChangeText={(text) => this.changeName(text)}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.lineOfInput,{borderBottomColor:this.state.textInputLineColors[1]}]}>
                            <View style={styles.infoInput}>
                                <Text style={{color:this.state.infoTextColor[1],fontFamily:'Courgette-Regular',fontSize:15}}>Tel. No:</Text>
                            </View>
                            <View style={styles.infoText}>
                                <TextInput keyboardType={'phone-pad'} style={styles.textInputStyle} selectionColor={'red'} autoCorrect={false}  
                                    underlineColorAndroid='rgba(0,0,0,0)' onFocus={() => this.changeLineColor(1)}  onChangeText={(text) => this.changeNumber(text)}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.lineOfInput,{borderBottomColor:this.state.textInputLineColors[2]}]}>
                            <View style={styles.infoInput}>
                                <Text style={{color:this.state.infoTextColor[2],fontFamily:'Courgette-Regular',fontSize:15}}>Şifre:</Text>
                            </View>
                            <View style={styles.infoText}>
                                <TextInput style={styles.textInputStyle} secureTextEntry={true} selectionColor={'red'} autoCorrect={false}  underlineColorAndroid='rgba(0,0,0,0)' 
                                    onFocus={() => this.changeLineColor(2)}  onChangeText={(text) => this.changePassword(text)}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{flex:1,width: dimensions.width*3/4-100,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity onPress={() => this.signUp()}><Text style={{color:'red',fontFamily:'FontAwesome5_Solid',fontSize:15}}>Kayıt Ol</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'100%',marginBottom:0,height:13,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.setState({signUpOrLogin:'login'})}>
                            <Text style={{color:'blue',fontSize:12,textDecorationLine:'underline'}}>Girişe geri dön!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
      }
      else if(this.state.signUpOrLogin == 'login'){
          return (
            <View style={{flex:1}}>
                <View style = {{flex:3,alignItems:'center',justifyContent:'center'}}>
                    <Image style ={{height:200,width:200}}source={require('../../assets/images/inek.png')}></Image>
                    <View style={{width:dimensions.width-50}}>
                        <Text style={{color:'#6B0101',fontFamily:'Courgette-Regular',fontSize:15,textAlign:'center',textAlignVertical:'top'}}>Tiresüt'ün doğallığı, yeşil lezzeti bir tıklamayla evinize geliyor. 
                            Tamamen doğal, kimyasal süreç görmemiş süt, dondurma, yoğurt, peynir ve bir çok ürün için artık günlük teminat bir app kadar uzağınızda.
                        </Text>
                    </View>
                </View>
                <View style = {{flex:5,alignItems:'center',justifyContent:'center'}}>
                    <View style ={{alignItems:'center',justifyContent:'center',height: dimensions.height*1/4,width: dimensions.width*3/4,backgroundColor:'white',borderRadius: 16}}>
                        <View style={[styles.lineOfInput,{borderBottomColor:this.state.textInputLineColors[0]}]}>
                            <View style={styles.infoInput}>
                                <Text style={{color:this.state.infoTextColor[0],fontFamily:'Courgette-Regular',fontSize:15}}>Tel. No:</Text>
                            </View>
                            <View style={styles.infoText}>
                                <TextInput style={styles.textInputStyle} keyboardType={'phone-pad'}  selectionColor={'red'} autoCorrect={false}  
                                    underlineColorAndroid='rgba(0,0,0,0)' onFocus={() => this.changeLineColor(0)} onChangeText = {(text) => this.changeNumber(text)}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.lineOfInput,{borderBottomColor:this.state.textInputLineColors[1]}]}>
                            <View style={styles.infoInput}>
                                <Text style={{color:this.state.infoTextColor[1],fontFamily:'Courgette-Regular',fontSize:15}}>Şifre:</Text>
                            </View>
                            <View style={styles.infoText}>
                                <TextInput secureTextEntry={true} style={styles.textInputStyle} selectionColor={'red'} autoCorrect={false} 
                                    underlineColorAndroid='rgba(0,0,0,0)' onFocus={() => this.changeLineColor(1)} onChangeText = {(text) => this.changePassword(text)}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{flex:1,width: dimensions.width*3/4-100,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity onPress={() => this.login()}><Text style={{color:'red',fontFamily:'FontAwesome5_Solid',fontSize:15}}>Giriş Yap</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'100%',marginBottom:0,height:13,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.setState({signUpOrLogin:'signUp'})}>
                            <Text style={{color:'blue',fontSize:12,textDecorationLine:'underline'}}>Hesap Oluştur!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                
            </View>
          )
      }
      /*else if(this.state.signUpOrLogin == 'goToBottomNav'){
       return(
        <BottomNavigation/>
          
       )
          
          
        
    }*/
  } 
  render() {
     
          if(!this.state.waitForLocation){
            return(
                <View style ={styles.container}>
                    <TouchableWithoutFeedback onPress={ () => this.keyboardDismissAndChangeInputFieldLinesColor()}>
                        {this.renderSignup()}
                    </TouchableWithoutFeedback>
                    
                    
                </View>
              )   
          }
          else{
           return(
            <View style={{flex:1}}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
           )
          }
    
  }
}

const styles = StyleSheet.create({
  container: {
      flex:1,
      height: '100%',
      width: '100%',
      backgroundColor: '#39EF3F'
  },
  imageView:{
      flex:1,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: 'red'
  }, 
  inputBox: {
      flex:1,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: 'white'
  },
  lineOfInput: {
      flex:1,
      width: dimensions.width*3/4-20,
      flexDirection: 'row',
      borderBottomWidth: 1,
  },
  infoInput: {
      flex:2,
      alignItems:'center',
      justifyContent:'flex-end'
  },
  infoText: {
      flex:5,
      alignItems:'flex-start',
      justifyContent:'flex-end',
      
  },
  textInputStyle :{
      //height:dimensions.height*1/16,
      width:dimensions.width*15/28,
      paddingBottom:0,
      fontFamily:'Courgette-Regular',
      fontSize:15
  }
})

export default Entry;