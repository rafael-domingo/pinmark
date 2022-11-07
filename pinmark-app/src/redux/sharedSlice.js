import { createSlice, current } from '@reduxjs/toolkit';


export const sharedSlice = createSlice({
    name: 'sharedTrips',
    initialState: {
        shared: []
       
    },
    reducers: {
        setShared: (state, action) => {
            console.log(action.payload);
            state.shared = action.payload
        },
        addShared: (state, action) => {
            state.shared.push(action.payload);       
        },
        removeShared: (state, action) => {
            console.log(action.payload);
            var sharedArray = [];
            state.shared.forEach((item) => {
                console.log(current(item));
                if (item?.tripId === action.payload.tripId) {                                        
                    if (item?.receivingUserId !== action.payload.receivingUserId) {
                        sharedArray.push(item);
                    }                    
                } else {
                    sharedArray.push(item);
                }
            })
            console.log(sharedArray);
          
            return {
                ...state,
                shared: sharedArray
            };
        },
        removeLocations: (state, action) => {
            var sharedArray = [];
            state.shared.forEach((item) => {
                if (item.location.locationId === action.payload.locationId) {
                    if (item.sendingUserId !== action.payload.uid) {
                        sharedArray.push(item);
                    }                    
                } else {
                    sharedArray.push(item);
                }
            })
            return {
                ...state,
                shared: sharedArray
            }
        },
        resetSharedState: (state) => {
            return {
                ...state,
                shared: []
            }
        }
    }
})

export const {
    setShared,
    addShared,
    removeShared,
    removeLocations,
    resetSharedState
} = sharedSlice.actions;
export default sharedSlice.reducer