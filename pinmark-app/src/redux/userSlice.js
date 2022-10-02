import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: '',
        email: '',
        phone: '',
        profilePicture: '',
        uid: '',
        authType: ''
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
        },
        setAuthType: (state, action) => {
            state.authType = action.payload
        }
    }
})

export const {
    setUserName,
    setEmail,
    setPhone,
    setProfilePicture,
    setUid,
    setAuthType
} = userSlice.actions;
export default userSlice.reducer