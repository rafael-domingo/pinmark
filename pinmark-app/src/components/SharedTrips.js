import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBBtn, MDBCardFooter, MDBCardSubTitle } from 'mdb-react-ui-kit';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripViewModal from '../modals/TripViewModal';
import { removeShared } from '../redux/sharedSlice';
import { fetchUserInfo, getTrip, updatedSharedTrips } from '../util/Firebase';

function SharedTrips({handlePinmarkDetail}) {
    const sharedTripsState = useSelector((state) => state.sharedTrips.shared);
    const userState = useSelector((state) => state.user);
    const [showModal, setShowModal] = React.useState(false);
    const [modalInfo, setModalInfo] = React.useState({});
    const [firebaseUsers, setFirebaseUsers] = React.useState([]);
    const [filteredSharedTrips, setFilteredSharedTrips] = React.useState([]);
    const [confirmationModal, setConfirmationModal] = React.useState(false);
    const dispatch = useDispatch();

    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        width: '100%',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 200,
        
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

    React.useEffect(() => {
        fetchUserInfo()
        .then(result => {
            setFirebaseUsers(result);
        })
    }, [0])

    React.useEffect(() => {
        console.log('refresh')
        var filteredTrips = [];
        sharedTripsState.map((trip) => {
            if (trip.receivingUserId === userState.uid) {
                filteredTrips.push(trip);
            }
        })
        setFilteredSharedTrips(filteredTrips);
    }, [sharedTripsState])

    const handleTripView = (tripObject) => {
        getTrip(tripObject).then((result) => {
            // sort through sendingUser pinmarks to create tripView
            console.log(result);
            var pinmarkArray = [];
            result.pinmark?.pinmarks?.map((pinmark) => {
                if (pinmark.tripIds.includes(tripObject.tripId)) {
                    pinmarkArray.push(pinmark);
                }
            })    
            var tripObj = {
                trip: tripObject,
                pinmarks: pinmarkArray
            }
            console.log(tripObj);
            setModalInfo(tripObj);
            if (!showModal) {
                setShowModal(true);
            }
        })
    }

    const handleCloseTripModal= () => {
        setModalInfo({});
        setShowModal(false);
    }

    const handleRemoveTripFromSharedModal = () => {
        setConfirmationModal(true);        
    }

    const handleRemoveTripFromShared = () => {
        dispatch(removeShared({
            tripId: modalInfo.trip.tripId,
            receivingUserId: modalInfo.trip.receivingUserId
        }))
        setConfirmationModal(false);
        handleCloseTripModal();
    }
   
    const handleDetail = (pinmark) => {
        console.log(pinmark);
        const newObject = {
            place_id: pinmark.pinmarkId
        }
        handlePinmarkDetail(newObject);
    }

    React.useEffect(() => {
        updatedSharedTrips(sharedTripsState);
    }, [confirmationModal])

    if (filteredSharedTrips.length > 0) {
        return (
            <div style={containerDivStyle}>
                {
                    filteredSharedTrips.slice(0).reverse().map((trip) => {
                        console.log(trip)
                        if (trip.receivingUserId === userState.uid) {
                            return (
                                <MDBCard 
                                    style={cardDivStyle} 
                                    background='dark'
                                    onClick={() => handleTripView(trip)}
                                    >
                                    <MDBCardBody className='d-flex justify-content-center align-items-center flex-wrap'>
                                        <MDBCardTitle>{trip.tripName}</MDBCardTitle>
                                        <MDBCardSubTitle>{trip.location.city}</MDBCardSubTitle>
                                        {
                                            firebaseUsers.map((user) => {
                                                if (user.uid === trip.sendingUserId) {
                                                    return (<p style={{fontSize: 10, width: '100%'}} className='text-muted'>Shared by {user?.userName}</p>)                                            
                                                }
                                            })
                                        }                                   
                                    </MDBCardBody>                             
                                </MDBCard>
                            )
                        }
                    })
                }
                <MDBModal show={showModal} setShow={setShowModal} className='text-dark'>
                    <MDBModalDialog 
                        size='fullscreen' 
                        centered
                        scrollable
                        className='justify-content-center align-item-center'
                        >
                        <MDBModalContent>
                            <TripViewModal 
                                tripObject={modalInfo}
                                tripViewModal={showModal}
                                handleCloseModal={handleCloseTripModal}      
                                handleDeleteTrip={handleRemoveTripFromSharedModal}
                                handlePinmarkDetail={handleDetail}         
                                sharedView={true}    
                                firebaseUsers={firebaseUsers}         
                            />
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
    
                <MDBModal staticBackdrop show={confirmationModal} setShow={setConfirmationModal} className='text-dark'>
                    <MDBModalDialog
                        centered
                        scrollable
                        className='justify-content-center align-item-center'
                        >
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Remove Trip from 'Shared With You'?</MDBModalTitle>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <p>Are you sure you want to stop this trip from being shared with you?</p>
                                    <p className='text-muted' style={{fontSize: 15}}>This does not delete the trip. The person who shared this with you will still have this trip in their account.</p>
                                </MDBModalBody>
                                <MDBModalFooter>
                                    <MDBBtn
                                        onClick={() => {
                                            setConfirmationModal(false)
                                            setShowModal(true)
                                        }}
                                        color='lilnk'
                                        >
                                        Cancel
                                    </MDBBtn>
                                    <MDBBtn
                                        // style={{width: '100%'}}
                                        onClick={() => handleRemoveTripFromShared()}
                                        color='danger'
                                        >
                                        Remove
                                    </MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </div>
        )
    } else {
        return (
            <div style={{padding: 20}}>
                <MDBCard background='light' className='text-dark'>
                    <MDBCardBody>
                        No one has shared a trip with you yet.
                    </MDBCardBody>                    
                </MDBCard>
            </div>
        )
    }
    
}

export default SharedTrips;