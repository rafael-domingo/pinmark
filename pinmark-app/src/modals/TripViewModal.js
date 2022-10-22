import React from 'react';
import { 
    MDBBtn, 
    MDBCol, 
    MDBModalBody, 
    MDBModalHeader, 
    MDBRow,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBCardFooter
} from 'mdb-react-ui-kit';

function TripViewModal({tripObject, handleCloseModal}) { 
    const ref = React.useRef();

    // side effect to reset scroll to top when opening modal
    React.useEffect(() => {
        ref.current.scrollTo(0,0);
    })   
    return (
        <>
            <MDBModalHeader>
                {tripObject?.trip?.tripName}
                <MDBBtn onClick={() => handleCloseModal()}>Close</MDBBtn>
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
        </>
    )
}

export default TripViewModal;