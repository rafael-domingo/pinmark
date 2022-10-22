import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Hero from "../components/Hero";
import List from "../components/List";
import { updateUser } from "../util/Firebase";
import { Google } from "../util/Google";
import { addPinmarkToTrip, addTripLists, removePinmarkFromTrip, deleteLocations, addPinmark, deletePinmark, addLocations } from "../redux/pinmarkSlice";
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
    MDBTabsPane,
    MDBDropdown,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBDropdownToggle,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBInput,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalBody,
    MDBCardFooter,    
    MDBNavbar,
    MDBContainer,
    MDBInputGroup,
    MDBBadge
} from 'mdb-react-ui-kit'
import PinmarkModal from "../modals/PinmarkModal";
import SearchModal from "../modals/SearchModal";

// list of pinmarks based on either location selection or category selection
function PinmarkList() {
    const { locationId } = useParams();    
    const userState = useSelector((state) => state.user);
    const locationState = useSelector((state) => state.pinmark.locations);
    const pinmarkState = useSelector((state) => state.pinmark);
    const pinmarkListState = useSelector((state) => state.pinmark.pinmarks);
    const [localPinmarkListState, setLocalPinmarkListState] = React.useState([]); // use for local search
    const tripListState = useSelector((state) => state.pinmark.tripLists);
    const [tabState, setTabState] = React.useState('all');
    const [createTripModal, setCreateTripModal] = React.useState(false);
    const [tripViewModal, setTripViewModal] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [pinmarkDetailModal, setPinmarkDetailModal] = React.useState(false);
    const [createTripName, setCreateTripName] = React.useState('');
    const [tripViewObject, setTripViewObject] = React.useState('');
    const [searchInput, setSearchInput] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [pinmarkSearchInput, setPinmarkSearchInput] = React.useState('');        
    const [pinmarkDetailObject, setPinmarkDetailObject] = React.useState({});
    const [currentLocationObject, setCurrentLocationObject] = React.useState({});
    const dispatch = useDispatch();

    const handleTabClick = (value) => {
        if (value === tabState) {
            return;
        } 
        setTabState(value);
    }

    const handleCreateTrip = () => {
        const colorArray = [
            'primary',
            'secondary',
            'success',
            'danger',
            'warning',
            'info'
        ];

        const tripObject = {
            tripName: createTripName,
            tripId: uuidv4(),
            locationId: locationId,
            color: colorArray[Math.floor(Math.random() * colorArray.length)]         
        }              
        dispatch(addTripLists(tripObject));
        setCreateTripModal(false);
        setCreateTripName('');
        
    }

    const createTripInput = (e) => {
        console.log(e.target.value);
        setCreateTripName(e.target.value);
    }

    const handleAddPinmarkToTrip = (pinmark, tripId, add) => {    
        var updateObject = {
            pinmarkId: pinmark.pinmarkId,
            tripId: tripId,
            sharedWith: []
        }
        if (add) {            
            console.log(updateObject);
            dispatch(addPinmarkToTrip(updateObject));
        } else {
            dispatch(removePinmarkFromTrip(updateObject))
        }   
    }

    const handleSetTripView = (trip) => {
        const tripPinmarkList = [];
        pinmarkListState.map((pinmark) => {
            if (pinmark.tripIds.includes(trip.tripId)) {
                tripPinmarkList.push(pinmark);
            }
        })
        const tripObject = {
            trip: trip,
            pinmarks: tripPinmarkList
        }
        setTripViewObject(tripObject)
        setTripViewModal(true);
    };

    const handleShowSearch = () => {
        setShowSearch(false);
    }

    const handleShowDetails = (info) => {
        Google.placeDetails(info.place_id)
        .then(result => {
            console.log(result);
            const detailInfoObject = {
                pinmark: {},
                details: result
            }
            setPinmarkDetailModal(true);        
            setPinmarkDetailObject(detailInfoObject);
        })
    }

    const handleDeletePinmark = (pinmark) => {        
        var locationIdReference = '';
        var locationIdCount = 0;
        pinmarkState.pinmarks.map((pin) => {
            if (pinmark.place_id === pin.pinmarkId) {
                locationIdReference = pin.locationId.locationId;
            }
        })
        pinmarkState.pinmarks.map((pin) => {
            if(pin.locationId.locationId === locationIdReference) {
                locationIdCount++;
            }
        })
        if (locationIdCount <= 1) {
            dispatch(deleteLocations(locationIdReference));
        }
        dispatch(deletePinmark(pinmark.place_id))
    }

    const handleAddPinmark = (pinmark) => {
        Google.placeDetails(pinmark.place_id, uuidv4())
        .then(data => {
            var city = '';
            var state = '';
            var postalCode = '';
            var country = '';
            
                    
            data.result.address_components.map((address_component) => {
                if(address_component.types.includes('locality') || address_component.types.includes('postal_town')) {
                    city = address_component.short_name;
                }
                if(address_component.types.includes('postal_code')) {
                    postalCode = address_component.short_name;
                }
                if(address_component.types.includes('administrative_area_level_1')) {
                    state = address_component.short_name;
                }
                if(address_component.types.includes('country')) {
                    country = address_component.short_name;
                }
            })         
            // check if location exists in state, otherwise add to global state   
            var exists = false;
            var locationId = uuidv4();
            // check if newly added pinmark matches current location in component state -- usually used when adding multiple pinmarks from the same city at once
            if (currentLocationObject.city === city && currentLocationObject.state === state && currentLocationObject.country === country) {
                exists = true;
                locationId = currentLocationObject.locationId
            }
            
            // check if newly added pinmark matches existing location in global state -- usually used when first opening up search
            pinmarkState.locations.map((location) => {
                if (location.city === city && location.state === state && location.country === country) {
                    exists = true;
                    locationId = location.locationId;
                }                
            })            
            if (!exists) {        
                var locationObject = {
                    city: city,
                    state: state,
                    country: country,                      
                    locationId: locationId                                                                   
                }            
                // created a separate function to speed up so that checking location isn't holding up the adding pinmark action
                handleCheckLocationExists(locationObject);                    
            } else {
                var locationObject = {
                    city: city,
                    state: state,
                    country: country,
                    locationId: locationId
                }                 
            }
            setCurrentLocationObject(locationObject); // update local state with new location object
            console.log(pinmark);
            console.log(data);

            // add pinmark category to pinmark
            const coffeeKeyWords = ['cafe'];
            const nightLifeKeywords = ['casino', 'night_club', 'movie_theater'];
            const foodKeywords = ['restaurant', 'bakery', 'bar', 'food'];    
            const lodgingKeywords = ['lodging', 'campground', 'rv_park', '']
            const shoppingKeywords = ['clothing_store', 'department_store', 'electronics_store', 'furniture_store', 'home_goods_store', 'jewelry_store', 'shoe_store', 'book_store', 'shopping_mall'];
            const touristAttractionKeywords = ['tourist_attraction', 'amusement_park', 'aquarium', 'art_gallery', 'museum', 'casino', 'zoo', 'city_hall'];
            var pinmarkCategory = '';
            if (pinmark.types.some(r => coffeeKeyWords.includes(r))) {
                pinmarkCategory = 'coffee';                
            } else if (pinmark.types.some(r => nightLifeKeywords.includes(r))) {
                pinmarkCategory = 'night-life';
            } else if (pinmark.types.some(r => foodKeywords.includes(r))) {
                pinmarkCategory = 'food';
            } else if (pinmark.types.some(r => lodgingKeywords.includes(r))) {
                pinmarkCategory = 'lodging';
            } else if (pinmark.types.some(r => shoppingKeywords.includes(r))) {
                pinmarkCategory = 'shopping';
            } else if (pinmark.types.some(r => touristAttractionKeywords.includes(r))) {
                pinmarkCategory = 'tourist-attraction';
            } else {
                pinmarkCategory = 'other';
            }
            // create pinmark object to store in state
            const pinmarkObject = {
                pinmarkId: pinmark.place_id,
                locationId: locationObject,
                locationName: pinmark.name,
                geometry: {
                    lat: pinmark.geometry.location.lat,
                    lng: pinmark.geometry.location.lng
                },
                address: pinmark.formatted_address,
                photoURL: pinmark.photos?.[0].photo_reference,
                rating: pinmark.rating,
                categories: pinmark.types,
                pinmarkCategory: pinmarkCategory,
                tripIds: []
            }
            dispatch(addPinmark(pinmarkObject));   
        })
    }

    const handleCheckLocationExists = (locationObject) => {
        Google.placeSearch(`${locationObject.city} ${locationObject.state} ${locationObject.country}`, null).then((data) => {
            console.log(data);            
            const photo_reference = data.results[0].photos?.[0].photo_reference;
            const newLocationObject = {
                city: locationObject.city,
                state: locationObject.state,
                country: locationObject.country,
                locationId: locationObject.locationId,
                photo_reference: photo_reference
            }
            dispatch(addLocations(newLocationObject));
        }).catch((error) => console.log(error))
    }

    // const handleSearchInput = (e) => {
    //     setSearchInput(e.target.value);
    //     if (e.target.value.length > 3) {
    //         // need to add location specificity since searching within Location
    //         Google.placeSearch(e.target.value, null)
    //         .then(data => {
    //             handleSearchResults(data);
    //         })
    //         .catch(e => console.log(e))
    //     }
        
    // }

    // const handleSearchResults = (results) => {
    //     setSearchResults(results.results);
    // }

    const handlePinmarkSearchInput = (e) => {
        console.log(e.target.value);
        setPinmarkSearchInput(e.target.value)
    }
     
    const handlePinmarkDetail = (pinmark) => {
        Google.placeDetails(pinmark.pinmarkId)
        .then(result => {
            const pinmarkDetailObject = {
                pinmark: pinmark,
                details: result
            }
            setPinmarkDetailModal(true);
            setPinmarkDetailObject(pinmarkDetailObject);
        })
        
    }

    const handleClosePinmarkModal = () => {
        setPinmarkDetailModal(false);
    }

    React.useEffect(() => {        
        console.log('update firebase')
        console.log(pinmarkState);
        updateUser(userState.uid, pinmarkState);
    }, [pinmarkListState])

    React.useEffect(() => {
        console.log(pinmarkListState);
        console.log(`locationId: ${locationId}`);
        var pinmarkList = [];
        pinmarkListState.map((pinmark) => {
            if (pinmark.locationId.locationId === locationId) {                
                if (pinmark.locationName.toLowerCase().includes(pinmarkSearchInput.toLowerCase()) || pinmarkSearchInput === '') {
                    pinmarkList.push(pinmark);
                }             
             
            }
        })      
        setLocalPinmarkListState(pinmarkList);
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
        var tripList = []; 
        tripListState.map((trip) => {
            if (trip.locationId === locationId) {
                tripList.push(trip);
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
    }, [pinmarkListState, pinmarkSearchInput])


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
    var tripList = []; 
    tripListState.map((trip) => {
        if (trip.locationId === locationId) {
            tripList.push(trip);
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

    React.useEffect(() => {
        console.log(createTripModal)
        if (createTripModal || tripViewModal || showSearch) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [createTripModal, tripViewModal, showSearch])
    return (
        <div>
                {/* Create Trip Modal */}
                <MDBModal staticBackdrop show={createTripModal} setShow={setCreateTripModal}>
                <MDBModalDialog centered>
                    <MDBModalContent style={{padding: 20}}>
                        <h3>Create A New Trip</h3>                        
                        <div style={{padding: 20}}>
                            <MDBInput onInput={createTripInput} value={createTripName} label={`What's your trip called?`}/>
                        </div>       
                       
                        <MDBModalFooter>
                            <MDBRow>
                            <MDBCol>
                                <MDBBtn onClick={() => {
                                    setCreateTripModal(false)
                                    setCreateTripName('')
                                }} color='link'>Cancel</MDBBtn>  
                            </MDBCol>               
                            <MDBCol>
                                <MDBBtn onClick={() => handleCreateTrip()}>Create</MDBBtn>
                            </MDBCol>
                            </MDBRow>
                    
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            {/* Trip View Modal */}
            <MDBModal overflowScroll={false} staticBackdrop show={tripViewModal} setShow={setTripViewModal}>
                <MDBModalDialog size='fullscreen' scrollable>
                    <MDBModalContent>
                        <MDBModalHeader>
                              {tripViewObject?.trip?.tripName}
                              <MDBBtn onClick={() => setTripViewModal(false)}>Close</MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow>                            
                            {
                                tripViewObject?.pinmarks?.map((pinmark) => {
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
            {/* Search Modal */}
            </MDBModal>
            <MDBModal staticBackdrop show={showSearch} setShow={setShowSearch} tabIndex='-1'>
                <MDBModalDialog size='fullscreen' scrollable>
                    <MDBModalContent>
                        <SearchModal handleCloseModal={handleShowSearch} handlePinmarkDetail={handleShowDetails} handleAddPinmark={handleAddPinmark} handleDeletePinmark={handleDeletePinmark}/>
                        {/* <MDBModalHeader>
                            <MDBInputGroup>
                                <input className="search form-control" type='text' placeholder="Search" onChange={handleSearchInput} value={searchInput} style={{border: 'none', boxShadow: 'none'}}/>
                            </MDBInputGroup>
                        </MDBModalHeader>
                        <MDBModalBody style={{height: '100%'}} >
                            <MDBRow>
                                {
                                    searchResults.map((result) => {
                                        return (
                                            <MDBCol xxl={12} xl={4} l={4} md={4}>
                                                <MDBCard>
                                                    <MDBCardBody>
                                                        <MDBCardTitle>{result.name}</MDBCardTitle>
                                                        <MDBCardText>{result.formatted_address}</MDBCardText>
                                                    </MDBCardBody>
                                                    <MDBCardFooter background="light" border='0' className="p-2 d-flex justify-content-around">
                                                        
                                                    </MDBCardFooter>
                                                        
                                                </MDBCard>
                                            </MDBCol>
                                        )
                                    })
                                }
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn onClick={() => setShowSearch(false)} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                                <MDBIcon fas icon='times'/>
                            </MDBBtn>
                        </MDBModalFooter> */}
                    </MDBModalContent>
                   
                </MDBModalDialog>
            </MDBModal>

            {/* Pinmark Detail Modal */}
            <MDBModal show={pinmarkDetailModal} setShow={setPinmarkDetailModal}>
                <MDBModalDialog 
                    size='fullscreen-md-down'
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                    >
                    <MDBModalContent>
                        <PinmarkModal detailInfo={pinmarkDetailObject} handleCloseModal={handleClosePinmarkModal}/>
                        {/* <MDBModalHeader className="bg-image" style={{padding: 0}}>
                            <img position='top' overlay style={{width: '100%', height: '35vh', objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmarkDetailObject.pinmark?.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                            <div
                                className="mask"
                                style={{background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))'}}
                            >
                                <div className="bottom-0 d-flex align-items-end h-100 text-center justify-content-flex-start">
                                    <div style={{padding: 20}}>
                                        <h1 className="fw-bold text-white mb-4">{pinmarkDetailObject.pinmark?.locationName}</h1>
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
                                            <a href={`https://www.google.com/maps/dir/?api=1&map_action=map&destination=${encodeURIComponent(pinmarkDetailObject.pinmark?.locationName)}&destination_place_id=${pinmarkDetailObject.pinmark?.pinmarkId}`}>                                                
                                                    {pinmarkDetailObject.pinmark?.address}
                                                </a>                                                
                                                </MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='12' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>{pinmarkDetailObject.details?.result.editorial_summary?.overview}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>{pinmarkDetailObject.pinmark?.pinmarkCategory}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            { pinmarkDetailObject.details?.result.opening_hours.open_now ? (<MDBBadge>Open</MDBBadge>) : (<MDBBadge>Closed</MDBBadge>)}  
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText><a href={`tel:${pinmarkDetailObject.details?.result.formatted_phone_number}`}>{pinmarkDetailObject.details?.result.formatted_phone_number}</a></MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>$$$$ {pinmarkDetailObject.details?.result.price_level}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>   
                                <MDBCol size='6' className='mb-4'>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardText>$$$$ {pinmarkDetailObject.details?.result.rating} stars</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>                                
                            </MDBRow>
                        </MDBModalBody>
                        <MDBBtn onClick={() => {
                            setPinmarkDetailModal(false);
                            setPinmarkDetailObject({});
                            }} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                            <MDBIcon fas icon='times'/>
                        </MDBBtn>  */}
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            <MDBNavbar sticky fixed="top" style={{backgroundColor: 'white', padding: 0}} >            
            <MDBContainer fluid overlay className="bg-image" style={{padding: 0, height: '20vh', display: 'flex',}}>                               
                <img position="top" overlay style={{width: '100%', height: '100%', objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationObject.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                    <div
                        className='mask'
                        style={{
                        background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0.2) 50%, hsla(0, 0%, 0%, 0.8))',
                        }}
                    >
                        <div className='bottom-0 d-flex align-items-end h-100 text-center justify-content-flex-start'>
                            <div style={{paddingLeft: 20}}>
                                <h1 className='fw-bold text-white mb-4'>{locationObject.city}</h1>
                            </div>
                            <div style={{paddingLeft: 20}}>
                                <h3 className='text-white mb-4'>{locationObject.state}, {locationObject.country}</h3>
                            </div>
                        </div>
                    </div>
                                       
                {/* <img style={{objectFit: 'cover', width: '100%'}} className="img-fluid" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationObject.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>
                <div className="mask" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                <div style={{marginRight: 15, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap'}} className='h-100'>
                    <h1 style={{width: '100%', textAlign: 'left'}} className='text-white'>{locationObject.city}</h1>                    
                    <h3 className="text-white">{locationObject.state}, {locationObject.country}</h3>
                </div>
                </div> */}
                <MDBDropdown style={{position: 'absolute', top: 10, right: 10}}>
                    <MDBDropdownToggle color='light'>Your Trips</MDBDropdownToggle>
                    <MDBDropdownMenu>
                        {
                            tripList.map((trip) => {
                             return (
                                <MDBDropdownItem link childTag="button" onClick={() => handleSetTripView(trip)}>
                                    {trip.tripName}
                                </MDBDropdownItem>
                             )       
                            })
                        }
                        <MDBDropdownItem divider/>
                        <MDBDropdownItem link childTag="button" onClick={() => setCreateTripModal(true)}>
                            Create New Trip
                        </MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>                 
          
            </MDBContainer>
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
            </MDBNavbar>   
       
            
            <MDBTabsContent >
                <MDBTabsPane show={tabState === 'all'} style={{justifyContent: 'center'}}>
                    <MDBInputGroup style={{padding:20}}>
                        <input className="search form-control" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                    </MDBInputGroup>
                    <MDBRow style={{padding: 20}}>
                    <MDBCol xl={4} md={4} s={2} xs={2} className='mb-4'>
                        <MDBCard className="h-100">
                            <MDBCardBody onClick={() => setShowSearch(true)} className='d-flex justify-content-center align-items-center'>                               
                                <MDBBtn color='link'>                                                            
                                    <MDBIcon icon='plus-circle'/> Add a Pinmark
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    {
                    localPinmarkListState.map((pinmark) => {
                   return (                                            
                                <MDBCol xl={4} md={4} s={2} xs={2} className='mb-4'>
                                    <MDBCard className="h-100">
                                        <MDBCardImage style={{height: 250, objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pinmark.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} position='top' alt='...' />
                                        <MDBCardBody>
                                            <MDBCardTitle>{pinmark.locationName}</MDBCardTitle>
                                            <MDBCardText>
                                                {pinmark.address}
                                            </MDBCardText>
                                            <MDBBtn color='link' onClick={() => handlePinmarkDetail(pinmark)}>More Detail</MDBBtn>
                                            <MDBDropdown>
                                                <MDBDropdownToggle>Add To Trip</MDBDropdownToggle>
                                                <MDBDropdownMenu>
                                                {
                                                    tripList.map((trip) => {
                                                    return (
                                                        <MDBDropdownItem link childTag="button" onClick={() => {                                                            
                                                            if (pinmark.tripIds.includes(trip.tripId)) {
                                                                handleAddPinmarkToTrip(pinmark, trip.tripId, false)
                                                            } else {
                                                                handleAddPinmarkToTrip(pinmark, trip.tripId, true)}
                                                            }
                                                        }>
                                                            {pinmark.tripIds.includes(trip.tripId) && (<MDBIcon icon='check' />)}
                                                            {!pinmark.tripIds.includes(trip.tripId) && (<MDBIcon icon='plus' />)}                                                            
                                                            {trip.tripName}                                                                                                                            
                                                        </MDBDropdownItem>
                                                    )       
                                                    })
                                                }
                                                    <MDBDropdownItem divider/>
                                                    <MDBDropdownItem link>Create New Trip</MDBDropdownItem>
                                                </MDBDropdownMenu>
                                            </MDBDropdown>
                                        </MDBCardBody>
                                    </MDBCard>  
                                </MDBCol>                                                                              
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
                <MDBTabsPane show={tabState === pinmarkCategories[2]}>
                    <MDBRow>                 
                    {
                    foodPinmarks.map((pinmark) => {
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
                <MDBTabsPane show={tabState === pinmarkCategories[3]}>
                    <MDBRow>                    
                    {
                    lodgingPinmarks.map((pinmark) => {
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
                <MDBTabsPane show={tabState === 'other'}>
                    <MDBRow>

                    
                    {
                    otherPinmarks.map((pinmark) => {
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
                <MDBTabsPane show={tabState === pinmarkCategories[4]}>
                    <MDBRow>                    
                    {
                    shoppingPinmarks.map((pinmark) => {
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
                <MDBTabsPane show={tabState === pinmarkCategories[5]}>
                    <MDBRow>                    
                    {
                    touristAttractionPinmarks.map((pinmark) => {
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
            </MDBTabsContent>          
        </div>
    )
}

export default PinmarkList;