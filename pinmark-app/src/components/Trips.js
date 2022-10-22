import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBRow } from 'mdb-react-ui-kit';
import React from 'react';
import { useSelector } from 'react-redux';
import { 
    MDBCol,
    MDBCardImage,
    MDBCardFooter,
    MDBBtn
} from 'mdb-react-ui-kit'
function Trips() {
    const locationState = useSelector((state) => state.pinmark.locations);
    const pinmarkState = useSelector((state) => state.pinmark.pinmarks);
    const tripsState = useSelector((state) => state.pinmark.tripLists);
    const [showModal, setShowModal] = React.useState(false);
    const [modalInfo, setModalInfo] = React.useState([]);

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
        // border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 150,
        overflow: 'hidden',
        flex: '0 0 auto' // keeps size of box constant
    }

    const handleTripView = (trip) => {
        console.log(trip);
        var pinmarkArray = [];        
        pinmarkState.map((pinmark) => {
            if (pinmark.tripIds.includes(trip.tripId)) {
                pinmarkArray.push(pinmark);
            } 
        })
        var tripObject = {
            trip: trip,
            pinmarks: pinmarkArray 
        };
        console.log(tripObject);
        setModalInfo(tripObject);
        setShowModal(true);
    }

    return (
        <div style={containerDivStyle}>
        {
            tripsState.slice(0).reverse().map((trip) => {
                var city = '';
                var state = '';
                var country = '';
                locationState.map((location) => {
                    if (location.locationId === trip.locationId) {
                        city = location.city;
                        state = location.state;
                        country = location.country;
                    }
                })
                console.log(trip);
                if (trip.color === undefined) {
                    return (
                        <MDBCard onClick={() => handleTripView(trip)} background='primary' style={cardDivStyle}>
                            <MDBCardBody>
                                <MDBCardTitle>{trip.tripName}</MDBCardTitle>
                                <MDBCardText>{city}</MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    )
                    
                } else {
                    return (
                        <MDBCard onClick={() => handleTripView(trip)} background={trip.color} style={cardDivStyle}>
                            <MDBCardBody className='text-white'>
                                <MDBCardTitle>{trip.tripName}</MDBCardTitle>
                                <MDBCardText>{city}</MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    )
                    
                }
            })
        }  
        <MDBModal show={showModal} setShow={setShowModal}>
            <MDBModalDialog size='fullscreen' centered scrollable className='justify-content-center align-item-center'>
                <MDBModalContent>
                    <MDBModalHeader>
                        {modalInfo.trip?.tripName}
                        <MDBBtn color='link'>View Location</MDBBtn>
                        <MDBBtn onClick={() => setShowModal(false)}>Close</MDBBtn>                        
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow>
                            {
                                modalInfo?.pinmarks?.map((pinmark) => {
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
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>

        </div>
    )
}

export default Trips;