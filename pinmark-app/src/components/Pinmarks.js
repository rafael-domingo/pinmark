import { categoryArray } from "../assets/fakeData";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,    
    MDBCardImage,
    MDBCardOverlay   
} from 'mdb-react-ui-kit';

function Pinmarks() {
    const pinmarkState = useSelector((state) => state.pinmark.pinmarks);
    const dispatch = useDispatch();

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 200
    }

    const cardDivStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 150,
        overflow: 'hidden',
        flex: '0 0 auto' // keeps size of box constant
    }

    return (
        <div style={containerDivStyle}>
            {
                // reverse the pinmarkState array to get reverse chronological order of pinmarks
                pinmarkState.slice(0).reverse().map((pinmark) => {
                    return (
                        <MDBCard style={cardDivStyle}>
                            <MDBCardImage style={{width: '100%', height: '100%', objectFit: 'cover'}} overlay src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}  alt='location-image'/>
                            <MDBCardOverlay>
                                <MDBCardTitle>
                                    {pinmark.locationName}
                                </MDBCardTitle>
                                <MDBCardText>
                                    {pinmark.locationId.city}, {pinmark.locationId.state}
                                </MDBCardText>
                            </MDBCardOverlay>
                           
                        </MDBCard>
                    )
                })
            }
            {/* {
                categoryArray.map((category) => {
                    return (
                        <div style={categoryDivStyle}>
                            <p>{category}</p>
                        </div>
                    )
                })
            } */}
        </div>
    )
}

export default Pinmarks;