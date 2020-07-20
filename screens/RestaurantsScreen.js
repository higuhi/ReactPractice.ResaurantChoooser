import React from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const RestaurantsScreen = () => {
    return <View style={styles.container}><Text>This is Restaurants Screen</Text></View>;
}

exports.RestaurantsScreen = RestaurantsScreen;