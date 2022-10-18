// landing page for when user logs into their account -- 'Your locations' and 'Your categories'
import React from 'react';
import Locations from "../components/Locations";
import { Google } from '../util/Google';
import { v4 as uuidv4 } from 'uuid';
import { signInWithGoogle, signUserOut, updateUser } from '../util/Firebase';
import Search from '../components/Search';
import { 
    MDBBtn, 
    MDBIcon,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInputGroup,    
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,    
    MDBRipple,
    MDBRow,
    MDBCol,
    MDBCardHeader
} from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { addLocations, addPinmark, deleteLocations, deletePinmark } from '../redux/pinmarkSlice';
import Pinmarks from '../components/Pinmarks';

function UserHome() {
    const pinmarkState = useSelector((state) => state.pinmark);
    const userState = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const sessionToken = uuidv4();        
    const [showSearch, setShowSearch] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [secondModal, setSecondModal] = React.useState(false);
    const [detailInfo, setDetailInfo] = React.useState([]);  
    const [pinmarkIdArray, setPinmarkIdArray] = React.useState([]);
    const [currentLocationObject, setCurrentLocationObject] = React.useState({
        city: '',
        state: '',
        country: '',
        locationId: ''
    }); // state to keep track of newly create locationId -- to fix bug that would add duplicate cities if state didn't update fast enough

    // side effect to keep track of pinmark IDs to help with search results UI (add/remove pinmarks)
    React.useEffect(() => {
        console.log(pinmarkState);
        var pinmarkArray = [];
        pinmarkState.pinmarks.map((pinmark) => {
            pinmarkArray.push(pinmark.pinmarkId);
        })
        setPinmarkIdArray(pinmarkArray);
        updateUser(userState.uid, pinmarkState);
    }, [pinmarkState])

    React.useEffect(() => {
        Google.placeSearch('houston, tx', null).then(data => console.log(data)).catch(e => console.log(e))
        // Google.placeDetails('ChIJD7fiBh9u5kcRYJSMaMOCCwQ', sessionToken).then(data => console.log(data)).then(e => console.log(e))
        // Google.placePhotos('AcYSjRib2XvYOWznJfg3ORpwZcNmtZBnpOXAWJLeQ2mSa8oz6fzDiZPRHrj0GmFCLzlnLIT3nc1c4OMsiUT3En4R9t7SmeqaeCIis3ZmrVcbjCHcSjDX7rh8HnYRJ0ByaKBXDS-nHtM4Wxy62bTYb9_Hc-vGxe6VlYlvA3qzweynx1OpVLOb').then(data => console.log(data))            
    }, [0])    
   
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

    const handleAddPinmark = (pinmark) => {
        // get address components to parse city, state, country, zip code
        Google.placeDetails(pinmark.place_id, sessionToken).then(data => {
            console.log(data)
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
        
                    
        });        
                   
    }

    const handleDeletePinmark = (pinmark) => {
        var locationIdReference = '';
        
        // need to check if need to delete location in state if no more pinmarks in that city
        var locationIdCount = 0;        
        pinmarkState.pinmarks.map((pin) => {       
            console.log(pinmark.place_id)
            console.log(pin.pinmarkId)     
            // need to figure out what the locationId is
            if(pinmark.place_id === pin.pinmarkId) {
                locationIdReference = pin.locationId.locationId;
            }
        })
        // count how many of that locationId is in the pinmark array
        pinmarkState.pinmarks.map((pin) => {            
            if(pin.locationId.locationId === locationIdReference) {
                locationIdCount++;
            }
        })
        console.log(locationIdReference);
        console.log(locationIdCount);
        // if there's only one left, that means we need to remove the location -- the one pinmark remaining is the one we're about to remove through dispatch
        if (locationIdCount <=1 ) {
            dispatch(deleteLocations(locationIdReference));
        }
        dispatch(deletePinmark(pinmark.place_id));

    }
    
    const handleShowSearch = () => {
        setShowSearch(!showSearch);
        setSearchInput('');
        setSearchResults([]);
    }

    const handleShowDetails = (info) => {
        setSecondModal(true);        
        setDetailInfo(info);
    }

    const handleSearchInput = (e) => {
        console.log(e.target.value);
        setSearchInput(e.target.value);
        if (e.target.value.length > 3) {
            Google.placeSearch(e.target.value, null)
            .then(data => {
                console.log(data);
                handleSearchResults(data);
            })
            .catch(e => console.log(e))
        }
    }    
    const handleSearchResults = (results) => {
        console.log(results);
        setSearchResults(results.results);               
    }
    
    return (
        <div>
            <h3>Your Locations</h3>  
                <Locations />    
            <h3>Most Recent Pinmarks</h3>
                <Pinmarks/>    
            <MDBBtn onClick={handleShowSearch} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='search'/>
            </MDBBtn>
            <MDBModal tabIndex='-1' show={showSearch && !secondModal} setShow={setShowSearch}>
                <MDBModalDialog size='fullscreen-xxl-down'>
                    <MDBModalContent>
                        <MDBModalHeader>  
                            <MDBInputGroup className='mb-3' noBorder textBefore={<MDBIcon fas icon='search' />}>
                                <input className='search form-control' type='text' placeholder='Search' onChange={handleSearchInput} value={searchInput} style={{border: 'none', boxShadow: 'none'}}/>
                            </MDBInputGroup>                      
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow>
                            {/* put list of search results here */}
                            {searchResults.map((result) => {
                                                                
                                return (
                                    <MDBCol xxl={12} xl={4} l={4} md={4} className='mb-4'>
                                        <MDBCard>
                                            <MDBCardBody>
                                                <MDBCardTitle>{result.name}</MDBCardTitle>
                                                <MDBCardText>{result.formatted_address}</MDBCardText>                                            
                                            </MDBCardBody>
                                            <MDBCardFooter background='light' border='0' className='p-2 d-flex justify-content-around'>
                                                <MDBBtn onClick={() => handleShowDetails(result)} color='link' rippleColor='primary' className='text-reset m-0'>
                                                View <MDBIcon fas icon='eye' />
                                                </MDBBtn>
                                                {
                                                    !pinmarkIdArray.includes(result.place_id) && (
                                                        <MDBBtn onClick={() => handleAddPinmark(result)} color='primary'>
                                                            Add Pinmark <MDBIcon fas icon='plus' />
                                                        </MDBBtn>
                                                    )
                                                }
                                                 {
                                                    pinmarkIdArray.includes(result.place_id) && (
                                                        <MDBBtn onClick={() => handleDeletePinmark(result)} color='link' rippleColor='primary' className='text-reset m-0'>
                                                            Remove Pinmark <MDBIcon fas icon='minus' />
                                                        </MDBBtn>
                                                    )
                                                }
                                                
                                            </MDBCardFooter>
                                        </MDBCard>                      
                                    </MDBCol>                                                  
                                )
                            })}
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn onClick={handleShowSearch} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                            <MDBIcon fas icon='times'/>
                        </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            <MDBModal staticBackdrop show={secondModal} setShow={setSecondModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBCardHeader>
                            
                            <MDBModalTitle>{detailInfo.name}</MDBModalTitle>
                        </MDBCardHeader>
                        
                        <MDBModalBody>
                            {detailInfo.formatted_address}

                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn color='link' onClick={() => {
                                setSecondModal(false)
                                setShowSearch(true);
                                }}>
                                    Back
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    )
}

export default UserHome;