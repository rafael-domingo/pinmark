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
    MDBModalTitle
} from 'mdb-react-ui-kit';

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
        setDetailInfo(pinmark);
        setShowModal(true);
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
                            <MDBCardImage style={{width: '100%', height: '100%', objectFit: 'cover'}} overlay src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
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
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBCardHeader>
                            <MDBModalTitle>{detailInfo.locationName}</MDBModalTitle>
                        </MDBCardHeader>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    )
}

export default Pinmarks;