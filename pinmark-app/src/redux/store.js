import { configureStore } from "@reduxjs/toolkit";
import pinmarkReducer from './pinmarkSlice';
import userReducer from './userSlice';
import sharedTripsReducer from './sharedSlice';

export default configureStore({
    reducer: {
        pinmark: pinmarkReducer,
        user: userReducer,
        sharedTrips: sharedTripsReducer
    }    
})