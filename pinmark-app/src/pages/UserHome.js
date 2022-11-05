// landing page for when user logs into their account -- 'Your locations' and 'Your categories'
import React from 'react';
import Locations from "../components/Locations";
import { Google } from '../util/Google';
import { v4 as uuidv4 } from 'uuid';
import { 
    MDBBtn, 
    MDBIcon,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBNavbar,
    MDBContainer,
    MDBNavbarBrand,  
} from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { addLocations, addPinmark, deleteLocations, deletePinmark } from '../redux/pinmarkSlice';
import Pinmarks from '../components/Pinmarks';
import Trips from '../components/Trips';
import PinmarkModal from '../modals/PinmarkModal';
import SearchModal from '../modals/SearchModal';
import { checkUser, fetchUserInfo, updatedSharedTrips, updateUser } from '../util/Firebase';
import SharedTrips from '../components/SharedTrips';

function UserHome() {
    const pinmarkState = useSelector((state) => state.pinmark);   
    const userState = useSelector((state) => state.user);
    const sharedTripsState = useSelector((state) => state.sharedTrips);
    const dispatch = useDispatch();
    const sessionToken = uuidv4();        
    const [showSearch, setShowSearch] = React.useState(false);   
    const [secondModal, setSecondModal] = React.useState(false);
    const [detailInfo, setDetailInfo] = React.useState({});  
    const [currentLocationObject, setCurrentLocationObject] = React.useState({
        city: '',
        state: '',
        country: '',
        locationId: ''
    }); // state to keep track of newly create locationId -- to fix bug that would add duplicate cities if state didn't update fast enough

    React.useEffect(() => {
        Google.placeSearch('houston, tx', null).then(data => console.log(data)).catch(e => console.log(e))
        // Google.placeDetails('ChIJD7fiBh9u5kcRYJSMaMOCCwQ', sessionToken).then(data => console.log(data)).then(e => console.log(e))
        // Google.placePhotos('AcYSjRib2XvYOWznJfg3ORpwZcNmtZBnpOXAWJLeQ2mSa8oz6fzDiZPRHrj0GmFCLzlnLIT3nc1c4OMsiUT3En4R9t7SmeqaeCIis3ZmrVcbjCHcSjDX7rh8HnYRJ0ByaKBXDS-nHtM4Wxy62bTYb9_Hc-vGxe6VlYlvA3qzweynx1OpVLOb').then(data => console.log(data))            
        // fetchUserInfo('rd').then(result => console.log(result));
        
    }, [0])    

    React.useEffect(() => {
        updateUser(userState.uid, pinmarkState);
    }, [pinmarkState])

    // React.useEffect(() => {       
    //     checkUser().then((response) => {
    //         if (response !== 'not signed in') {
    //             updatedSharedTrips(sharedTripsState);              
    //         }
    //     })
        
    // }, [sharedTripsState])
   
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
     
    }

    const handleShowDetails = (info) => {        
        console.log(info);
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
            setSecondModal(true);        
            setDetailInfo(detailObject);
        })
        
    }

    const handleClosePinmarkModal = () => {
        setSecondModal(false);
       
        // setShowSearch(true);
    }


    React.useEffect(() => {
        if (showSearch || secondModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [showSearch, secondModal])
    return (
        
        <div style={{overflow: 'scroll',height: '100vh',
        background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'

        }}>
            <MDBNavbar className='sticky-top' light bgColor='light'>
                <MDBContainer fluid>
                    
                    <MDBNavbarBrand className='w-100 d-flex justify-content-between align-items-center'> 
                        <MDBIcon icon='map-marked'/>
                        <h1 style={{fontFamily: 'Pacifico'}}>Pinmark</h1>  
                        
                    </MDBNavbarBrand>
                </MDBContainer>
            </MDBNavbar>
            <div className='d-flex justify-content-start flex-wrap text-white'>
                <h3 style={{padding: 20}}>Your Locations</h3>  
                <Locations /> 
            </div>
            <div className='d-flex justify-content-start flex-wrap text-white'>
                <h3 style={{padding: 20}}>Most Recent Pinmarks</h3>
                <Pinmarks />    
            </div>
            <div className='d-flex justify-content-start flex-wrap text-white'>
                <h3 style={{padding: 20}}>Most Recent Trips</h3>
                <Trips handlePinmarkDetail={handleShowDetails} />
            </div>
            <div className='d-flex justify-content-start flex-wrap text-white'>
                <h3 style={{padding: 20}}>Trips Shared With You</h3>
                <SharedTrips handlePinmarkDetail={handleShowDetails}/>
            </div>
            <MDBBtn onClick={handleShowSearch} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='search'/>
            </MDBBtn>
            <MDBModal tabIndex='-1' show={showSearch} setShow={setShowSearch}>
                <MDBModalDialog size='fullscreen-xxl-down' scrollable>
                    <MDBModalContent>
                        <SearchModal handleCloseModal={handleShowSearch} handlePinmarkDetail={handleShowDetails} handleAddPinmark={handleAddPinmark} handleDeletePinmark={handleDeletePinmark}/>
                        
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            <MDBModal staticBackdrop show={secondModal} setShow={setSecondModal} tabIndex='-1'>
                <MDBModalDialog size='fullscreen-md-down' centered scrollable className="justify-content-center align-item-center">
                    <MDBModalContent>
                        <PinmarkModal detailInfo={detailInfo} handleCloseModal={handleClosePinmarkModal}/>                       
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
        
    )
}

export default UserHome;