import { BASE_URL } from "./Settings";

export async function UpdateEmployeesToDB(employee){
    const url = `${BASE_URL}/employees`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify(employee)
    });
    if(response.ok){
        return response.json();
    }
    throw response;
}