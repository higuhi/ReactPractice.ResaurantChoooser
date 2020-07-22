import React, { Component } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View, FlatList, ScrollView, Picker, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root, Toast } from "native-base";
import Store from "react-native-fs-store";

import CustomButton from '../components/CustomButton.js';
import CustomTextInput from '../components/CustomTextInput.js';
import ListScreen from './ListScreen.js';
import AddScreen from './AddScreen.js';

const Storage = new Store('Default');

const styles = StyleSheet.create({
    listScreenContainer: {
        flex: 1, 
        alignItems: "center",
        justifyContent: "center", 
        ...Platform.select({
        ios: {},
        android: {}
        })
    },
    listContainer: {
        width: "94%"
    },
    itemContainer: {
        flexDirection: "row",
        marginTop: 4,
        marginBottom: 4,
        borderColor: "#e0e0e0",
        borderBottomWidth: 2,
        alignItems: "center"
    },
    itemName: {
        flex: 1,
        color: "black",
    },
    fieldLabel: {
        marginLeft: 10
    },
    addScreenContainer: {},
    addScreenFormContainer: {},
});

const RestaurantListScreen = (props) => {
    return (
        <ListScreen store={Storage} storeName='restaurants' navigation={props.navigation} styles={styles}> 
            <CustomButton text="Add Restaurant" width="80%" onPress={ () => { props.navigation.navigate("AddScreen"); } } />
        </ListScreen>
    );
};

class RestaurantAddScreen extends Component { 
    
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            cuisine: "",
            price: "",
            rating: "",
            phone: "",
            address: "",
            website: "",
            delivery: "",
            key: `r_${new Date().getTime()}`  
        };
    }

    render() {
        return (
            <AddScreen store={Storage} storeName='restaurants' navigation={this.props.navigation} stateHolder={this} styles={styles}> 
                <View style={styles.addScreenInnerContainer}>
                
                <CustomTextInput label="Name" maxLength={20} stateHolder={this} stateFieldName="name" />
                
                <Text style={styles.fieldLabel}>Cuisines</Text>
                <View style={styles.pickerContainer}>
                    <Picker style={styles.picker} 
                    prompt="Cuisine"
                    selectedValue={this.state.cuisine}
                    onValueChange={(inItemValue)=>{this.setState({cuisine:inItemValue})}}>
                        <Picker.Item label="" value=""/>
                        <Picker.Item label="Danish" value="Danish"/>
                        <Picker.Item label="American" value="American"/>
                        <Picker.Item label="Japanese" value="Japanese"/>
                    </Picker>
                </View>
        
                <Text style={styles.fieldLabel}>Price</Text>
                <View style={styles.pickerContainer}>
                    <Picker style={styles.picker} 
                    prompt="Price"
                    selectedValue={this.state.price}
                    onValueChange={(inItemValue)=>{this.setState({price:inItemValue})}}>
                        <Picker.Item label="" value=""/>
                        <Picker.Item label="Very Low" value="Very Low"/>
                        <Picker.Item label="Low" value="Low"/>
                        <Picker.Item label="Medium" value="Medium"/>
                        <Picker.Item label="High" value="High"/>
                    </Picker>
                </View>
        
                <Text style={styles.fieldLabel}>Rating</Text>
                <View style={styles.pickerContainer}>
                    <Picker style={styles.picker} 
                    prompt="Rating"
                    selectedValue={this.state.rating}
                    onValueChange={(inItemValue)=>{this.setState({rating:inItemValue})}}>
                        <Picker.Item label="" value=""/>
                        <Picker.Item label="★" value="★"/>
                        <Picker.Item label="★★" value="★★"/>
                        <Picker.Item label="★★★" value="★★★"/>
                    </Picker>
                </View>
        
                <CustomTextInput label="Phone Number" maxLength={20} stateHolder={this} stateFieldName="phone" />
        
                <CustomTextInput label="Address" maxLength={20} stateHolder={this} stateFieldName="address" />
        
                <CustomTextInput label="Website" maxLength={20} stateHolder={this} stateFieldName="website" />
        
                </View>
        
            </AddScreen>
        );  
    }
}


const Stack = createStackNavigator();

const RestaurantsScreen = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen name="ListScreen" component={RestaurantListScreen} />
        <Stack.Screen name="AddScreen" component={RestaurantAddScreen} />
        </Stack.Navigator>
    );
};

exports.RestaurantsScreen = RestaurantsScreen;


/*---------- following code is going to be deleted ------- */







class OldListScreen extends Component { 
  constructor(props) {
    super(props);
    this.state = { listData: [] };
    this.updateRestaurantList = this.updateRestaurantList.bind(this);
    this.removeRestaurantList = this.removeRestaurantList.bind(this);
    this._unsubscribe = null;
  }

  /**
   * Updates the list of restaurant asynchronously. 
   */
  async updateRestaurantList() {
    try {
      console.log("updateRestaurantList: Getting items from restaurants");
      const val = await Storage.getItem("restaurants");
      this.setState({listData: (val===null) ? [] : JSON.parse(val)})
    } catch(error) {
      console.log("WARN: updateRestaurantList: something went wrong while reading restaurant list");
      this.setState({listData: []});
    }
  }

