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
    const [coffeeState, setCoffeeState] = useState();
    const [nightLifeState, setNightLifeState] = React.useState();
    const [foodState, setFoodState] = React.useState();
    const [lodgingState, setLodgingState] = React.useState();
    const [shoppingState, setShoppingState] = React.useState();
    const [touristAttractionState, setTouristAttractionState] = React.useState();

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
            {/* <Hero /> */}
            <h1>{locationObject.city}</h1>
            <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationObject.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
            {/* <List/> */}

            <h6 className='bg-light p-2 border-top border-bottom'>Coffee</h6>
            
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
            
            <h6 className='bg-light p-2 border-top border-bottom'>Food</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
            <h6 className='bg-light p-2 border-top border-bottom'>Lodging</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
            <h6 className='bg-light p-2 border-top border-bottom'>Night Life</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
            <h6 className='bg-light p-2 border-top border-bottom'>Other</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
            <h6 className='bg-light p-2 border-top border-bottom'>Shopping</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
            <h6 className='bg-light p-2 border-top border-bottom'>Tourist Attractions</h6>
            <MDBListGroup light className='mb-4'>
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
            </MDBListGroup>
        </div>
    )
}

export default PinmarkList;