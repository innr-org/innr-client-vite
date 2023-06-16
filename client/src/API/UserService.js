import axios from "axios";
let BASE_URL
if(import.meta.env.MODE === "development"){
    BASE_URL=import.meta.env.VITE_SERVER_URL
}
else{
    BASE_URL=import.meta.env.VITE_SERVER_URL
}
const PORT = 8000

export default class UserService{
    // static async getScans(token){
    //     const headers = {
    //         "x-access-token": `${token}`,
    //         "Content-Type": 'application/json'
    //     }
    //
    //     const response = await axios.get(`${BASE_URL}:${PORT}/api/scan/history`, {
    //         headers: headers
    //     })
    //     return response
    // }

    static async getInfoById(token, id, type){
        const headers = {
            "x-access-token": `${token}`,
            "Content-Type": 'application/json'
        }

        const response = await axios.get(`${BASE_URL}:${PORT}/api/${type}/${id}`, {
            headers: headers
        })

        return response
    }

    static async login(details) {
       const body = {
           phone: details.phone,
           password: details.password
       }

        const response = await fetch(`${BASE_URL}:${PORT}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })

        return response

    }

    static async scan(token, details){
        const body = {
            images: details
        }
        const headers = {
            "x-access-token": `${token}`,
            "Content-Type": 'application/json'
        }

        const response = await axios.post(`${BASE_URL}:${PORT}/api/scan/create`, body, {
            headers: headers
        })

        return response

    }

    static async addEnroll(token, details){
        const headers = {
            "x-access-token": `${token}`,
            "Content-Type": 'application/json'
        }

        const response = await axios.post(`${BASE_URL}:${PORT}/api/enroll/create`, details, {
            headers: headers
        })

        return response

    }

}
