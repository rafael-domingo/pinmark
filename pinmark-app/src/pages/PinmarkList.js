import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Hero from "../components/Hero";
import List from "../components/List";

// list of pinmarks based on either location selection or category selection
function PinmarkList() {
    const { locationId } = useParams();
    const locationState = useSelector((state) => state.pinmark.locations);
    const pinmarkListState = useSelector((state) => state.pinmark.pinmarks);
    const [coffeeState, setCoffeeState] = useState();
    const [nightLifeState, setNightLifeState] = React.useState();
    const [foodState, setFoodState] = React.useState();
    const [lodgingState, setLodgingState] = React.useState();
    const [shoppingState, setShoppingState] = React.useState();
    const [touristAttractionState, setTouristAttractionState] = React.useState();

    console.log(pinmarkListState);
    console.log(`locationId: ${locationId}`);
    var pinmarkList = [];
    pinmarkListState.map((pinmark) => {
        if (pinmark.locationId.locationId === locationId) {
            pinmarkList.push(pinmark);
        }
    })      
    var locationObject = {};
    locationState.map((location) => {
        if (location.locationId === locationId ) {
            locationObject = {
                city: location.city,
                state: location.state,
                country: location.country,
                photo_reference: location.photo_reference                
            }
        }
    })   

    return (
        <div>
            {/* <Hero /> */}
            <h1>{locationObject.city}</h1>
            <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationObject.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
            {/* <List/> */}
            {
                pinmarkList.map((pinmark) => {
                    return (
                        <p>{pinmark.locationName}</p>
                    )
                    
                    
                })
            }
        </div>
    )
}

export default PinmarkList;