import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const backendURL = import.meta.env.VITE_SERVER_URL + ":8000"

export const userLogin = createAsyncThunk(
    '/api/auth/signin',
    async (userData, { rejectWithValue }) => {
        try {
            return await login(userData)
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)
export const userRegister = createAsyncThunk(
    '/api/auth/signup',
    async (userData, { rejectWithValue }) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }

            const body = {
                fullName: userData.fullName,
                phone: userData.phone,
                password: userData.password,
            }

            const { data, status } = await axios.post(
                `${backendURL}/api/auth/signup`,
                body,
                config
            )

            console.log(data)
            return await login({phone: userData.phone, password: userData.password})
        } catch (error) {
            console.log(error.response.data.message)
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

async function login(userData){
    // configure header's Content-Type as JSON
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    }

    const body = {
        phone: userData.phone,
        password: userData.password,

    }

    const { data } = await axios.post(
        `${backendURL}/api/auth/signin`,
        body,
        config
    )
    // store user's token in local storage
    localStorage.setItem('userToken', data.accessToken)
    return data
}
