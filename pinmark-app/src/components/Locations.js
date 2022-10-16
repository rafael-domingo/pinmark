import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom'
import { locationArray } from "../assets/fakeData";
import Image from '../assets/los-angeles.jpeg';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,    
    MDBCardImage,
    MDBCardOverlay   
} from 'mdb-react-ui-kit';
function Locations() {
    const locationState = useSelector((state) => state.pinmark.locations);
    const dispatch = useDispatch();

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden'
    }

    const locationDivStyle = { 
        // display: 'flex',
        // flexWrap: 'wrap', 
        // justifyContent: 'center', 
        // alignItems: 'flex-end', 
        // border: 'solid 1px black', 
        margin: 20,
        width: 200,
        flex: '0 0 auto', // keeps size of box constant 
        overflow: 'hidden'
    }    

    return (
        <div style={containerDivStyle}>
            {
                locationState.map((location) => {
                    return (
                        <Link to={`/PinmarkList/${location.locationId}`}>
                            <MDBCard style={locationDivStyle}>
                                <MDBCardImage style={{width: '100%', height: '100%', objectFit: 'cover'}} overlay src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${location.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                                <MDBCardOverlay>
                                    <MDBCardTitle>
                                        {location.city}
                                    </MDBCardTitle>
                                    <MDBCardText>
                                        {location.state}, {location.country}                                    
                                    </MDBCardText>
                                </MDBCardOverlay>
                            </MDBCard>  
                        </Link>
                        
                    )
                })
            }            
        </div>
    )

}

export default Locations;