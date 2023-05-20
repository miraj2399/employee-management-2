import { BASE_URL } from "./Settings";

export async function AddEmployeesToDB(employees){
    const url = `${BASE_URL}/employees`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify(employees)
    });
    if(response.ok){
        return response.json();
    }
    else{
        throw response;
    }

}
   