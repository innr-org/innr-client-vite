import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

let BASE_URL
if(import.meta.env.MODE === "development"){
    BASE_URL=import.meta.env.VITE_SERVER_URL
}
else{
    BASE_URL=import.meta.env.VITE_SERVER_URL
}

const PORT=8000

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        // base url of backend API
        baseUrl: `${BASE_URL}:${PORT}`,
        // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.userToken
            if (token) {
                // include token in req header
                headers.set('x-access-token', token)
                return headers
            }
        },
    }),
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => ({
                url: '/api/auth/profile',
                method: 'GET',
            }),
        }),
    }),
})

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserDetailsQuery } = authApi
