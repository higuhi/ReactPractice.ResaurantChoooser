import React, { Component, useState } from 'react';
import { Constants } from "expo";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch, Alert, ScrollView, Picker, Modal, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Store from "react-native-fs-store";

import CustomButton from "../components/CustomButton";


const Stack = createStackNavigator();

const Storage = new Store('Default');

let _participants = null;
let _filteredRestaurants = null;
let _chosenRestaurant = null;

const Styles = StyleSheet.create({
	decisionTimeScreenContainer : {
		flex : 1,
		alignItems : "center",
		justifyContent : "center"
	},

	decisionTimeScreenTouchable : {
		alignItems : "center",
		justifyContent : "center"
	},

	listScreenContainer : {
		flex : 1,
		alignItems : "center",
		justifyContent : "center",
	},

	whosGoingHeadline : {
		fontSize : 30,
		marginTop : 20,
		marginBottom : 20
	},

	whosGoingItemTouchable : {
		flexDirection : "row",
		marginTop : 10,
		marginBottom : 10
	},

	whosGoingCheckbox : {
		marginRight : 20
	},

	whosGoingName : {
		flex : 1
	},

	preFiltersContainer : {
		marginTop : 10
	},

	preFiltersInnerContainer : {
		flex : 1,
		alignItems : "center",
		paddingTop : 20,
		width : "100%"
	},

	preFiltersScreenFormContainer : {
		width : "96%"
	},

	preFiltersHeadlineContainer : {
		flex : 1,
		alignItems : "center",
		justifyContent : "center"
	},

	preFiltersHeadline : {
		fontSize : 30,
		marginTop : 20,
		marginBottom : 20
	},

	fieldLabel : {
		marginLeft : 10
	},

	pickerContainer : {
		...Platform.select({
			ios : { },
			android : {
				width : "96%",
				borderRadius : 8,
				borderColor : "#c0c0c0",
				borderWidth : 2,
				marginLeft : 10,
				marginBottom : 20,
				marginTop : 4
			}
		})
	},

	picker : {
		...Platform.select({
			ios : {
				width : "96%",
				borderRadius : 8,
				borderColor : "#c0c0c0",
				borderWidth : 2,
				marginLeft : 10,
				marginBottom : 20,
				marginTop : 4
			},
			android : { }
		})
	},

	selectedContainer: {
		flex : 1,
		justifyContent : "center"
	},

	selectedInnerContainer: {
		alignItems : "center"
	},

	selectedName : {
		fontSize : 32
	},

	selectedDetails : {
		paddingTop : 80,
		paddingBottom : 80,
		alignItems : "center"
	},

	selectedDetailsLine : {
		fontSize : 18
	},

	vetoContainer: {
		flex : 1,
		justifyContent : "center"
	},

	vetoContainerInner: {
		justifyContent : "center",
		alignItems : "center",
		alignContent : "center"
	},

	vetoHeadlineContainer : {
		paddingBottom : 40
	},

	vetoHeadline : {
		fontSize : 32,
		fontWeight : "bold"
	},

	vetoScrollViewContainer : {
		height : "50%"
	},

	vetoParticipantContainer : {
		paddingTop : 20,
		paddingBottom : 20
	},

	vetoParticipantName : {
		fontSize : 24
	},

	vetoButtonContainer : {
		width : "100%",
		alignItems : "center",
		paddingTop : 40
	},

	choiceScreenHeadline : {
		fontSize : 30,
		marginTop : 20,
		marginBottom : 20
	},

	choiceScreenListContainer : {
		width : "94%"
	},

	choiceScreenListItem : {
		flexDirection : "row",
		marginTop : 4,
		marginBottom : 4,
		borderColor : "#e0e0e0",
		borderBottomWidth : 2,
		alignItems : "center"
	},

	choiceScreenListItemName : {
		flex : 1
	},

	postChoiceScreenContainer : {
		flex : 1,
		justifyContent : "center",
		alignItems : "center",
		alignContent : "center",
	},

	postChoiceHeadline : {
		fontSize : 32,
		paddingBottom : 80
	},

	postChoiceDetailsContainer : {
		borderWidth : 2,
		borderColor : "#000000",
		padding : 10,
		width : "96%"
	},

	postChoiceDetailsRowContainer : {
		flexDirection : "row",
		justifyContent : "flex-start",
		alignItems : "flex-start",
		alignContent : "flex-start"
	},

	postChoiceDetailsLabel : {
		width : 70,
		fontWeight : "bold",
		color : "#ff0000"
	},

	postChoiceDetailsValue : {
		width : 300
	}
});

