import * as React from 'react';
import { Constants } from 'expo-status-bar';
import { StyleSheet, Image, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RestaurantsScreen } from './screens/RestaurantsScreen.js';
import { DecisionScreen } from './screens/DecisionScreen.js';
import { PeopleScreen } from './screens/PeopleScreen.js';

console.log("------------------------------------------------------------");
console.log(`RestaurantChooser starting on ${Platform.OS}`);

const platformOS = Platform.OS.toLowerCase();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
     <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let image = null;
            switch(route.name) {
              case "People":
                image = require("./images/icon-decision.png");
                break;
              case "Decision":
                image = require("./images/icon-people.png");
                break;
              case "Restaurant":
                image = require("./images/icon-restaurants.png");
                break;
            }
            
            if(image) {
              return <Image source={ image }
                            style={{ width : size, height : size, tintColor : color }} />
            } else {
              return null;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="People" component={PeopleScreen} />
        <Tab.Screen name="Decision" component={DecisionScreen} />
        <Tab.Screen name="Restaurant" component={RestaurantsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

