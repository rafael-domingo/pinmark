import { configureStore } from "@reduxjs/toolkit";
import pinmarkReducer from './pinmarkSlice';
import userReducer from './userSlice';

export default configureStore({
    reducer: {
        pinmark: pinmarkReducer,
        user: userReducer
    },
})