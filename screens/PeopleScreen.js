import React, { Component } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View, FlatList, ScrollView, Picker, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
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

const PeopleListScreen = (props) => {
    return (
        <ListScreen store={Storage} storeName='people' navigation={props.navigation} styles={styles}> 
          <CustomButton text="Add Friend" width="80%" onPress={ () => { props.navigation.navigate("AddScreen"); } } />
        </ListScreen>
    );
};

class PeopleAddScreen extends Component { 
    
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            phone: "",
            email: "",
            key: `r_${new Date().getTime()}`  
        };
    }

    render() {
        return (
            <AddScreen store={Storage} storeName='people' navigation={this.props.navigation} stateHolder={this} styles={styles}> 
                <View style={styles.addScreenInnerContainer}>                
                  <CustomTextInput label="Name" maxLength={20} stateHolder={this} stateFieldName="name" />
                  <CustomTextInput label="Phone" maxLength={20} stateHolder={this} stateFieldName="phone" />
                  <CustomTextInput label="E-mail" maxLength={20} stateHolder={this} stateFieldName="email" />
                </View>        
            </AddScreen>
        );  
    }
}


const Stack = createStackNavigator();

const PeopleScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ListScreen" component={PeopleListScreen} />
            <Stack.Screen name="AddScreen" component={PeopleAddScreen} />
        </Stack.Navigator>
    );
};

exports.PeopleScreen = PeopleScreen;