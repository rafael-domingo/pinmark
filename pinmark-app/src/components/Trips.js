import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBRow } from 'mdb-react-ui-kit';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    MDBCol,
    MDBCardImage,
    MDBCardFooter,
    MDBBtn,
    MDBSpinner,
    MDBModalTitle,
    MDBModalFooter
} from 'mdb-react-ui-kit'
import TripViewModal from '../modals/TripViewModal';
import { deleteTripLists } from '../redux/pinmarkSlice';
function Trips({handlePinmarkDetail}) {
    const locationState = useSelector((state) => state.pinmark.locations);
    const pinmarkState = useSelector((state) => state.pinmark.pinmarks);
    const tripsState = useSelector((state) => state.pinmark.tripLists);
    const [showModal, setShowModal] = React.useState(false);
    const [modalInfo, setModalInfo] = React.useState([]);
    const [confirmationModal, setConfirmationModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

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

    const handleCloseTripModal = () => {
        setShowModal(false);
        setModalInfo([]);
    }

    const handleDeleteTripModal = (tripId) => {
        setConfirmationModal(true);
    }

    const handleDeleteTrip = () => {
        setLoading(true);
        setTimeout(() => {
            setConfirmationModal(false);
            setShowModal(false);
            dispatch(deleteTripLists(modalInfo.trip.tripId));
        }, 2000);
    }

    const handleDetail = (pinmark) => {
        // format input to handleShowDetails function
        const newObject = {
            place_id: pinmark.pinmarkId
        }
        handlePinmarkDetail(newObject);
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
                    <TripViewModal tripObject={modalInfo} handleCloseModal={handleCloseTripModal} handleDeleteTrip={handleDeleteTripModal} handlePinmarkDetail={handleDetail}/>                    
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
        {/* Delete Trip Confirmation */}
        <MDBModal staticBackdrop show={confirmationModal} setShow={setConfirmationModal}>
            <MDBModalDialog
                centered
                scrollable
                className="justify-content-center align-item-center"
                >
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Delete Trip?</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <p>Are you sure you want to delete this trip?</p>
                        <p className="text-muted">Only this trip will be deleted. Your pinmarks will remain in your Location page.</p>
                    </MDBModalBody>
                
                    <MDBModalFooter>
                        <MDBBtn onClick={() => {
                            setConfirmationModal(false)
                            setShowModal(true)                            
                            }} color='link'>Cancel</MDBBtn>
                        <MDBBtn style={{width: 100}} onClick={() => handleDeleteTrip()} color='danger'>
                            {!loading && (<>Delete</>)}
                            {loading && (<MDBSpinner size='sm' role='status'/>)}
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
        </div>                  
    )
}

export default Trips;