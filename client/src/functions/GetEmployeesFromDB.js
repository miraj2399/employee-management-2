
import { BASE_URL } from "./Settings";
export async function GetEmployeesFromDB() {
   
    const url = `${BASE_URL}/employees`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        },
    });
    if(response.ok){
        const emplquery = await response.json();
        return emplquery;
    }
    else{
       return []
    }
}
