import React, { Component } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CustomButton from '../components/CustomButton.js';
import CustomTextInput from '../components/CustomTextInput.js';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

class ListScreen extends Component { 
    constructor(props) {
      super(props);
      this.state = { inText: "" }
    }

    render() {
      return (
    
        <View style={styles.container}>
            <Text>This is Restaurants Screen (List) - {this.state.inText} </Text>
            <CustomButton text="Hello" onPress={ () => {console.log("botton clicked")} } />
            <CustomTextInput label="Label" stateHolder={this} stateFieldName="inText" />
        </View>
      );  
    }
}

class AddScreen extends Component { 
  constructor(props) {
    super(props);
    this.state = { inText: "" }
  }

  render() {
    return (
  
      <View style={styles.container}>
          <Text>This is Restaurants Screen (Add) - {this.state.inText} </Text>
          <CustomButton text="Hoge" onPress={ () => {console.log("botton clicked")} } />
          <CustomTextInput label="Label" stateHolder={this} stateFieldName="inText" />
      </View>
    );  
  }
}


const Stack = createStackNavigator();

const RestaurantsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Add" component={AddScreen} />
    </Stack.Navigator>
  );
};

exports.RestaurantsScreen = RestaurantsScreen;