import { categoryArray } from "../assets/fakeData";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from '../assets/los-angeles.jpeg';

import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,    
    MDBCardImage,
    MDBCardOverlay,   
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBCardHeader,
    MDBModalTitle,
    MDBModalFooter,
    MDBBtn,
    MDBCardSubTitle,
    MDBBadge,
    MDBListGroup,
    MDBRow,
    MDBIcon,
    MDBCol,
    MDBListGroupItem,
    MDBModalBody,
    MDBModalHeader
} from 'mdb-react-ui-kit';
import { Google } from "../util/Google";
import PinmarkModal from "../modals/PinmarkModal";
import { deleteLocations, deletePinmark } from "../redux/pinmarkSlice";

function Pinmarks() {
    const pinmarkState = useSelector((state) => state.pinmark.pinmarks);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = React.useState(false);
    const [detailInfo, setDetailInfo] = React.useState({});
    const [confirmationModal, setConfirmationModal] = React.useState(false);

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 400
    }

    const cardDivStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 350,
        overflow: 'hidden',
        flex: '0 0 auto' // keeps size of box constant
    }

    const handleShowDetails = (pinmark) => {
        Google.placeDetails(pinmark.pinmarkId)
        .then(result => {
            console.log(result)
            const infoObject = {
                pinmark: pinmark,
                details: result,
                showDelete: true
            }
            console.log(infoObject)
            setDetailInfo(infoObject);
            setShowModal(true);
        })
        .catch((error) => console.log(error))        
        
    }   

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleDeletePinmarkModal = () => {
        setConfirmationModal(true);
        console.log(detailInfo)
    }

    const handleDeletePinmark = (pinmark) => {
        console.log(pinmark);
        var locationIdReference = '';
        var locationIdCount = 0;
        pinmarkState.map((pin) => {
            if (pinmark.pinmark.pinmarkId === pin.pinmarkId) {
                locationIdReference = pin.locationId.locationId;
            }
        })
        pinmarkState.map((pin) => {
            if(pin.locationId.locationId === locationIdReference) {
                locationIdCount++;
            }
        })
        console.log(locationIdReference)
        if (locationIdCount <= 1) {
            dispatch(deleteLocations(locationIdReference));
        }
        dispatch(deletePinmark(pinmark.pinmark.pinmarkId))
    }



    return (
        <div style={containerDivStyle}>
            {
                // reverse the pinmarkState array to get reverse chronological order of pinmarks
                pinmarkState.slice(0).reverse().slice(0,10).map((pinmark) => {
                     // put placeholder image in case image doesn't exist
                     if (pinmark.photoURL === undefined) {
                        var photo_reference = (
                            <MDBCardImage style={{width: '100%', height: '100%', objectFit: 'cover'}} overlay src={Image}/>
                        )
                    } else {
                        var photo_reference = (
                            <MDBCardImage style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5}} overlay src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                        )
                    }
                    return (
                        <MDBCard onClick={() => handleShowDetails(pinmark)} background="dark" style={cardDivStyle}>
                            {photo_reference}
                            <MDBCardOverlay>
                                <MDBCardTitle className="text-white">
                                    {pinmark.locationName}
                                </MDBCardTitle>
                                <MDBCardText className="text-white">
                                    {pinmark.locationId.city}, {pinmark.locationId.state}
                                </MDBCardText>
                            </MDBCardOverlay>
                           
                        </MDBCard>
                    )
                })
            }       
            <MDBModal show={showModal} setShow={setShowModal}>
                <MDBModalDialog size='fullscreen-md-down' centered scrollable className="justify-content-center align-item-center">
                    <MDBModalContent> 
                        <PinmarkModal detailInfo={detailInfo} handleCloseModal={handleCloseModal} handleDeletePinmark={handleDeletePinmarkModal}/>                        
                    </MDBModalContent>                  
                </MDBModalDialog>
            </MDBModal>

             {/* Delete Pinmark Confirmation */}
             <MDBModal staticBackdrop show={confirmationModal} setShow={setConfirmationModal}>
                <MDBModalDialog
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                    >
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Delete Pinmark?</MDBModalTitle>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Are you sure you want to delete this pinmark?</p>
                            <p className="text-muted">This will also remove the pinmark from any trips it's in.</p>
                        </MDBModalBody>
                    
                        <MDBModalFooter>
                            <MDBBtn onClick={() => {
                                setConfirmationModal(false)                                
                                }} color='link'>Cancel</MDBBtn>
                            <MDBBtn style={{width: 100}} onClick={() => {
                                handleDeletePinmark(detailInfo)
                                setConfirmationModal(false)                                
                                setShowModal(false)
                                }} color='danger'>
                                Delete
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    )
}

export default Pinmarks;