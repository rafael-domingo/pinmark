import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: '',
        email: '',
        phone: '',
        profilePicture: '',
        uid: ''
    },
    reducers: {
        setUserName: (state, action) => {
            state.userName = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPhone: (state, action) => {
            state.phone = action.payload
        },
        setProfilePicture: (state, action) => {
            state.profilePicture = action.payload
        },
        setUid: (state, action) => {
            state.uid = action.payload
        }
    }
})

export const {
    setUserName,
    setEmail,
    setPhone,
    setProfilePicture,
    setUid
} = userSlice.actions;
export default userSlice.reducer