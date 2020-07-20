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

const PeopleScreen = () => {
    return <View style={styles.container}><Text>This is People Screen</Text></View>;
}

exports.PeopleScreen = PeopleScreen;