const getRandom = (inMin, inMax) => {
	inMin = Math.ceil(inMin);
	inMax = Math.floor(inMax);
	return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};

const StartScreen = ({navigation}) => {
	const [peopleCount, setPeopleCount] = useState(0);
	const [restaurantCount, setRestaurantCount] = useState(0);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			let peopleCount = 0, restaurantCount = 0;
			try {
				const val = await Storage.getItem('people');
				peopleCount = (val==null) ? 0 : JSON.parse(val).length;
			} catch(error) {
				console.log('WARN: StartScreen Hook: something went wrong while reading people');
			}
	
			try {
				const val = await Storage.getItem('restaurants');
				restaurantCount = (val==null) ? 0 : JSON.parse(val).length;
			} catch(error) {
				console.log('WARN: StartScreen Hook: something went wrong while reading restaurant');
			}
	
			setPeopleCount(peopleCount);
			setRestaurantCount(restaurantCount);
	
			console.log(`StartScreen Hook: got ${peopleCount} items from people`);
			console.log(`StartScreen Hook: got ${restaurantCount} items from restaurant`);
		});
		return unsubscribe;
	}, [navigation]);	

	console.log(`peopleCount=${peopleCount} & restaurantCount=${restaurantCount}`);

	let message;
	if(peopleCount===0) {
		message = <Text>Please add your friends</Text>;
	} else if(restaurantCount===0) {
		message = <Text>Please add restaurants</Text>;
	} else {
		message = (
			<TouchableOpacity style={Styles.decisionTimeScreenTouchable} 
				onPress={ () => navigation.navigate("PeopleSelectionScreen") }
			>
				<Text>Tap here to get started!!</Text>
			</TouchableOpacity>
		);
	}

	return (
		<View style={Styles.decisionTimeScreenContainer}>
			{message}
		</View>
	);
};

const PeopleSectionScreen = ({navigation}) => {
	const [people, setPeople] = useState([]);
	const [peopleSelected, setPeopleSelected] = useState({});

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			let people = [];
			try {
				const val = await Storage.getItem('people');
				people = (val==null) ? [] : JSON.parse(val);
			} catch(error) {
				console.log('WARN: PeopleSectionScreen Hook: something went wrong while reading people');
			}
		
			setPeople(people);
	
			console.log(`PeopleSectionScreen Hook: got ${people.length} items from people`);
		});
		return unsubscribe;
	}, [navigation]);	

	return (
		<View style={Styles.listScreenContainer}>
			<Text style={Styles.whosGoingHeadline}>Who's Going?</Text>
			<FlatList style={{width : "94%"}} 
				data={people}
        		renderItem={ ({item}) => {
          			return (
					  	<TouchableOpacity
							style={Styles.whosGoingItemTouchable}
							onPress={ () => {
								const selected = { ...peopleSelected };
								selected[item.key] = !selected[item.key];
								setPeopleSelected(selected);
							} }
						>
						<Switch style={Styles.whosGoingCheckbox}
							value={peopleSelected[item.key]}
							onValueChange={ () => {
								const selected = { ...peopleSelected };
								selected[item.key] = !selected[item.key];
								setPeopleSelected(selected);
							} }
						/>
						<Text style={Styles.whosGoingName}>
							{item.name} 
						</Text>
						</TouchableOpacity>
					  );
				}}
      		/>
			<CustomButton text="Next"
        		onPress={ () => {
					_participants = [ ];
					for (const p of people) {
						if (peopleSelected[p.key]) {
							const participant = {...p};
							participant.vetoed = "no";
							_participants.push(participant);
						}
					}
					if (_participants.length === 0) {
						Alert.alert("Need 1 or more friends",
							"You didn't select anyone to go. Wanna give it another try?",
							[ { text : "OK" } ], { cancelable : false }
						);
					} else {
						navigation.navigate("RestaurantSelectionScreen");
					}
	        	} }
      		/>
		</View>
	);
};

