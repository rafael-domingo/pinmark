import React from 'react';
import { 
    MDBBtn, 
    MDBCol, 
    MDBModalBody, 
    MDBModalHeader, 
    MDBModal,
    MDBRow,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBCardFooter,
    MDBIcon,
    MDBModalTitle
} from 'mdb-react-ui-kit';

function TripViewModal({tripObject, handleCloseModal, handleDeleteTrip}) { 
    const ref = React.useRef();
    
    console.log(tripObject)
    // side effect to reset scroll to top when opening modal
    React.useEffect(() => {
        console.log(ref);
        ref.current.scrollTo(0,0);
    })   
    return (
        <>            
            <MDBModalHeader>
                <MDBModalTitle>{tripObject?.trip?.tripName}</MDBModalTitle>               
                <MDBBtn onClick={() => handleDeleteTrip(tripObject?.trip?.tripId)}  tag='a' color='none' className='m-1' style={{ color: 'gray', padding: 10}}><MDBIcon size='1x' icon='trash'/></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody ref={ref}>
                <MDBRow>
                    {
                        tripObject?.pinmarks?.map((pinmark) => {
                            return (
                                <MDBCol xxl={4} xl={4} l={4} md={4} className='mb-4'>
                                    <MDBCard className="h-100">
                                        <MDBCardImage style={{height: 250, objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} position='top' alt='...' />
                                        <MDBCardBody>
                                            <MDBCardTitle>{pinmark.locationName}</MDBCardTitle>
                                            <MDBCardText>{pinmark.address}</MDBCardText>
                                        </MDBCardBody>
                                        <MDBCardFooter>
                                            <MDBBtn>View</MDBBtn>
                                            <MDBBtn>Remove</MDBBtn>
                                        </MDBCardFooter>
                                    </MDBCard>
                                </MDBCol>
                            )
                        })
                    }
                </MDBRow>
            </MDBModalBody>
            <MDBBtn onClick={() => handleCloseModal()} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='times'/>
            </MDBBtn>  
        </>
    )
}

export default TripViewModal;