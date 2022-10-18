import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Hero from "../components/Hero";
import List from "../components/List";
import { 
    MDBListGroup,
    MDBListGroupItem,
    MDBCard,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBBtn,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBIcon,
    MDBTabsContent,
    MDBTabsPane    
} from 'mdb-react-ui-kit'
// list of pinmarks based on either location selection or category selection
function PinmarkList() {
    const { locationId } = useParams();
    const locationState = useSelector((state) => state.pinmark.locations);
    const pinmarkListState = useSelector((state) => state.pinmark.pinmarks);
    const [tabState, setTabState] = React.useState('all');

    const handleTabClick = (value) => {
        if (value === tabState) {
            return;
        } 
        setTabState(value);
    }

    console.log(pinmarkListState);
    console.log(`locationId: ${locationId}`);
    var pinmarkList = [];
    pinmarkListState.map((pinmark) => {
        if (pinmark.locationId.locationId === locationId) {
            pinmarkList.push(pinmark);
        }
    })      
    var locationObject = {};
    locationState.map((location) => {
        if (location.locationId === locationId ) {
            locationObject = {
                city: location.city,
                state: location.state,
                country: location.country,
                photo_reference: location.photo_reference                
            }
        }
    })   

    const pinmarkCategories = ['coffee', 'night-life', 'food', 'lodging', 'shopping', 'tourist-attraction'];
    var coffeePinmarks = [];
    var nightLifePinmarks = [];
    var foodPinmarks = [];
    var lodgingPinmarks = [];
    var shoppingPinmarks = [];
    var touristAttractionPinmarks = [];
    var otherPinmarks = [];

    pinmarkList.map((pinmark) => {
        if (pinmark.pinmarkCategory === pinmarkCategories[0]) {
            coffeePinmarks.push(pinmark);
        } else if (pinmark.pinmarkCategory === pinmarkCategories[1]) {
            nightLifePinmarks.push(pinmark);
        } else if (pinmark.pinmarkCategory === pinmarkCategories[2]) {
            foodPinmarks.push(pinmark);
        } else if (pinmark.pinmarkCategory === pinmarkCategories[3]) {
            lodgingPinmarks.push(pinmark);
        } else if (pinmark.pinmarkCategory === pinmarkCategories[4]) {
            shoppingPinmarks.push(pinmark);
        } else if (pinmark.pinmarkCategory === pinmarkCategories[5]) {
            touristAttractionPinmarks.push(pinmark);
        } else {
            otherPinmarks.push(pinmark);
        }
    })
    return (
        <div>
            <header className="bg-image" style={{height: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>            
                {/* <h1>{locationObject.city}</h1> */}
                <img style={{objectFit: 'cover', width: '100%'}} className="img-fluid" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationObject.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                <div className="mask" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                <div style={{marginRight: 15, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexWrap: 'wrap'}} className='h-100'>
                    <h1 style={{width: '100%', textAlign: 'right'}} className='text-white'>{locationObject.city}</h1>                    
                    <h3 className="text-white">{locationObject.state}, {locationObject.country}</h3>
                </div>
                </div>
            </header>                    
            <MDBTabs fill style={{display: "flex", flexWrap: "nowrap", alignItems: 'center', overflowX: 'scroll'}}>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick('all')} active={tabState === 'all'}>
                        All
                    </MDBTabsLink>
                </MDBTabsItem>  
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[0])} active={tabState === pinmarkCategories[0]}>
                        <MDBIcon fas icon='coffee' className='me-2' />Coffee
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[1])} active={tabState === pinmarkCategories[1]}>
                        <MDBIcon fas icon='moon' className='me-2' />Night Life
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[2])} active={tabState === pinmarkCategories[2]}>
                        <MDBIcon fas icon='utensils' className='me-2' />Food
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[3])} active={tabState === pinmarkCategories[3]}>
                        <MDBIcon fas icon='hotel' className='me-2' />Lodging
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick('other')} active={tabState === 'other'}>
                        <MDBIcon fas icon='ellipsis-h' className='me-2' />Other
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[4])} active={tabState === pinmarkCategories[4]}>
                        <MDBIcon fas icon='shopping-bag' className='me-2' />Shopping
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabClick(pinmarkCategories[5])} active={tabState === pinmarkCategories[5]}>
                        <MDBIcon fas icon='archway' className='me-2' />Tourist Attraction
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            <MDBTabsContent>
                <MDBTabsPane show={tabState === 'all'}>
                    <MDBRow>
                    {
                    pinmarkList.map((pinmark) => {
                    return (
                        <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                            <div className='d-flex align-items-center'>
                                {/* <img
                                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                alt=''
                                style={{ width: '45px', height: '45px' }}
                                className='rounded-circle'
                                /> */}
                                <div className='ms-3'>
                                <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                </div>
                            </div>
                        </MDBListGroupItem>
                    )
                   
                    })
                    }
                    </MDBRow>
               
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[0]}>
                    <MDBRow>
                        {
                        coffeePinmarks.map((pinmark) => {
                            return (                                            
                                <MDBCol xl={4} md={4} s={2} xs={2}>
                                    <MDBCard>
                                        <MDBCardImage style={{height: 250, objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} position='top' alt='...' />
                                        <MDBCardBody>
                                            <MDBCardTitle>{pinmark.locationName}</MDBCardTitle>
                                            <MDBCardText>
                                                {pinmark.address}
                                            </MDBCardText>
                                            <MDBBtn href='#'>Button</MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard>  
                                </MDBCol>                                                                              
                            )
                        
                            })
                        }
                    </MDBRow>
                </MDBTabsPane>             
                <MDBTabsPane show={tabState === pinmarkCategories[1]}>
                    <MDBRow>
                    {
                    nightLifePinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            </MDBListGroupItem>
                        )
                    
                    })
                    }
                    </MDBRow>
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[2]}>
                    <MDBRow>                 
                    {
                    foodPinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            </MDBListGroupItem>
                        )                   
                        })
                    }             
                    </MDBRow>
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[3]}>
                    <MDBRow>                    
                    {
                    lodgingPinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            </MDBListGroupItem>
                        )
                    
                    })
                    }
                    </MDBRow>
                </MDBTabsPane>
                <MDBTabsPane show={tabState === 'other'}>
                    <MDBRow>

                    
                    {
                    otherPinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            </MDBListGroupItem>
                        )
                    
                    })
                    }
                    </MDBRow>
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[4]}>
                    <MDBRow>                    
                    {
                    shoppingPinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            
                            </MDBListGroupItem>
                        )
                    
                    })
                    }
                    </MDBRow>
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[5]}>
                    <MDBRow>                    
                    {
                    touristAttractionPinmarks.map((pinmark) => {
                        return (
                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    {/* <img
                                    src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                                    alt=''
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    /> */}
                                    <div className='ms-3'>
                                    <p className='fw-bold mb-1'>{pinmark.locationName}</p>
                                    {/* <p className='text-muted mb-0'>john.doe@gmail.com</p> */}
                                    </div>
                                </div>
                            </MDBListGroupItem>
                        )                   
                    })
                    }
                    </MDBRow>
                </MDBTabsPane>
            </MDBTabsContent>          
        </div>
    )
}

export default PinmarkList;