const RestaurantSelectionScreen = ({navigation}) => {
	const [cuisine, setCuisine] = useState("");
	const [price, setPrice] = useState("");
	const [rating, setRating] = useState("");
	const [restaurants, setRestaurants] = useState([]);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			let restaurant = [];
			try {
				const val = await Storage.getItem('restaurants');
				restaurant = (val==null) ? [] : JSON.parse(val);
			} catch(error) {
				console.log('WARN: RestaurantSelectionScreen Hook: something went wrong while reading people');
			}
		
			setRestaurants(restaurant);
	
			console.log(`RestaurantSelectionScreen Hook: got ${restaurant.length} items from restaurant`);
		});
		return unsubscribe;
	}, [navigation]);	

	return (
		<ScrollView style={Styles.preFiltersContainer}>
			<View style={Styles.preFiltersInnerContainer}>
				<View style={Styles.preFiltersScreenFormContainer}>
					<View style={Styles.preFiltersHeadlineContainer}>
						<Text style={Styles.preFiltersHeadline}>Pre-Filters</Text>
					</View>

					<Text style={Styles.fieldLabel}>Cuisine</Text>
					  <View style={Styles.pickerContainer}>
						<Picker style={Styles.picker} selectedValue={cuisine}
								prompt="Cuisine"
								onValueChange={ (inItemValue) => setCuisine(inItemValue) } >
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
								selectedValue={price}
								onValueChange={ (inItemValue)=> setPrice(inItemValue) }>
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
								selectedValue={rating}
								onValueChange={ (inItemValue)=> setRating(inItemValue) }>
							<Picker.Item label="" value=""/>
							<Picker.Item label="★" value="★"/>
							<Picker.Item label="★★" value="★★"/>
							<Picker.Item label="★★★" value="★★★"/>
						</Picker>
					</View>

					<CustomButton text="Next"
						onPress={ () => {
							_filteredRestaurants = [];
							for(const r of restaurants) {
								let filtered = false;

								if(cuisine!=="") {
									if(r.cuisine!==cuisine) {
										filtered = true;
									}
								}
								if(price!=="") {
									if(r.price>price) {
										filtered = true;
									}
								}
								if(rating!=="") {
									if(r.rating<rating) {
										filtered = true;
									}
								}
								
								if(!filtered) {
									_filteredRestaurants.push(r);
								}							
							}

							if (_filteredRestaurants.length === 0) {
								Alert.alert("No suggestion found",
									"None of your restaurants match these criteria. Maybe " +
									"try loosening them up a bit?",
									[ { text : "OK" } ], { cancelable : false }
								);
							} else {
								navigation.navigate("ChoiceScreen");
							}

						} } 
					/>
				</View>
			</View>
		</ScrollView>
	);
};

