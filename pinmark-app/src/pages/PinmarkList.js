import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Hero from "../components/Hero";
import List from "../components/List";
import { updateUser } from "../util/Firebase";
import { Google } from "../util/Google";
import { useNavigate } from "react-router-dom";
import { addPinmarkToTrip, addTripLists, removePinmarkFromTrip, deleteLocations, addPinmark, deletePinmark, addLocations, deleteTripLists } from "../redux/pinmarkSlice";
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
    MDBBadge,
    MDBTypography,
    MDBModalTitle,
    MDBSpinner,
    MDBRipple
} from 'mdb-react-ui-kit'
import PinmarkModal from "../modals/PinmarkModal";
import SearchModal from "../modals/SearchModal";
import TripViewModal from "../modals/TripViewModal";
import PinmarkCards from "../components/PinmarkCards";
import TripListModal from "../modals/TripListModal";

// list of pinmarks based on either location selection or category selection
function PinmarkList() {
    const { locationId } = useParams();    
    const navigate = useNavigate();
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
    const [settingsModal, setSettingsModal] = React.useState(false);
    const [deleteLocationModal, setDeleteLocationModal] = React.useState(false);
    const [deleteTripModal, setDeleteTripModal] = React.useState(false);
    const [deleteTripId, setDeleteTripId] = React.useState('');
    const [deletePinmarkModal, setDeletePinmarkModal] = React.useState(false);
    const [deletePinmarkObject, setDeletePinmarkObject] = React.useState({}); 
    const [deletePinmarkFromTripModal, setDeletePinmarkFromTripModal] = React.useState(false);
    const [deletePinmarkFromTripObject, setDeletePinmarkFromTripObject] = React.useState({});
    const [tripListModal, setTripListModal] = React.useState(false); 
    const [loading, setLoading] = React.useState(false);
    const [createTripName, setCreateTripName] = React.useState('');
    const [tripViewObject, setTripViewObject] = React.useState('');   
    const [pinmarkSearchInput, setPinmarkSearchInput] = React.useState('');        
    const [pinmarkDetailObject, setPinmarkDetailObject] = React.useState({});
    const [currentLocationObject, setCurrentLocationObject] = React.useState({});
    const [pinmarkCardSort, setPinmarkCardSort] = React.useState('newest');
    const pinmarkCategories = ['coffee', 'night-life', 'food', 'lodging', 'shopping', 'tourist-attraction'];
    const viewportRef = React.useRef();

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
        console.log('delete pinmark from trip')
        
        var updateObject = {
            pinmarkId: pinmark.pinmarkId,
            tripId: tripId,
            sharedWith: []
        }
        console.log(updateObject);
        if (add) {            
            console.log(updateObject);
            dispatch(addPinmarkToTrip(updateObject));
        } else {
            dispatch(removePinmarkFromTrip(updateObject))
        }        
        if (tripViewModal) {
            console.log('updatetripobject')
            tripListState.map((trip) => {
                if (trip.tripId === tripId) {
                    handleSetTripView(trip)
                }
            })
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
        console.log(tripObject);      
        setTripViewObject(tripObject)
        if (!tripViewModal) {
            setTripViewModal(true);
        }
        
    };

    const handleShowSearch = () => {
        setShowSearch(false);
    }

    const handleShowDetails = (info) => {
        Google.placeDetails(info.place_id)
        .then(result => {
            console.log(result);
            const pinmarkObject = {
                photoURL: result.result.photos?.[0]?.photo_reference,
                locationName: result.result.name,
                address: result.result.formatted_address            
            }
            const detailObject = {
                pinmark: pinmarkObject,
                details: result
            }
            setPinmarkDetailModal(true);        
            setPinmarkDetailObject(detailObject);
        })
    }

    const handleDeleteLocation = () => { 
        setLoading(true);
        // link back to user home
        setTimeout(() => {
            navigate('/UserHome')            
            dispatch(deleteLocations(locationId));
        }, 2000);   
    }

    const handleDeleteTripModal = (tripId) => {
        setDeleteTripModal(true);
        setLoading(false);
        // setTripViewModal(false);
        setDeleteTripId(tripId);
    }

    const handleDeleteTrip = (tripId) => {
        setLoading(true);
        setTimeout(() => {
            setTripViewModal(false);
            setDeleteTripModal(false);
            dispatch(deleteTripLists(tripId));
        }, 2000);
    }

    const handleDeletePinmarkModal = (pinmarkObject) => {
        setDeletePinmarkModal(true);
        setDeletePinmarkObject(pinmarkObject);
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
    
    const handleDeletePinmarkFromTripModal = (pinmark, tripObj, del) => {
        setDeletePinmarkFromTripModal(true);
        const object = {
            pinmark: pinmark,
            tripObj: tripObj, 
            del: del
        }
        setDeletePinmarkFromTripObject(object);
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

    const handlePinmarkSearchInput = (e) => {
        console.log(e.target.value);
        setPinmarkSearchInput(e.target.value)
    }
     
    const handlePinmarkDetail = (pinmark, showDelete = true) => {
        Google.placeDetails(pinmark.pinmarkId)
        .then(result => {
            const pinmarkDetailObject = {
                pinmark: pinmark,
                details: result,
                showDelete: showDelete
            }            
            setPinmarkDetailModal(true);
            setPinmarkDetailObject(pinmarkDetailObject);
        })
        
    }

    const handleClosePinmarkModal = () => {
        setPinmarkDetailModal(false);
    }

    const handleCloseTripModal = () => {
        setTripViewModal(false);
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
        if (pinmarkCardSort === 'newest') {
            var sortedList = [];
            pinmarkList.slice(0).reverse().map((pin) => {
                sortedList.push(pin);
            })
            setLocalPinmarkListState(sortedList);
        } else if (pinmarkCardSort === 'alphabetical') {
            var sortedList = pinmarkList.sort(function(a,b) {
                if (a.locationName < b.locationName) {
                    return -1;
                } 
                if (a.locationName > b.locationName) {
                    return 1;
                }
                return 0;
            })
            setLocalPinmarkListState(sortedList);
        }       
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
        if (tripViewModal) {
            handleSetTripView(tripViewObject?.trip)
        }
    }, [pinmarkListState, pinmarkSearchInput, pinmarkCardSort, tripListState])


    console.log(pinmarkListState);
    console.log(`locationId: ${locationId}`);
    var pinmarkList = [];
    pinmarkListState.map((pinmark) => {
        if (pinmark.locationId.locationId === locationId) {
            pinmarkList.push(pinmark);
        }
    })      
    if (pinmarkCardSort === 'newest') {
        var sortedList = [];
        pinmarkList.slice(0).reverse().map((pin) => {
            sortedList.push(pin);
        })
        // setLocalPinmarkListState(sortedList);
    } else if (pinmarkCardSort === 'alphabetical') {
        var sortedList = pinmarkList.sort(function(a,b) {
            if (a.locationName < b.locationName) {
                return -1;
            } 
            if (a.locationName > b.locationName) {
                return 1;
            }
            return 0;
        })
        // setLocalPinmarkListState(sortedList);
    }   
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

    // stop background from scrolling when modal is open
    React.useEffect(() => {
        console.log(createTripModal)
        if (createTripModal || tripViewModal || showSearch || tripListModal) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [createTripModal, tripViewModal, showSearch, tripListModal])
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
                        <TripViewModal tripObject={tripViewObject} handleCloseModal={handleCloseTripModal} handleDeleteTrip={handleDeleteTripModal} handlePinmarkDetail={handlePinmarkDetail} handleDeletePinmarkFromTripModal={handleDeletePinmarkFromTripModal}/>                        
                    </MDBModalContent>
                </MDBModalDialog>
            {/* Search Modal */}
            </MDBModal>
            <MDBModal staticBackdrop show={showSearch} setShow={setShowSearch} tabIndex='-1'>
                <MDBModalDialog size='fullscreen' scrollable>
                    <MDBModalContent>
                        <SearchModal handleCloseModal={handleShowSearch} handlePinmarkDetail={handleShowDetails} handleAddPinmark={handleAddPinmark} handleDeletePinmark={handleDeletePinmark}/>                       
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
                        <PinmarkModal detailInfo={pinmarkDetailObject} handleCloseModal={handleClosePinmarkModal} handleDeletePinmark={handleDeletePinmarkModal}/>                       
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Settings Modal */}
            <MDBModal show={settingsModal} setShow={setSettingsModal}>
                <MDBModalDialog                    
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                >
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Location Settings</MDBModalTitle>
                            <MDBBtn color='link' onClick={() => setSettingsModal(false)}>Close</MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody className="d-flex justify-content-center">
                            <MDBListGroup className="w-75" light>
                                <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                    Refresh Header Image
                                    <MDBBtn tag='a' color='none' className='m-1' style={{padding: 10}}><MDBIcon icon='redo'/></MDBBtn>
                                </MDBListGroupItem>
                                <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                    Delete Location
                                    <MDBBtn onClick={() => {
                                        setDeleteLocationModal(true)
                                        setSettingsModal(false)
                                        }} color='danger' className="d-flex justify-content-between align-items-center"><MDBIcon icon='trash'/></MDBBtn>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        </MDBModalBody>                       
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Delete Location Confirmation */}
            <MDBModal staticBackdrop show={deleteLocationModal} setShow={setDeleteLocationModal}>
                <MDBModalDialog
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                    >
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Delete Location?</MDBModalTitle>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Are you sure you want to delete this location?</p>
                            <p className="text-muted">All pinmarks and trips at this location will be deleted</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn onClick={() => {
                                setDeleteLocationModal(false)
                                setSettingsModal(true)
                                }} color='link'>Cancel</MDBBtn>
                            <MDBBtn style={{width: 100}} onClick={() => handleDeleteLocation()} color='danger'>
                                {!loading && (<>Delete</>)}
                                {loading && (<MDBSpinner size='sm' role='status'/>)}
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Delete Trip Confirmation */}
            <MDBModal staticBackdrop show={deleteTripModal} setShow={setDeleteTripModal}>
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
                                setDeleteTripModal(false)
                                setTripViewModal(true)
                                setDeleteTripId('')
                                }} color='link'>Cancel</MDBBtn>
                            <MDBBtn style={{width: 100}} onClick={() => handleDeleteTrip(deleteTripId)} color='danger'>
                                {!loading && (<>Delete</>)}
                                {loading && (<MDBSpinner size='sm' role='status'/>)}
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Delete Pinmark Confirmation */}
            <MDBModal staticBackdrop show={deletePinmarkModal} setShow={setDeletePinmarkModal}>
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
                                setDeletePinmarkModal(false)
                                setDeletePinmarkObject({})                                
                                }} color='link'>Cancel</MDBBtn>
                            <MDBBtn style={{width: 100}} onClick={() => {
                                handleDeletePinmark(deletePinmarkObject)
                                setDeletePinmarkModal(false)
                                setDeletePinmarkObject({}) 
                                handleClosePinmarkModal()                                
                                }} color='danger'>
                                Delete
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* TripList Modal */}
            <MDBModal show={tripListModal} setShow={setTripListModal}>
                <MDBModalDialog
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                >
                <MDBModalContent style={{height: '75vh'}}>
                    <TripListModal tripList={tripList} setTripListModal={setTripListModal} setCreateTripModal={setCreateTripModal} handleSetTripView={handleSetTripView}/>                    
                </MDBModalContent>
                </MDBModalDialog>                                
            </MDBModal>

            {/* Delete Pinmark from Trip Confirmation */}
           
           <MDBModal staticBackdrop show={deletePinmarkFromTripModal} setShow={setDeletePinmarkFromTripModal}>
                <MDBModalDialog
                    centered
                    scrollable
                    className="justify-content-center align-item-center"
                    >
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Remove Pinmark From Trip?</MDBModalTitle>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p>Are you sure you want to remove this pinmark?</p>
                            <p className="text-muted">This will remove the pinmark from this trip but it will still remain in your pinmark list.</p>
                        </MDBModalBody>
                    
                        <MDBModalFooter>
                            <MDBBtn onClick={() => {
                                setDeletePinmarkFromTripModal(false)
                                // setDeletePinmarkObject({})                                
                                }} color='link'>Cancel</MDBBtn>
                            <MDBBtn style={{width: 100}} onClick={() => {
                                handleAddPinmarkToTrip(deletePinmarkFromTripObject?.pinmark, deletePinmarkFromTripObject?.tripObj, deletePinmarkFromTripObject?.del)
                                setDeletePinmarkFromTripModal(false)
                                // setDeletePinmarkObject({}) 
                                // handleClosePinmarkModal()                                
                                }} color='danger'>
                                Delete
                            </MDBBtn>
                        </MDBModalFooter>
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
                        <div className='bottom-0 d-flex align-items-end h-100 text-center justify-content-between'>
                            <div style={{paddingLeft: 20}}>
                                <h1 className='fw-bold text-white mb-1'>{locationObject.city}</h1>
                                <h3 className='text-muted mb-2'>{locationObject.state}, {locationObject.country}</h3>
                            </div>                            
                            <MDBBtn onClick={() => setSettingsModal(true)} tag='a' color='none' className='m-1' style={{ color: 'white', padding: 10}}>
                                <MDBIcon size='2x' icon='ellipsis-h'/>
                            </MDBBtn>             
                        </div>
                    </div>        
                <MDBBtn style={{position: 'absolute', top: 10, right: 10}} onClick={() => setTripListModal(true)}>Your Trips</MDBBtn>
                {/* <MDBDropdown style={{position: 'absolute', top: 10, right: 10}}>
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
                </MDBDropdown>     */}
                
            
                        
            </MDBContainer>
            <MDBTabs fill style={{display: "flex", flexWrap: "nowrap", alignItems: 'center', overflowX: 'scroll'}}>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick('all')} active={tabState === 'all'}>
                        All
                    </MDBTabsLink>
                </MDBTabsItem>  
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[0])} active={tabState === pinmarkCategories[0]}>
                        <MDBIcon fas icon='coffee' className='me-2' />Coffee
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[1])} active={tabState === pinmarkCategories[1]}>
                        <MDBIcon fas icon='moon' className='me-2' />Night Life
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[2])} active={tabState === pinmarkCategories[2]}>
                        <MDBIcon fas icon='utensils' className='me-2' />Food
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[3])} active={tabState === pinmarkCategories[3]}>
                        <MDBIcon fas icon='hotel' className='me-2' />Lodging
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick('other')} active={tabState === 'other'}>
                        <MDBIcon fas icon='ellipsis-h' className='me-2' />Other
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[4])} active={tabState === pinmarkCategories[4]}>
                        <MDBIcon fas icon='shopping-bag' className='me-2' />Shopping
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onShow={() => window.scrollTo(0,0)} onClick={() => handleTabClick(pinmarkCategories[5])} active={tabState === pinmarkCategories[5]}>
                        <MDBIcon fas icon='archway' className='me-2' />Tourist Attraction
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            </MDBNavbar>   
       
            
            <MDBTabsContent>
                <MDBTabsPane ref={viewportRef} show={tabState === 'all'} style={{justifyContent: 'center'}}>                                    
                    <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='all' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/>                                        
                    </MDBRow>               
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[0]}>
                    <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='coffee' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>
                </MDBTabsPane>             
                <MDBTabsPane show={tabState === pinmarkCategories[1]}>
                <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='night-life' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[2]}>
                <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='food' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[3]}>
                <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='lodging' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
                <MDBTabsPane show={tabState === 'other'}>
                <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='other' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[4]}>
                <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='shopping' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
                <MDBTabsPane show={tabState === pinmarkCategories[5]}>
                    <MDBInputGroup style={{padding:20}} className='d-flex justify-content-between'>
                        <input className="search form-control w-75" type='text' placeholder="Search your Pinmarks" onChange={handlePinmarkSearchInput} value={pinmarkSearchInput} style={{border: 'none', boxShadow: 'none'}}/>
                        <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                            if (pinmarkCardSort === 'alphabetical') {
                                setPinmarkCardSort('newest');
                            } else if (pinmarkCardSort === 'newest') {
                                setPinmarkCardSort('alphabetical');
                            }   
                            }}>
                            {
                                pinmarkCardSort === 'alphabetical' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                                        <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                                    </>
                                )
                            }
                            {
                                pinmarkCardSort === 'newest' && (                                
                                    <>                                       
                                        <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                                        <MDBIcon icon='sort-down' className="text-muted"/>
                                    </>
                                )
                            }
                        </MDBBtn>
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
                    <PinmarkCards pinmarkList={localPinmarkListState} category='tourist-attraction' handleAddPinmark={handleAddPinmarkToTrip} handlePinmarkDetail={handlePinmarkDetail} handleCreateTrip={handleCreateTrip} tripList={tripList}/> 
                    </MDBRow>                    
                </MDBTabsPane>
            </MDBTabsContent>          
        </div>
    )
}

export default PinmarkList;