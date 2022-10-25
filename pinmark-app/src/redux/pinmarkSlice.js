import { createSlice } from '@reduxjs/toolkit';

export const pinmarkSlice = createSlice({
    name: 'pinmarks',
    initialState: {
        locations: [            
            {
                city: '',
                state: '',
                country: '',                
                locationId: ''
            }
            // {
            //     locationId: '',
            //     locationName: {
            //         mainText: '',
            //         secondaryText: ''
            //     },
            //     geometry: {
            //         lat: '',
            //         lng: ''
            //     },
            //     latitude: '',
            //     longitude: '',
            //     photoURL: '',                
            // }
        ],
        pinmarks: [
            {
                pinmarkId: '',
                locationId: '',
                locationName: '',
                geometry: {
                    lat: '',
                    lng: ''
                },
                address: '',
                photoURL: '',
                rating: '',
                categories: [], 
                tripIds: [], // array of tripIds that this pinmark is in
            }
        ],
        categories: [],
        tripLists: [
            {
                tripId: '',
                tripName: '',
                sharedWith: [] // array of uids that user has shared this trip with
            }
        ]
    },
    reducers: {
        setLocations: (state,action) => {
            state.locations = action.payload
        },
        setPinmarks: (state, action) => {
            state.pinmarks = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        setTripLists: (state, action) => {
            state.tripLists = action.payload
        },
        addLocations: (state, action) => {
            var newLocationsArray = state.locations
            newLocationsArray.push(action.payload)

            // alphabetize the locations array before updating redux state
            newLocationsArray.sort(function(a,b) {
                if(a.city < b.city) {
                    return -1
                }
                if(a.city > b.city) {
                    return 1
                }
                return 0
            })
            state.locations = newLocationsArray
        },
        deleteLocations: (state, action) => {
            // remove locaton from location array
            const updatedLocationsArray = [];
            state.locations.forEach((item) => {
                if(item.locationId !== action.payload) {
                    updatedLocationsArray.push(item)
                } 
            })
            // remove pinmarks at that location
            const updatedPinmarksArray = [];
            state.pinmarks.forEach((item) => {
                if (item.locationId.locationId !== action.payload) {
                    updatedPinmarksArray.push(item)
                }
            })
            // remove trips at that location
            const updatedTripsArray = [];
            state.tripLists.forEach((item) => {
                if (item.locationId !== action.payload) {
                    updatedTripsArray.push(item)
                }
            })
            return {
                ...state,
                pinmarks: updatedPinmarksArray,
                locations: updatedLocationsArray,
                tripLists: updatedTripsArray
            }
        },
        addPinmark: (state, action) => {
            state.pinmarks.push(action.payload)
        },
        deletePinmark: (state, action) => {
            const updatedPinmarksArray = [];            
            state.pinmarks.forEach((item) => {
                if(item.pinmarkId !== action.payload) {
                    updatedPinmarksArray.push(item)
                }
            })
            return {
                ...state,
                pinmarks: updatedPinmarksArray
            }
        },
        addPinmarkToTrip: (state, action) => {
            const updatedPinmarksArray = [];
            state.pinmarks.forEach((item) => {                
                if (item.pinmarkId === action.payload.pinmarkId) {                                      
                    // check to see if tripids already exists in this pinmark
                    if (item.tripIds.includes(action.payload.tripId)) {
                        updatedPinmarksArray.push(item)
                    } else {
                        updatedPinmarksArray.push({
                            ...item,
                            tripIds: [
                                ...item.tripIds,
                                action.payload.tripId
                            ]
                        })     
                    }                                 
                } else {
                    updatedPinmarksArray.push(item)
                }
            })
            return {
                ...state,                
                pinmarks: updatedPinmarksArray
            }
        },
        removePinmarkFromTrip: (state, action) => {
            const updatedPinmarksArray = [];
            state.pinmarks.forEach((item) => {                
                if (item.pinmarkId === action.payload.pinmarkId) {                                      
                    // remove tripid from tripidArray
                    const updatedTripIds = item.tripIds.filter(e => e !== action.payload.tripId)             
                    updatedPinmarksArray.push({
                        ...item,
                        tripIds: updatedTripIds
                    })                                
                } else {
                    updatedPinmarksArray.push(item)
                }
            })
            return {
                ...state,                
                pinmarks: updatedPinmarksArray
            }
        },
        addCategories: (state, action) => {
            state.categories.push(action.payload)
        },
        deleteCategories: (state, action) => {
            const updatedCategoriesArray = [];
            state.categories.forEach((item) => {
                if(item !== action.payload) {
                    updatedCategoriesArray.push(item)
                }
            })
            return {
                ...state,
                categories: updatedCategoriesArray
            }
        },
        addTripLists: (state, action) =>{
            state.tripLists.push(action.payload)
        },
        deleteTripLists: (state, action) => {
            const updatedTripListsArray = [];
            state.tripLists.forEach((item) => {
                if(item.tripId !== action.payload) {
                    updatedTripListsArray.push(item)
                }
            })
            return {
                ...state,
                tripLists: updatedTripListsArray
            }
        }
    }
})

export const {
    setLocations,
    setPinmarks,
    setCategories,
    setTripLists,
    addLocations,
    deleteLocations,
    addPinmark,
    deletePinmark,
    addPinmarkToTrip,
    removePinmarkFromTrip,
    addCategories,
    deleteCategories,
    addTripLists,
    deleteTripLists
} = pinmarkSlice.actions;
export default pinmarkSlice.reducer