const ChoiceScreen = ({navigation}) => {
	const [participants, setParticipants] = useState(_participants);
	const [chosenRestaurant, setChosenRestaurant] = useState(null);
	const [selectedVisible, setSelectedVisible] = useState(false);
	const [vetoVisible, setVetoVisible] = useState(false);
	const [vetoDisabled, setVetoDisabled] = useState(false);
	const [vetoButtonText, setVetoButtonText] = useState("Veto");

	const modalSelected = (chosenRestaurant===null) ? null : ( 
			<Modal
				presentationStyle={"formSheet"} 
				visible={selectedVisible} 
				animationType={"slide"} 
				onRequestClose={ () => { } } 
			>
				<View style={Styles.selectedContainer}>
					<View style={Styles.selectedInnerContainer}>
						<Text style={Styles.selectedName}>{chosenRestaurant.name}</Text>
						<View style={Styles.selectedDetails}>
						<Text style={Styles.selectedDetailsLine}>
							This is a {chosenRestaurant.rating} star
						</Text>
						<Text style={Styles.selectedDetailsLine}>
							{chosenRestaurant.cuisine} restaurant
						</Text>
						<Text style={Styles.selectedDetailsLine}>
							with a price rating of {chosenRestaurant.price}
						</Text>
						</View>
						<CustomButton text="Accept"
							onPress={ () => {
								setSelectedVisible(false);
								setVetoVisible(false);
								_chosenRestaurant = chosenRestaurant;
								navigation.navigate("PostChoiceScreen");
							} }
						/>
						<CustomButton text={(_filteredRestaurants.length === 1) ? "This is the last option" : vetoButtonText}
							disabled={vetoDisabled ? "true" : ((_filteredRestaurants.length === 1) ? "true" : "false") }
							onPress={ () => {
								setSelectedVisible(false);
								setVetoVisible(true);
							} }
						/>
					</View>
				</View>
			</Modal>
		);

		const modalVeto = (chosenRestaurant===null) ? null : ( 
			<Modal
				presentationStyle={"formSheet"}
				visible={vetoVisible}
				animationType={"slide"}
				onRequestClose={ () => { } }
			>
				<View style={Styles.vetoContainer}>
					<View style={Styles.vetoContainerInner}>
						<Text style={Styles.vetoHeadline}>Who's vetoing?</Text>
						<ScrollView style={Styles.vetoScrollViewContainer}>
						{ 
							participants.map((inValue) => {
								if (inValue.vetoed === "no") {
									return (
										<TouchableOpacity key={inValue.key}
											style={ Styles.vetoParticipantContainer }
											onPress={ () => {
												// Mark the vetoer as having vetoed.
												for (const p of participants) {
													if (p.key === inValue.key) {
														p.vetoed = "yes";
														break;
													}
												}
												// Make sure there's still at least one person that
												// can veto, otherwise disable the Veto button.
												let vetoStillAvailable = false;
												let vetoButtonText = "No Vetoes Left";
												for (const p of participants) {
													if (p.vetoed === "no") {
														vetoStillAvailable = true;
														vetoButtonText = "Veto"
														break;
													}
												}
												// Delete the vetoed restaurant.
												for (let i = 0; i < _filteredRestaurants.length; i++) {
													if (_filteredRestaurants[i].key === chosenRestaurant.key) {
														_filteredRestaurants.splice(i, 1);
														break;
													}
												}

												// Update state.
												const participantsNew = participants.slice();
												setParticipants(participantsNew);
												setSelectedVisible(false);
												setVetoVisible(false);
												setVetoDisabled(!vetoStillAvailable);
												setVetoButtonText(vetoButtonText);

											} }
										>
											<Text style={Styles.vetoParticipantName}>
												{inValue.name}
											</Text>
										</TouchableOpacity>
									);
								}
							})
						}
						</ScrollView>
						<View style={Styles.vetoButtonContainer}>
						<CustomButton
							text="Never Mind"
							width="94%"
							onPress={ () => {
								setSelectedVisible(true);
								setVetoVisible(false);
							} }
						/>
						</View>
					</View>
				</View>
			</Modal>
		);

	return (
		<View style={Styles.listScreenContainer}>

			{modalSelected}

			{modalVeto}

			<Text style={Styles.choiceScreenHeadline}>Choice Screen</Text>
			<FlatList
				style={Styles.choiceScreenListContainer}
				data={participants}
				
				renderItem={ ({item}) => {
					return (
						<View style={Styles.choiceScreenListItem}>
							<Text style={Styles.choiceScreenListItemName}>{item.name} </Text>
							<Text>Vetoed: {item.vetoed}</Text>
						</View>
					);
				}}
			/>
			<CustomButton
				text="Randomly Choose"
				width="94%"
				onPress={ () => {
					// Randomly pick one.
					const selectedNumber = getRandom(0, _filteredRestaurants.length - 1);
					// Get the restaurant descriptor.
					setChosenRestaurant(_filteredRestaurants[selectedNumber])
					// Show the selected modal
					setSelectedVisible(true);
				} }
			/>
		</View>
	);
};

const PostChoiceScreen = ({navigation}) => {
	return (
		<View style={Styles.postChoiceScreenContainer}>

			<View>
				<Text style={Styles.postChoiceHeadline}>Enjoy your meal!</Text>
			</View>

			<View style={Styles.postChoiceDetailsContainer}>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Name:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.name}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Cuisine:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.cuisine}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Price:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.price}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Rating:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.rating}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Phone:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.phone}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Address:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.address}
					</Text>
				</View>

				<View style={Styles.postChoiceDetailsRowContainer}>
					<Text style={Styles.postChoiceDetailsLabel}>Web Site:</Text>
					<Text style={Styles.postChoiceDetailsValue}>
						{_chosenRestaurant.webSite}
					</Text>
				</View>
			</View>

			<View style={{ paddingTop:80}}>
				<Button
					title="All Done"
					onPress={ () => navigation.navigate("StartScreen") }
				/>
			</View>

    	</View>
	);
};

const DecisionScreen = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="StartScreen" component={StartScreen} options={{title: 'Let\'s get out!!'}} />
			<Stack.Screen name="PeopleSelectionScreen" component={PeopleSectionScreen} options={{title: 'Who is going?'}} />
			<Stack.Screen name="RestaurantSelectionScreen" component={RestaurantSelectionScreen} options={{title: 'Where do you want to go?'}} />
			<Stack.Screen name="ChoiceScreen" component={ChoiceScreen} options={{title: 'How about this?'}} />
			<Stack.Screen name="PostChoiceScreen" component={PostChoiceScreen} options={{title: 'Enjoy your meal!'}} />
		</Stack.Navigator>
	);
};

exports.DecisionScreen = DecisionScreen;
