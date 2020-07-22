import React, { Component } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View, FlatList, ScrollView, Picker, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Store from "react-native-fs-store";

import CustomButton from '../components/CustomButton.js';
import CustomTextInput from '../components/CustomTextInput.js';
import ListScreen from './ListScreen.js';
import AddScreen from './AddScreen.js';

const Stack = createStackNavigator();

const Storage = new Store('Default');

const Styles = StyleSheet.create({
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
        <ListScreen store={Storage} storeName='restaurants' navigation={props.navigation} styles={Styles}> 
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
            <AddScreen store={Storage} storeName='restaurants' navigation={this.props.navigation} stateHolder={this} styles={Styles}> 
                <View style={Styles.addScreenInnerContainer}>
                
                <CustomTextInput label="Name" maxLength={20} stateHolder={this} stateFieldName="name" />
                
                <Text style={Styles.fieldLabel}>Cuisines</Text>
                <View style={Styles.pickerContainer}>
                    <Picker style={Styles.picker} 
                    prompt="Cuisine"
                    selectedValue={this.state.cuisine}
                    onValueChange={(inItemValue)=>{this.setState({cuisine:inItemValue})}}>
                        <Picker.Item label="" value=""/>
                        <Picker.Item label="Danish" value="Danish"/>
                        <Picker.Item label="American" value="American"/>
                        <Picker.Item label="Japanese" value="Japanese"/>
                    </Picker>
                </View>
        
                <Text style={Styles.fieldLabel}>Price</Text>
                <View style={Styles.pickerContainer}>
                    <Picker style={Styles.picker} 
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
        
                <Text style={Styles.fieldLabel}>Rating</Text>
                <View style={Styles.pickerContainer}>
                    <Picker style={Styles.picker} 
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

const RestaurantsScreen = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen name="ListScreen" component={RestaurantListScreen} options={{title: 'Restaurants'}} />
        <Stack.Screen name="AddScreen" component={RestaurantAddScreen} options={{title: 'Add Restaurant'}} />
        </Stack.Navigator>
    );
};

exports.RestaurantsScreen = RestaurantsScreen;
