
export default class UserService{
    static async login(details) {
        const formBody: string[] = [];
        for (const property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        const formBodyString = formBody.join("&");

        const response = await fetch('http://164.92.164.196:8080/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBodyString
        })

        return response

    }
}