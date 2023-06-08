import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const backendURL = 'http://localhost:8080'
export const userLogin = createAsyncThunk(
    'auth/login',
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
    '/auth/register',
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
                `${backendURL}/api/accounts`,
                body,
                config
            )

            console.log(await userData.phone)

            if(await status==201) {
                await login({phone: userData.phone, password: userData.password})
                return "ok"
            }
            else{
                console.log(status)
            }

        } catch (error) {
            console.log(error.message)
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
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    }

    const formBody =  [];
    for (const property in userData) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(userData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    const formBodyString = formBody.join("&");

    const { data } = await axios.post(
        `${backendURL}/api/auth/token`,
        formBodyString,
        config
    )
    // store user's token in local storage
    localStorage.setItem('userToken', data.token.accessToken)
    return data
}
