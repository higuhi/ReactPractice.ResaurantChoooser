import React, { Component } from 'react';
import { View, FlatList, Text, Alert} from "react-native";
import { Root } from "native-base";
import PropTypes from 'prop-types'
import CustomButton from '../components/CustomButton.js';


export default class ListScreen extends Component { 
    constructor(props) {
        super(props);
        this.state = { listData: [] };
        this.updateList = this.updateList.bind(this);
        this.removeFromList = this.removeFromList.bind(this);
        this._unsubscribe = null;
    }
  
    /**
     * Read the storage and update the list in the state asynchronously. 
     */
    async updateList() {
        const { storeName, store } = this.props;

        try {
            console.log(`updateList: Getting items from ${storeName}`);
            const val = await store.getItem(storeName);
            this.setState({listData: (val==null) ? [] : JSON.parse(val)})
        } catch(error) {
            console.log(`WARN: updateList: something went wrong while reading ${storeName}`);
            this.setState({listData: []});
        }
    }
  
    /**
     * Remove the item specified by the key from the storage. 
     * If updateAfter is True, then this function will call updateList(). 
     * @param key the key of item to be removed
     * @param updateAfter updates the list after removal if true
     */
    async removeFromList(key, updateAfter=true) {
        const { storeName, store } = this.props;

        let val; 
        try {
            console.log(`removeFromList: Getting items from ${storeName}`);
            val = await store.getItem(storeName);
        } catch(error) {
            console.log(`WARN: removeFromList: something went wrong while reading ${storeName}`);
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
            console.log(`removeFromList: Updating the items in ${storeName}`);
            await store.setItem(storeName, JSON.stringify(lists));
        } catch(error) {
            console.log(`removeFromList: Something went wrong while updating items in ${storeName}`);
        }
    
        if(updateAfter) {
            this.updateList();
        }
    }  
  
    /**
     * At mount, this compoenent will add a listener to the 'focus' navication. 
     */
    componentDidMount() {
      this.updateList();
      this._unsubscribe = this.props.navigation.addListener('focus', (e) => {
        console.log("NavigationListener on focus is triggered");  
        this.updateList();
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
                <View style={this.props.styles.listScreenContainer}> 

                    {this.props.children}
                    
                    <FlatList style={this.props.styles.listContainer} 
                        data={this.state.listData} 
                        renderItem={ (item) => {
                        return (
                            <View style={this.props.styles.itemContainer} >
                                <Text style={this.props.styles.itemName}>{item.index} {item.item.name}</Text>   
                                <CustomButton text="Delete" onPress={ () => {
                                    Alert.alert(
                                        "Please confirm", 
                                        "Are you sure you want to delete this restaurant",
                                        [
                                            {text: "Yes", onPress: () => {this.removeFromList(item.item.key)}},
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

ListScreen.propTypes = {
    storeName: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    styles: PropTypes.object,
};

/* For styles, following properties are used 
listScreenContainer: {},
listContainer: {},
itemContainer: {},
itemName: {}
*/