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

const DecisionScreen = () => {
    return <View style={styles.container}><Text>This is Decision Screen</Text></View>;
}

exports.DecisionScreen = DecisionScreen;