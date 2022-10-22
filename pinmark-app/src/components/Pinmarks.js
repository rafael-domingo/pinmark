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

function Pinmarks() {
    const pinmarkState = useSelector((state) => state.pinmark.pinmarks);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = React.useState(false);
    const [detailInfo, setDetailInfo] = React.useState({});
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
                details: result
            }
            setDetailInfo(infoObject);
            setShowModal(true);
        })
        .catch((error) => console.log(error))        
        
    }   

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div style={containerDivStyle}>
            {
                // reverse the pinmarkState array to get reverse chronological order of pinmarks
                pinmarkState.slice(0).reverse().map((pinmark) => {
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
                        <PinmarkModal detailInfo={detailInfo} handleCloseModal={handleCloseModal}/>
                        {/* <MDBModalHeader className="bg-image" style={{padding: 0}}>                       
                        <img position="top" overlay style={{width: '100%', height: '35vh', objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${detailInfo.pinmark?.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>  
                        <div
                            className='mask'
                            style={{
                            background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))',
                            }}>
                            <div className='bottom-0 d-flex align-items-end h-100 text-center justify-content-flex-start'>
                            <div style={{paddingLeft: 20}}>
                                <h1 className='fw-bold text-white mb-4'>{detailInfo.pinmark?.locationName}</h1>
                            </div>
                            </div>
                        </div>                      
                        </MDBModalHeader>
                        <MDBModalBody>                        
                            <MDBRow>
                                <MDBCol size='12' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>                                           
                                            <MDBCardText>
                                            <a href={`https://www.google.com/maps/dir/?api=1&map_action=map&destination=${encodeURIComponent(detailInfo.pinmark?.locationName)}&destination_place_id=${detailInfo.pinmark?.pinmarkId}`}>                                                
                                                    {detailInfo.pinmark?.address}
                                                </a>                                                
                                                </MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='12' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>{detailInfo.details?.result.editorial_summary?.overview}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>{detailInfo.pinmark?.pinmarkCategory}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            { detailInfo.details?.result.opening_hours.open_now ? (<MDBBadge>Open</MDBBadge>) : (<MDBBadge>Closed</MDBBadge>)}  
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText><a href={`tel:${detailInfo.details?.result.formatted_phone_number}`}>{detailInfo.details?.result.formatted_phone_number}</a></MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>$$$$ {detailInfo.details?.result.price_level}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>   
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>$$$$ {detailInfo.details?.result.rating} stars</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>                                
                            </MDBRow>
                        </MDBModalBody>                              
                        <MDBBtn onClick={() => setShowModal(false)} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                            <MDBIcon fas icon='times'/>
                        </MDBBtn>                     */}
                    </MDBModalContent>                  
                </MDBModalDialog>
            </MDBModal>
        </div>
    )
}

export default Pinmarks;