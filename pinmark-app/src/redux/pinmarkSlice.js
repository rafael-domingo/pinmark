import { createSlice } from '@reduxjs/toolkit';

export const pinmarkSlice = createSlice({
    name: 'pinmarks',
    initialState: {
        locations: [            
            {
                placeId: '',
                locationName: {
                    mainText: '',
                    secondaryText: ''
                },
                geometry: {
                    lat: '',
                    lng: ''
                },
                latitude: '',
                longitude: '',
                photoURL: '',                
            }
        ],
        pinmarks: [
            {
                placeId: '',
                locationName: '',
                geometry: {
                    lat: '',
                    lng: ''
                },
                address: '',
                photoURL: '',
                rating: '',
                categories: [], 
                tripList: [], // array of tripIds that this pinmark is in
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
        addLocations: (state, action) => {
            state.locations.push(action.payload)
        },
        deleteLocations: (state, action) => {
            const updatedLocationsArray = [];
            state.locations.forEach((item) => {
                if(item.id !== action.payload) {
                    updatedLocationsArray.push(item)
                } 
            })
            return {
                ...state,
                locations: updatedLocationsArray
            }
        },
        addPinmark: (state, action) => {
            state.pinmarks.push(action.payload)
        },
        deletePinmark: (state, action) => {
            const updatedPinmarksArray = [];
            state.pinmarks.forEach((item) => {
                if(item.id !== action.payload) {
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
        }
    }
})

export const {
    setLocations,
    setPinmarks,
    setCategories,
    addLocations,
    deleteLocations,
    addPinmark,
    deletePinmark,
    addCategories,
    deleteCategories
} = pinmarkSlice.actions;
export default pinmarkSlice.reducer