  /**
   * Removes the specified restaurant from the list. 
   */
  async removeRestaurantList(key) {
    let val; 
    try {
      console.log("removeRestaurantList: Getting items from restaurants");
      val = await Storage.getItem("restaurants");
    } catch(error) {
      console.log("WARN: removeRestaurantList: something went wrong while reading restaurant list");
      return;
    }

    const lists = (val===null) ? [] : JSON.parse(val);
    for(let i=0; i<lists.length; i++) {
      if(lists[i].key === key) {
        lists.splice(i, 1);
        break;
      }
    }

    try {
      console.log("removeRestaurantList: Storing items to restaurants");
      await Storage.setItem("restaurants", JSON.stringify(lists));
    } catch(error) {
      console.log("removeRestaurantList: Something went wrong with storing items to restaurants");
    }

    this.updateRestaurantList();
  }  

  /**
   * At mount, this compoenent will update the restaurant list and subscribe 
   * for navigation listener. 
   */
  componentDidMount() {
    this.updateRestaurantList();
    this._unsubscribe = this.props.navigation.addListener('focus', (e) => {
      this.updateRestaurantList(); 
    });    
    console.log("List Screen is mounted")
  }

  /**
   * At unmount, this compoenent will unsubscribe the navigation listener. 
   */
  componentWillUnmount() {
    if(this._unsubscribe!==null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    console.log("List Screen will be unmounted")
  }

  render() {
    return (
      <Root>
        <View style={styles.listScreenContainer}> 
          <CustomButton text="Add Restaurant" width="80%"
            onPress={ () => { this.props.navigation.navigate("AddScreen"); } } />
          <FlatList style={styles.restaurantList} 
            data={this.state.listData} 
            renderItem={ (item) => {
              return (
                <View style={styles.restaurantContainer} >
                  <Text style={styles.restaurantName}>{item.index} {item.item.name} ({item.item.key}) </Text>   
                  <CustomButton text="Delete" onPress={ () => {
                    Alert.alert("Please confirm", 
                      "Are you sure you want to delete this restaurant",
                      [
                        {text: "Yes", onPress: () => {this.removeRestaurantList(item.item.key)}},
                        {text: "No" },
                      ],
                      { cancelable: true }
                    )
                  } } />
                </View>
              );
            }} />
        </View>
      </Root>
    );  
  }
}

class OldAddScreen extends Component { 
  constructor(props) {
    super(props);
    this.state = { 
      name: "",
      cuisine: "",
      price: "",
      rating: "",
      phone: "",
      address: "",
      website: "",
      delivery: "",
      key: `r_${new Date().getTime()}`  
    };
    this.addRestaurant = this.addRestaurant.bind(this);
  }

  async addRestaurant() {
    let val;
    try {
      console.log("Getting items from restaurants");
      val = await Storage.getItem("restaurants");
    } catch(error) {
      console.log("Something went wrong with getting items to restaurants");
    }
    val = (val==null) ? [] : JSON.parse(val)
    val.push(this.state);

    try {
      console.log("Storing items to restaurants");
      await Storage.setItem("restaurants", JSON.stringify(val));
    } catch(error) {
      console.log("Something went wrong with storing items to restaurants");
    }

    this.props.navigation.navigate("ListScreen");
  }  


  render() {
    return (
      <ScrollView style={styles.addScreenContainer}>

        <View style={styles.addScreenInnerContainer}>
          
          <CustomTextInput label="Name" maxLength={20} stateHolder={this} stateFieldName="name" />
          
          <Text style={styles.fieldLabel}>Cuisines</Text>
          <View style={styles.pickerContainer}>
            <Picker style={styles.picker} 
              prompt="Cuisine"
              selectedValue={this.state.cuisine}
              onValueChange={(inItemValue)=>{this.setState({cuisine:inItemValue})}}>
                <Picker.Item label="" value=""/>
                <Picker.Item label="Danish" value="Danish"/>
                <Picker.Item label="American" value="American"/>
                <Picker.Item label="Japanese" value="Japanese"/>
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Price</Text>
          <View style={styles.pickerContainer}>
            <Picker style={styles.picker} 
              prompt="Price"
              selectedValue={this.state.price}
              onValueChange={(inItemValue)=>{this.setState({price:inItemValue})}}>
                <Picker.Item label="" value=""/>
                <Picker.Item label="Very Low" value="Very Low"/>
                <Picker.Item label="Low" value="Low"/>
                <Picker.Item label="Medium" value="Medium"/>
                <Picker.Item label="High" value="High"/>
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Rating</Text>
          <View style={styles.pickerContainer}>
            <Picker style={styles.picker} 
              prompt="Rating"
              selectedValue={this.state.rating}
              onValueChange={(inItemValue)=>{this.setState({rating:inItemValue})}}>
                <Picker.Item label="" value=""/>
                <Picker.Item label="★" value="★"/>
                <Picker.Item label="★★" value="★★"/>
                <Picker.Item label="★★★" value="★★★"/>
            </Picker>
          </View>

          <CustomTextInput label="Phone Number" maxLength={20} stateHolder={this} stateFieldName="phone" />

          <CustomTextInput label="Address" maxLength={20} stateHolder={this} stateFieldName="address" />

          <CustomTextInput label="Website" maxLength={20} stateHolder={this} stateFieldName="website" />

        </View>

        <View style={styles.addScreenFormContainer}>
          <CustomButton text="Cancel" onPress={ () => { this.props.navigation.navigate("ListScreen") }} />
          <CustomButton text="Save" onPress={ () => { this.addRestaurant(); } } />
        </View>

      </ScrollView>
    );  
  }
}

