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
    MDBModalContent,
    MDBModalDialog,
    MDBModalTitle,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownToggle,
    MDBDropdownMenu
} from 'mdb-react-ui-kit';
import PinmarkCards from '../components/PinmarkCards';
import { Google } from '../util/Google';
import PinmarkModal from './PinmarkModal';
import { useSelector } from 'react-redux';

function TripViewModal({
    tripObject, 
    tripViewModal,
    handleCloseModal, 
    handleDeleteTrip, 
    handlePinmarkDetail, 
    handleDeletePinmarkFromTripModal, 
    handleShareTrip,
    firebaseUsers,
    // handleCheckSharedUsers,
    // sharedUsers

}) {        
    const ref = React.useRef();
    const tripListState = useSelector((state) => state.pinmark.tripLists);
    const sharedTripsState = useSelector((state) => state.sharedTrips.shared);
    const [sharedUsers, setSharedUsers] = React.useState([]);

    console.log(tripObject)
    // side effect to reset scroll to top when opening modal
    React.useEffect(() => {
        console.log(ref);
        ref.current.scrollTo(0,0);
        // handleCheckSharedUsers()
    }, [])   

    React.useEffect(() => {
        var userArray = [];
        var sharedWith = [];
        sharedTripsState.map((trip) => {
            if (trip?.tripId === tripObject.trip?.tripId) {
                sharedWith.push(trip.receivingUserId)
            }
        })
        firebaseUsers?.map((firebaseUser) => {
            sharedWith.map((user) => {
                if (user === firebaseUser.uid) {
                    userArray.push(firebaseUser)
                }
            })
        })      
        setSharedUsers(userArray);
    }, [sharedTripsState, tripViewModal, firebaseUsers])

    


    const handleDetail = (pinmark) => {
        handlePinmarkDetail(pinmark, false);
    }

    const handleDeletePinmarkFromTrip = (pinmark) => {
        console.log(tripObject.trip.tripId)
        handleDeletePinmarkFromTripModal(pinmark, tripObject.trip.tripId, false);
    }
    
    
    return (
        <>            
            {/* <MDBModal show={pinmarkDetailModal} setShow={setPinmarkDetailModal}>
                <MDBModalDialog 
                    // size='fullscreen-md-down'
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                    >
                    <MDBModalContent>
                        <PinmarkModal detailInfo={pinmarkDetailObject} handleCloseModal={handleClosePinmarkModal} handleDeletePinmark={() => {}}/>                       
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal> */}
            <MDBModalHeader>
                {/* <MDBRow className='d-flex justify-content-between align-items-center'> */}
                    <MDBCol size={8} className='d-flex justify-content-start align-items-center'>
                        <MDBModalTitle>{tripObject.trip?.tripName}</MDBModalTitle>               
                    </MDBCol>
                    <MDBCol size={4} className='d-flex justify-content-between align-items-center'>
                        <MDBDropdown className='btn-group'>                            
                        <MDBBtn onClick={() => handleShareTrip(tripObject.trip)} color='primary'><MDBIcon icon='user-friends'/>+</MDBBtn>
                        <MDBDropdownToggle color='primary' split></MDBDropdownToggle>
                        <MDBDropdownMenu >
                            <MDBDropdownItem header>Shared With</MDBDropdownItem>
                            {
                                sharedUsers?.map((user) => {
                                    return (
                                        <MDBDropdownItem link>
                                            {user.userName}
                                            {user.email}
                                        </MDBDropdownItem>
                                    )
                                })
                            }                                                        
                        </MDBDropdownMenu>
                        </MDBDropdown>  
                    <MDBBtn onClick={() => handleDeleteTrip(tripObject?.trip?.tripId)}  tag='a' color='none' className='m-1' style={{ color: 'gray', padding: 10}}><MDBIcon size='1x' icon='trash'/></MDBBtn>
                    </MDBCol>
                
                {/* </MDBRow> */}
            </MDBModalHeader>
            <MDBModalBody ref={ref}>
                <MDBRow>
                    <PinmarkCards 
                        pinmarkList={tripObject?.pinmarks} 
                        category={'all'} 
                        // handleAddPinmark={} 
                        handlePinmarkDetail={handleDetail} 
                        handleAddPinmarkToTrip={handleDeletePinmarkFromTrip}                        
                        // handleCreateTrip={() => {}} 
                        // tripList={[]} 
                        tripView={true}
                        />                    
                </MDBRow>
            </MDBModalBody>
            <MDBBtn onClick={() => handleCloseModal()} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='times'/>
            </MDBBtn>  
        </>
    )
}

export default TripViewModal;