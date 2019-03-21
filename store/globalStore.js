import {observable,action,autorun, toJS} from 'mobx';


class GlobalStore {
    @observable newAdress = {addressName: '',addressDescription:'',addressMainDescription: '',city:'İzmir',district:'',neighborhood:'',streetNumber:'',no:'',buildingName: '',floor:'',apartment:'',postalCode:'',coordinates:{latitude:0,longitude:0},country:'Turkey'}
    @observable showProducts = [];
    @observable text = "Hi I am selim ";
    //variable to keep the total price of the basket
    @observable addressComponent = [];
    @observable adressToBoSent = {};
    @observable totalPrice = 0;
    @observable products = {count: 0,productsAdded : []};
    @observable counter = 0;
    @observable latitude = 0.0;
    @observable longitute = 0.0;
    @observable text2 = 'Bos';
    @observable name = '';
    @observable phone_number = '';
    @observable password = '';
    @observable userID = '';
    @observable page = 'home'
    @observable productToAdd = {_id: '', name: '', imageUrl: '', price: 0.0 , finalPrice: 0.0, quantity: 1 }
    @observable addressOption = '';
    @observable clone = [];
    @observable adresses = [];
    @observable previousOrders = [];
    /*addAdressName(text){
        this.newAdress.adressName = text;
    }
    addDistrict(text){
        this.newAdress.district = text;
    }
    addNeighborhood(text){
        this.newAdress.neighborhood = text;
    }
    
    addStreetNumber(text){
        this.newAdress.streetNumber = text;
    }
    addNo(text){
        this.newAdress.no = text;
    }
    addBuildingName(text){
        this.newAdress.buildingName = text;
    }
    addFloor(text){
        this.newAdress.floor = text;
    }
    addApartment(text){
        this.newAdress.apartment = text;
    }
    addPostalCode(text){
        this.newAdress.postalCode = text;
    }
    addLocation(location){
        this.newAdress.location.latitude = location.latitude;
    }
    addLocation(location){
        this.newAdress.location.longitude = location.longitude;
    }*/

    getNewAdressText(){
        var newAdressToSearch = ''
        
        
        newAdressToSearch += this.newAdress.neighborhood + ', ';
        newAdressToSearch += this.newAdress.streetNumber + ' ';
        newAdressToSearch += 'No:'+this.newAdress.no + ', ';
        newAdressToSearch += this.newAdress.postalCode + ' ';
        newAdressToSearch += this.newAdress.district + '/';
        newAdressToSearch += this.newAdress.city + ', ';
        newAdressToSearch += this.newAdress.country;
        return newAdressToSearch;
    }
    changeAdressOption(title){
        this.addressOption = title;
    }
    addAdresses(adresses){
        for (let i = 0; i < adresses.length; i++) {
            const element = adresses[i];
            this.adresses.push(element);
        }
    }
    addOrders(previousOrders){
        for (let i = 0; i < previousOrders.length; i++) {
            const element = previousOrders[i];
            this.previousOrders.push(element);
        }
    }
    removeProduct(name){
        for (let i = 0; i < this.clone.length; i++) {
            if(this.clone[i].name == name){
                console.log("Bu isim siliniyor" + name);
                this.totalPrice -= this.clone[i].finalPrice;
                this.clone.splice(i,1);
                this.products.count = this.products.count - 1;
            }
            
        }
        console.log("Clone un son hali " + JSON.stringify(this.clone));
     
        
    }
    addProductToBasket(productToAdd){
        console.log("Eklenilecek ürün " + productToAdd)
        let addNew = true;
        let index = 0;
        for (let i = 0; i < this.clone.length; i++) {
            const element = this.clone[i];
            if(element.name == productToAdd.name){
                index = i;
                addNew = false;
            }
            
        }
        if(addNew){
            this.clone.push(productToAdd);
            this.products.count = this.products.count + 1;
            console.log("Yeni eklendi");
            console.log(JSON.stringify(this.clone));
            this.totalPrice += productToAdd.finalPrice;
        } else {
            this.totalPrice -= this.clone[index].finalPrice
            this.clone[index].quantity = this.clone[index].quantity + productToAdd.quantity;
            this.clone[index].finalPrice = this.clone[index].quantity * this.clone[index].price;
            console.log("Üzerine eklendi");
            console.log(JSON.stringify(this.clone));
            this.totalPrice += this.clone[index].finalPrice;
        }
     
        this.productToAdd = {_id: '', name: '', imageUrl: '', price: 0.0 , finalPrice: 0.0, quantity: 1 };
    }
    changeBetweenBasketOrBottomNav(){
        if(this.basketOrBottomNav){
            this.basketOrBottomNav = false;
        }
        else{
            this.basketOrBottomNav = true;
        }
    }
    changeCoordinates(lat,lon){
        this.latitude = lat;
        this.longitute = lon;
        console.log(this.latitude + " Hyadar " + this.longitute)
    }
    changeFirstProductPrice(price){
        this.urunler.urun1.fiyat = 50;
    }
    changeThePriceWithQuantity(){
        this.productToAdd.finalPrice = this.productToAdd.price * this.productToAdd.quantity;
    }
    incrementQuantity(){
        if(this.productToAdd.quantity>=1){
            this.productToAdd.quantity = this.productToAdd.quantity + 1;
            this.changeThePriceWithQuantity();
        }else{
            this.productToAdd.quantity = 1
        }
        
    }
    decrementQuantity(){
        if(this.productToAdd.quantity>1){
            this.productToAdd.quantity = this.productToAdd.quantity - 1;
            this.changeThePriceWithQuantity();
        }else{
            this.productToAdd.quantity = 1
        }
    }
    changeTheChosenProduct(text){
        this.productToAdd.name = text;
    }
}

const Store = new GlobalStore();
export default Store;