import React, { Component } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View } from 'react-native';
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

class RestaurantsScreen extends Component { 
    constructor(props) {
      super(props);
      this.state = { inText: "" }
    }

    render() {
      return (
    
        <View style={styles.container}>
            <Text>This is Restaurants Screen - {this.state.inText} </Text>
            <CustomButton text="Hello" onPress={ () => {console.log("botton clicked")} } />
            <CustomTextInput label="Label" stateHolder={this} stateFieldName="inText" />
        </View>
      );  
    }
}

exports.RestaurantsScreen = RestaurantsScreen;