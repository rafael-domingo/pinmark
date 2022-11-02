import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import React from 'react';
import { useSelector } from 'react-redux';

function SharedTrips() {
    const sharedTripsState = useSelector((state) => state.sharedTrips.shared);
    const userState = useSelector((state) => state.user);
   
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        width: '100%',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 200
    }

    const cardDivStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 150,
        overflow: 'hidden',
        flex: '0 0 auto' // keeps size of box constant
    }
   

    return (
        <div style={containerDivStyle}>
            {
                sharedTripsState.slice(0).reverse().map((trip) => {
                    if (trip.receivingUserId === userState.uid) {
                        return (
                            <MDBCard style={cardDivStyle} background='primary'>
                                <MDBCardBody>
                                    <MDBCardTitle>{trip.tripName}</MDBCardTitle>
                                    <MDBCardText>{trip.location.city}</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        )
                    }
                })
            }
        </div>
    )
}

export default SharedTrips;