import React from 'react';
import { 
    MDBCol,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,    
} from 'mdb-react-ui-kit';
function PinmarkCards({pinmarkList, handleAddPinmark, handlePinmarkDetail, handleCreateTrip, tripList}) {
    return (
        <>
        {
            pinmarkList.map((pinmark) => {
                return (
                    <MDBCol xl={4} md={4} s={2} xs={2} className='mb-4'>
                        <MDBCard className='h-100'>
                            <MDBCardImage  style={{height: 250, objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} position='top' alt='...'/>
                            <MDBCardBody>
                                <MDBCardTitle>{pinmark.locationName}</MDBCardTitle>
                                <MDBCardText>{pinmark.address}</MDBCardText>
                                <MDBBtn color='link' onClick={() => handlePinmarkDetail(pinmark)}>More Details</MDBBtn>
                                <MDBDropdown>
                                    <MDBDropdownToggle>Add To Trip</MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        {
                                            tripList.map((trip) => {
                                                return (
                                                    <MDBDropdownItem link childTag="button" onClick={() => {                                                            
                                                        if (pinmark.tripIds.includes(trip.tripId)) {
                                                            handleAddPinmark(pinmark, trip.tripId, false)
                                                        } else {
                                                            handleAddPinmark(pinmark, trip.tripId, true)}
                                                        }
                                                    }>
                                                        {pinmark.tripIds.includes(trip.tripId) && (<MDBIcon icon='check' />)}
                                                        {!pinmark.tripIds.includes(trip.tripId) && (<MDBIcon icon='plus' />)}                                                            
                                                        {trip.tripName}                                                                                                                            
                                                    </MDBDropdownItem>
                                                )
                                            })
                                        }
                                        <MDBDropdownItem divider/>
                                            <MDBDropdownItem onClick={() => handleCreateTrip()} link>Create New Trip</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                )
                
            })
        }
        </>
    )
   
   
}

export default PinmarkCards;