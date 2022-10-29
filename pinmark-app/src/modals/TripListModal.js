import React from 'react';
import { 
    MDBModalHeader,
    MDBModalTitle,
    MDBBtn,
    MDBModalBody,
    MDBListGroup,
    MDBListGroupItem,    
    MDBIcon,
    MDBRipple,
    MDBRow
} from 'mdb-react-ui-kit';
function TripListModal({tripList, setTripListModal, setCreateTripModal, handleSetTripView}) {

    return (
        <>
        <MDBModalHeader>
            <MDBModalTitle>Your Trips</MDBModalTitle>
            <MDBBtn color='link' onClick={() => {
                setCreateTripModal(true)
                setTripListModal(false)
                }}>
                <MDBIcon icon='plus'/> New Trip
            </MDBBtn>
        </MDBModalHeader>
        <MDBModalBody className="w-100 d-flex justify-content-center
        ">
            <MDBRow className="d-flex justify-content-between w-100">
            <MDBListGroup light>
                {
                    tripList.map((trip) => {
                    return (
                        <MDBRipple>
                        <MDBListGroupItem 
                            className='d-flex justify-content-between align-items-center'
                            link 
                            childTag="button" 
                            action 
                            noBorders
                            style={{padding: 20}}
                            onClick={() => {
                                handleSetTripView(trip)
                                setTripListModal(false)
                            }}
                            >
                            {trip.tripName}
                            <MDBBtn size='sm' rounded color='link'>
                                View
                            </MDBBtn>
                        </MDBListGroupItem>
                        </MDBRipple>
                    )       
                    })
                }                                                     
            </MDBListGroup>
            </MDBRow>
        </MDBModalBody>
        <MDBBtn
            onClick={() => setTripListModal(false)}
            size='lg'
            floating
            tag='a'
            style={{position: 'absolute', bottom: 30, right: 30, zIndex: 2}}
        >
            <MDBIcon fas icon='times'/>
        </MDBBtn>             
        </>
    )
}

export default TripListModal;