import React, { Component } from 'react';
import { View, ScrollView, Text } from "react-native";
import PropTypes from 'prop-types'
import CustomButton from '../components/CustomButton.js';

export default class AddScreen extends Component { 
    constructor(props) {
        super(props);
        this.addToList = this.addToList.bind(this);
    }
  
    async addToList() {
        const { storeName, store, stateHolder, navigation } = this.props;
        const listScreenName = this.props.listScreenName ? this.props.listScreenName : "ListScreen";


        let val;
        try {
            console.log(`addToList: Getting items from ${storeName}`);
            val = await store.getItem(storeName);
        } catch(error) {
            console.log(`WARN: addToList: something went wrong while reading ${storeName}`);
        }

        val = (val==null) ? [] : JSON.parse(val)
        val.push(stateHolder.state);
  
        try {
            console.log(`addToList: Storing items in ${storeName}`);
            await store.setItem(storeName, JSON.stringify(val));
        } catch(error) {
            console.log(`WARN: addToList: something went wrong while adding to ${storeName}`);
        }
  
        navigation.navigate(listScreenName);
    }  
  
  
    render() {
        const listScreenName = this.props.listScreenName ? this.props.listScreenName : "ListScreen";

        return (
            <ScrollView style={this.props.styles.addScreenContainer}>
    
                {this.props.children}
    
                <View style={this.props.styles.addScreenFormContainer}>
                    <CustomButton text="Cancel" onPress={ () => { this.props.navigation.navigate(listScreenName) }} />
                    <CustomButton text="Save" onPress={ () => { this.addToList(); } } />
                </View>
    
            </ScrollView>
        );  
    }
}

AddScreen.propTypes = {
    storeName: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    stateHolder: PropTypes.object.isRequired,
    styles: PropTypes.object,
    listScreenName: PropTypes.string
};

/* For styles, following properties are used 
addScreenContainer: {},
addScreenFormContainer: {},
*/