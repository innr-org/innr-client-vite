import { createSlice } from '@reduxjs/toolkit'
import {userLogin, userRegister} from './authActions'

const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null

const initialState = {
    loading: false,
    userInfo: null,
    userToken,
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken') // deletes token from storage
            state.loading = false
            state.userInfo = null
            state.userToken = null
            state.error = null
        },
        setCredentials: (state, { payload }) => {
            state.userInfo = payload
        },
    },
    extraReducers: {
        // login user
        [userLogin.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        [userLogin.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.userInfo = payload
            state.userToken = payload.userToken
            state.success = true
        },
        [userLogin.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },

        // register user reducer...
        [userRegister.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        [userRegister.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.userInfo = payload
            state.userToken = payload.userToken
            state.success = true
        },
        [userRegister.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
