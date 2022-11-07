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
    MDBRow,    
} from 'mdb-react-ui-kit';
function PinmarkCards({
    pinmarkList, 
    category, 
    handleAddPinmark, 
    handlePinmarkDetail, 
    setCreateTripModal, 
    tripList, 
    tripView = false, 
    handleAddPinmarkToTrip,
    sharedView
}) {    
    const pinmarkCategories = ['coffee', 'night-life', 'food', 'lodging', 'shopping', 'tourist-attraction'];
    
    const colorArray = [        
        'secondary',
        'success',
        'danger',
        'warning',
        'info'
    ];
    return (
        <>
        {
            pinmarkList?.map((pinmark, index) => {                
                const colorPicker = index % colorArray.length;
                if ((pinmark.pinmarkCategory === category || category === 'all') || (!pinmarkCategories.includes(pinmark.pinmarkCategory) && category === 'other')) {
                    return (
                        <MDBCol key={pinmark.pinmarkId} xl={4} md={4} s={2} xs={2} className='mb-4'>
                            <MDBCard className='h-100 text-white' background={colorArray[colorPicker]}>
                                <MDBCardImage  style={{height: 250, objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} position='top' alt='...'/>
                                <MDBCardBody>
                                    <MDBCardTitle>{pinmark.locationName}</MDBCardTitle>
                                    <MDBCardText>{pinmark.address}</MDBCardText>
                                    <MDBRow className='d-flex justify-content-between align-items-start'>
                                    <MDBCol size={6}  style={{top: 0, left: -10, position: 'absolute', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>                                                        
                                        <MDBBtn color='link' onClick={() => handlePinmarkDetail(pinmark)}>
                                            <MDBIcon icon='info-circle' size='2x'/>
                                        </MDBBtn>
                                    </MDBCol>
                                    <MDBCol size={6} style={{top: 0, right: -10, position: 'absolute', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                                    {
                                        !tripView && (
                                            <MDBDropdown group className='shadow-0'>
                                            <MDBDropdownToggle className='d-flex justify-content-center align-items-center'>
                                                <MDBIcon icon='plus' tag='a' color='none' style={{color: 'white'}} />
                                                
                                            </MDBDropdownToggle>
                                            <MDBDropdownMenu style={{maxHeight: '50vh', overflowY: 'scroll'}}>
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
                                                <MDBDropdownItem onClick={() => setCreateTripModal(true)} link>Create New Trip</MDBDropdownItem>
                                            </MDBDropdownMenu>
                                            </MDBDropdown>
                                        )
                                    }
                                    </MDBCol>
                                    
                                    {
                                        tripView && !sharedView && (
                                            <MDBCol  size={6} style={{top: 0, right: -10, position: 'absolute', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                                            <MDBBtn color='link' onClick={() => {handleAddPinmarkToTrip(pinmark)}}>
                                                <MDBIcon size='2x' icon='minus-circle' tag='a' color='link'/>
                                            </MDBBtn>
                                            </MDBCol>
                                        )
                                    }
                                    
                                    </MDBRow>
                                   
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    )
                } 
                
                
                
            })
        }
        </>
    )
   
   
}

export default PinmarkCards;